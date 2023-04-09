import { Grid, Typography, Toolbar } from "@mui/material";
import SongRecommendation from './SongRecommendation';
import GlobalStyles from '@mui/material/GlobalStyles';
import logo from './logo_1.png';

export default function App() {
  const homePageStyles = (
    <GlobalStyles
      styles={{
        body: {
          backgroundColor: '#f0f0f0',
          width: '100%',
          margin:'0 auto',
          'margin-left': 'auto', 
          'margin-right': 'auto'
        },
        '.MuiTypography-root': {
          color: '#dd9766',
        },
      }}
    />
  );

  return (
    <>
      {homePageStyles}
      <Toolbar sx={{backgroundColor: '#1C2331'}}>
        <img src={logo} alt="Logo" style={{height: '15vh', margin: 'auto'}}/>

      </Toolbar>
      <Grid container component='main' direction="column" alignItems="center" spacing={4} padding="10vh" >
        <Grid item>
          {<SongRecommendation/>}
        </Grid>
      </Grid>
    </>
  );
}
