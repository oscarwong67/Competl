import TimerIcon from "@mui/icons-material/Timer";
import { Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getWordOfDay } from '../lib/words';
import { getFormattedTime } from '../lib/utils';

export default function Game() {
  const [timeInMs, setTimeInMs] = useState(0.0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    console.log(`Today's word is: ${getWordOfDay().solution.toUpperCase()}`);
  });

  return (
    <div className="game-container">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TimerIcon color="inherit" />
        </Grid>
        <Grid item xs={6}>
          <Typography>{getFormattedTime(timeInMs)}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}