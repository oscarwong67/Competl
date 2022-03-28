import TimerIcon from '@mui/icons-material/Timer';
import { Grid, Typography, Container } from '@mui/material';
import { useState } from 'react';
import styles from '../styles/Game.module.css';
import BackspaceIcon from '@mui/icons-material/Backspace';

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

    const zeroPad = (num, places) => String(num).padStart(places, '0');
    return `${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}:${zeroPad(time, 2)}`;
  }

  return (
    <Container className={styles.gameContainer}>
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ textAlign: 'right', paddingLeft: '0px' }}>
          <TimerIcon color="inherit" />
        </Grid>
        <Grid item xs={6} sx={{ paddingLeft: '5px' }}>
          <Typography>{getFormattedTime()}</Typography>
        </Grid>
      </Grid>
      <div className={styles.gameBoard}>
        <div className={styles.tile} data-state="active">
          T
        </div>
        <div className={styles.tile} data-state="correct">
          H
        </div>
        <div className={styles.tile} data-state="wrong-postion">
          O
        </div>
        <div className={styles.tile} data-state="wrong">
          S
        </div>
        <div className={styles.tile}>E</div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
      </div>
      <div className={styles.keyboard}>
        <div className={styles.keyboardRow}>
          <button className={styles.key} data-key="Q">
            Q
          </button>
          <button className={styles.key} data-key="W">
            W
          </button>
          <button className={styles.key} data-key="E">
            E
          </button>
          <button className={styles.key} data-key="R">
            R
          </button>
          <button className={styles.key} data-key="T">
            T
          </button>
          <button className={styles.key} data-key="Y">
            Y
          </button>
          <button className={styles.key} data-key="U">
            U
          </button>
          <button className={styles.key} data-key="I">
            I
          </button>
          <button className={styles.key} data-key="O">
            O
          </button>
          <button className={styles.key} data-key="P">
            P
          </button>
        </div>

        <div className={styles.space}></div>
        <div className={styles.keyboardRow}>
          <button className={styles.key} data-key="A">
            A
          </button>
          <button className={styles.key} data-key="S">
            S
          </button>
            <button className={`${styles.key} ${styles.correct}`} data-key="D">
            D
          </button>
          <button className={styles.key} data-key="F">
            F
          </button>
          <button className={styles.key} data-key="G">
            G
          </button>
          <button className={styles.key} data-key="H">
            H
          </button>
          <button className={styles.key} data-key="J">
            J
          </button>
          <button className={styles.key} data-key="K">
            K
          </button>
          <button className={styles.key} data-key="L">
            L
          </button>
        </div>

        <div className={styles.keyboardRow}>
          <button data-enter className={styles.keyLarge}>ENTER</button>
          <button className={styles.key} data-key="Z">
            Z
          </button>
          <button className={styles.key} data-key="X">
            X
          </button>
          <button className={styles.key} data-key="C">
            C
          </button>
          <button className={styles.key} data-key="V">
            V
          </button>
          <button className={styles.key} data-key="B">
            B
          </button>
          <button className={styles.key} data-key="N">
            N
          </button>
          <button className={styles.key} data-key="M">
            M
          </button>
          <button data-enter className={styles.keyLarge}><BackspaceIcon /></button>
        </div>
      </div>
    </Container>
  );
}
