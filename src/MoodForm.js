import { useState } from "react";
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import MusicNoteIcon from '@mui/icons-material/HeadphonesRounded';
import MoodIcon from "@mui/icons-material/Mood";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { Tooltip } from '@mui/material';

const StyledMusicNoteIcon = styled(MusicNoteIcon)({
  fontSize: '2rem',
  marginRight: '0.5rem',
});

const StyledIconButton = styled(IconButton)({
  color: 'white',
});

const StyledForm = styled('form')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  border: 'none',
 // backgroundColor: 'transparent',
});

export default function MoodForm({ onMoodSubmit }) {
  const [mood, setMood] = useState("");
  const [query, setQuery] = useState("");

  const handleMoodClick = (event, mood) => {
    event.preventDefault();
    onMoodSubmit(mood);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onMoodSubmit(query);
  };

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          label="Search songs"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          margin="none"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <StyledIconButton type="submit">
                <SearchIcon />
              </StyledIconButton>
            ),
          }}
        />
      </StyledForm>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
  <Tooltip title="Sad">
    <MoodIcon onClick={(event) => handleMoodClick(event, 'sad')} />
  </Tooltip>
  <Tooltip title="Happy">
    <MoodBadIcon onClick={(event) => handleMoodClick(event, 'happy')} />
  </Tooltip>
  <Tooltip title="Love">
    <FavoriteIcon onClick={(event) => handleMoodClick(event, 'love')} />
  </Tooltip>
  <Tooltip title="Excited">
    <SentimentVerySatisfiedIcon onClick={(event) => handleMoodClick(event, 'excited')} />
  </Tooltip>
</div>
    </>
  );
}
