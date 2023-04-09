import axios from "axios";
import { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Grid,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import lastFmLogo from './Last.fm-Logo.wine.png'

const StyledCard = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  width: "70%",
  [theme.breakpoints.up("sm")]: {
    height: "60vh",
    width: "50vw",
    margin: "auto",
    borderRadius: "16px",
    overflow: "hidden",
  },
}));

const LastFmLogo = ({ url }) => {
  return (
    <IconButton
      aria-label="Last.fm"
      target="_blank"
      rel="noopener noreferrer"
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img src={lastFmLogo} className="lastfm-logo" alt="Last.fm" style={{ height: '4vh', }} />
      </a>

    </IconButton>
  );
};

const StyledCard2 = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  width: "30%",
  [theme.breakpoints.up("sm")]: {
    height: "40vh",
    width: "85vw",
    margin: "auto",
    borderRadius: "16px",
    overflow: "hidden",
  },
}));



export default function SongRecommendation({ }) {
  const [songs, setSongs] = useState(false);
  const [isPlaying, setIsPlaying] = useState(0);
  const [songIndex, setSongIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [lastFmSong, setLastFmSong] = useState();
  const [lyrics, setLyrics] = useState();
  const theme = useTheme();
  const maxSteps = 5;

  useEffect(() => {
    let source = axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/spotify', {
          params: {},
          cancelToken: source.token
        });
        const sortedSongs = response.data.sort((a, b) => b.popularity - a.popularity);
        const five = sortedSongs.slice(0, 5);
        setSongs(five);
      } catch (error) {
        console.error(error)
      }
    }

    fetchData();

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
   // if (songs && songIndex) {
      async function fetchLastFmData() {
        try {
          const response = await axios.get('http://localhost:8000/lastfm-music', {
            params: {
              song: songs[songIndex].name,
              artist: songs[songIndex].artists[0].name
            },
          });
          const lastFmSong = response.data.track[0];
          setLastFmSong(lastFmSong);
        } catch (error) {
          console.error(error)
        }
      }

      fetchLastFmData();
  }, [songs, songIndex]);

  useEffect(() => {
    // if (songs && songIndex) {
       async function fetchLyrics() {
         try {
           const response = await axios.get('http://localhost:8000/lyrics', {
             params: {
               song: songs[songIndex].name,
               artist: songs[songIndex].artists[0].name
             },
           });
           const lyrics = response.data;
           console.log(lyrics)
           setLyrics(lyrics);
         } catch (error) {
           console.error(error)
         }
       }
 
       fetchLyrics();
   }, [songs, songIndex]);

  const handleNext = () => {
    setSongIndex((songIndex + 1) % songs.length);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setSongIndex((prevActiveStep) => prevActiveStep - 1);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    const audio = document.getElementById("audio");
    audio.play();
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCardClick = () => {
  };

  return (
    songs.length > 0 && (

      <Box sx={{ display: 'flex', flexGrow: 1, maxWidth: '100%' }}>
        <Box sx={{ flexGrow: 10, maxWidth: '30%', padding: '2rem' }}>
          <StyledCard2>
            <CardContent onClick={handleCardClick}>
              <Typography gutterBottom variant="h5" component="div">
                {songs[songIndex].name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {songs[songIndex].artists[0].name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {songs[songIndex].album.name} ({songs[songIndex].album.release_date})
              </Typography>
              {showDescription && (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Track Number: {songs[songIndex].track_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration:{" "}
                    {Math.floor(songs[songIndex].duration_ms / 1000 / 60)}:
                    {((songs[songIndex].duration_ms / 1000) % 60)
                      .toFixed(0)
                      .padStart(2, "0")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Explicit: {songs[songIndex].explicit ? "Yes" : "No"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Popularity: {songs[songIndex].popularity}/100
                  </Typography>
                  <Typography>
                    {lastFmSong ? <LastFmLogo url={lastFmSong.url} /> : ''}
                  </Typography>
                </>
              )}
              <Button style={{ backgroundColor: "#1C2331", color: "#dd9766" }} variant="contained" onClick={() => setShowDescription(!showDescription)}>
                {showDescription ? "Hide Description" : "Show Description"}
              </Button>
            </CardContent>
          </StyledCard2>
        </Box>
        <Box sx={{ flexGrow: 1, maxWidth: '70%' }}>
          <Grid item xs={12} sx={{ mt: '2rem' }}>
            <StyledCard
              sx={{
                backgroundImage: `url(${songs[songIndex].album.images[0].url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100%',
                width: '50%',
                position: 'absolute',
                top: '60%',
                left: '70%',
                transform: 'translate(-50%, -50%)',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%',
                  padding: '1rem',
                }}
                aria-label="play/pause"
                onClick={handleTogglePlay}
              >
                {isPlaying ? (
                  <PauseIcon sx={{ fontSize: '4rem' }} />
                ) : (
                  <PlayArrowIcon sx={{ fontSize: '6rem' }} />
                )}
              </IconButton>
            </StyledCard>
            <audio id="audio" src={songs[songIndex].preview_url} />
          </Grid>
        </Box>
        <MobileStepper
          steps={maxSteps}
          position="bottom"
          variant='dots'
          activeStep={songIndex}
          nextButton={
            <Button
              style={{ color: "#dd9766" }}
              size="small"
              onClick={handleNext}
              disabled={songIndex === maxSteps - 1}
            >
              Next
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              style={{ color: "#dd9766" }}
              size="small" onClick={handlePrevious} disabled={songIndex === 0}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Previous
            </Button>
          }
        />
        <Paper sx={{ flexGrow: 10, height: '30%', padding: '2rem' }}>
        <Box>
        {lyrics && (
              <Typography variant="body2" color="text.secondary">
                {lyrics.lyrics_body}
              </Typography>
            )}
        </Box>
        </Paper>
      </Box>

    )
  )
}            