import TimerIcon from "@mui/icons-material/Timer";
import { Grid, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import { useState } from "react";
import styles from '../styles/Home.module.css'


export default function Game() {
  const [timeInMS, setTimeInMS] = useState(0.0);

  function getFormattedTime() {
    const MS_PER_MINUTE = 60000;
    const MS_PER_SECOND = 1000;

    let time = timeInMS;
    const minutes = Math.floor(time / MS_PER_MINUTE);
    time %= MS_PER_MINUTE;
    
    const seconds = Math.floor(time / MS_PER_SECOND);
    time %= MS_PER_SECOND;

    const zeroPad = (num, places) => String(num).padStart(places, "0");
    return `${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}:${zeroPad(time, 2)}`;
  }

  return (
    <div className="game-container">
      <Grid container spacing={2} >
        <Grid item xs={6} sx={{ textAlign: "right"}}>
          <TimerIcon color="inherit" />
        </Grid>
        <Grid item xs={6} sx={{ paddingLeft: "5px"}}>
          <Typography>{getFormattedTime()}</Typography>
        </Grid>
      </Grid>
      <div className={styles.board}>
        <div className={styles.row}>
        
          <div className={styles.tile}>
            
          </div>
          <div className={styles.tile}>

          </div>
          <div className={styles.tile}>

          </div>
          <div className={styles.tile}>

          </div>
          <div className={styles.tile}>

          </div>
          
        </div>
        
      </div>
    </div>
  );
}