const PORT = 8000
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const randomWords = require('random-words');
const seedrandom = require('seedrandom');

require('dotenv').config()

const app = express()
const API_KEY = process.env.REACT_APP_API_KEY_SONG_FM
const SPOTIFY_CLIENT_ID = process.env.REACT_APP_API_KEY_SPOTIFY_CLIENT_ID
const SPOTIFY_SECRET = process.env.REACT_APP_API_KEY_SPOTIFY_SECRET
const MUSIC_MATCH = process.env.REACT_APP_API_KEY_MUSIC_MATCH

app.use(cors());
app.options('*', cors()); // this enables preflight
app.use(express.json());
app.use(express.urlencoded());

// Define a fixed seed
const seed = 'my-random-seed';
// Generate a word based on the current date and the seed
const currentDate = new Date();
const timestamp = Math.floor(currentDate.getTime() / (24 * 60 * 60 * 1000)); // Use the number of days since the Unix epoch as the timestamp
const rng = seedrandom(`${seed}-${timestamp}`);
const currentWord = randomWords({ exactly: 1, seed: rng });
const wordOfTheDay = currentWord[0];

async function getToken() {
    const URL = `https://accounts.spotify.com/api/token`
    const spotify_token = `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_SECRET}`
    const authParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: spotify_token
    }
    const response = await fetch(URL, authParams)
    const result = await response.json()
    return result
}

app.get('/lyrics', (req, resp) => {
    const song = req.query.song
    const artist = req.query.artist
    const URL = `http://api.musixmatch.com/ws/1.1/matcher.lyrics.get?apikey=${MUSIC_MATCH}&q_track=${song}&q_artist=${artist}`
    axios.request(URL).then((response) => {
        const status_code = response.data.message.header.status_code
        if (status_code !== 200){
            resp.json('Lyrics Not available')
        } else {
            resp.json(response.data.message.body)
        }
    }).then((error) => {
        console.error(error)
    })
})

app.get('/lastfm-music', (req, resp) => {
    const song = req.query.song
    const artist = req.query.artist
    const URL = `https://ws.audioscrobbler.com/2.0/?method=track.search&artist=${artist}&track=${song}&api_key=${API_KEY}&format=json`
    axios.request(URL).then((response) => {
        resp.json(response.data.results.trackmatches)
    }).then((error) => {
        console.error(error)
    })
})

app.get('/spotify', (req, resp) => {

    getToken().then(result => {
        const t = result.access_token
        const spotify_url = 'https://api.spotify.com/v1/search'
        axios.get(`${spotify_url}?q=${wordOfTheDay}&type=track&include_external=audio`, {
            params: { limit: 50, offset: 0 },
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + t,
                'Content-Type': 'application/json',
            },
        })
            .then(res => res)
            .then(res => {
                const data = res.data.tracks.items
                resp.json(data)
            })

    })
})

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))