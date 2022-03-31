import TimerIcon from '@mui/icons-material/Timer';
import { Grid, Typography, Container } from '@mui/material';
import styles from '../styles/Game.module.css';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { useState, useEffect } from 'react';
import { getWordOfDay, isGuessValid, checkLetter, checkWin } from '../lib/words';

const WORD_LENGTH = 5;

export default function Game() {
  const [timeInMS, setTimeInMS] = useState(0.0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    console.log(`Today's word is: ${getWordOfDay().solution.toUpperCase()}`);  
    window.addEventListener("keydown", handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  function startInteraction() {
    window.addEventListener("click", handleMouseClick);
    window.addEventListener("keydown", handleKeyPress);
  }

  function stopInteraction() {
    window.removeEventListener("click", handleMouseClick);
    window.removeEventListener("keydown", handleKeyPress);
  }

  function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
      pressKey(e.target.dataset.key);
      return;
    }

    if(e.target.matches("[data-enter]")) {
      submitWord();
      return;
    }

    if(e.target.matches("[data-delete]")) {
      deleteLetter();
      return;
    }
  }

  function handleKeyPress(e) {
    if(e.key === "Enter") {
      submitWord();
      return;
    }

    if(e.key === "Backspace" || e.key === "Delete"){
      deleteLetter();
      return;
    }

    if(e.key.match(/^[a-z]$/)) {
      pressKey(e.key);
      return;
    }
  }

  function pressKey(key) {
    const activeTiles = getActiveTiles();
    if (activeTiles.length >= WORD_LENGTH) return;
    const gameboard = window.document.querySelector(`.${styles.gameboard}`);
    const nextTile = gameboard.querySelector(":not([data-letter])");
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = "active";
  }

  function deleteLetter() {
    const activeTiles = getActiveTiles();
    const lastTile = activeTiles[activeTiles.length-1];
    if(lastTile == null) return;
    lastTile.textContent = '';
    delete lastTile.dataset.state;
    delete lastTile.dataset.letter;
  }

  function submitWord() {
    const activeTiles = [...getActiveTiles()];
    if (activeTiles.length !== WORD_LENGTH){
      // TODO make a pop up of this message and animation if you want i guess
      console.log("Not long enough!");
      return;
    }

    const guess = activeTiles.reduce((word, tile) => {
      return word + tile.dataset.letter
    }, "");

    if(!isGuessValid(guess)){
      // TODO make a pop up of this message and animation if you want i guess
      console.log("Not in word list!");
      return;
    }

    stopInteraction();
    activeTiles.forEach((...params) => setTiles(...params, guess))
  }

  function setTiles(tile, index, array, guess){
    const wordOfDay = getWordOfDay().solution;
    const keyboard = window.document.querySelector(`.${styles.keyboard}`)
    const letter = tile.dataset.letter.toUpperCase();
    const key = keyboard.querySelector(`[data-key="${letter}"]`);
    
    const letterValue = checkLetter(guess, wordOfDay, index);

    switch(letterValue){
      case 2:
        tile.dataset.state = "correct";
        key.classList.add(`${styles.correct}`);
        break;
      case 1:
        tile.dataset.state = "wrong-position";
        key.classList.add(`${styles.wrongPostion}`);
        break;
      case 0:
        tile.dataset.state = "wrong";
        key.classList.add(`${styles.wrong}`);
    }

    if(index === array.length - 1) {
      startInteraction();
      if(checkWin(guess, wordOfDay)){
        // TODO pop up and whatever idk
        console.log("Congratulations! You guessed the word");
        stopInteraction();
      }
    }
  }

  function getActiveTiles() {
    const gameboard = window.document.querySelector(`.${styles.gameboard}`);
    return gameboard.querySelectorAll('[data-state="active"]');
  }
    
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
      <div className={styles.gameboard}>
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
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
        <div className={styles.tile}></div>
      </div>
      <div className={styles.keyboard}>
        <div className={styles.keyboardRow}>
          <button className={styles.key} data-key="Q" onClick={startInteraction}>
            Q
          </button>
          <button className={styles.key} data-key="W" onClick={startInteraction}>
            W
          </button>
          <button className={styles.key} data-key="E" onClick={startInteraction}>
            E
          </button>
          <button className={styles.key} data-key="R" onClick={startInteraction}>
            R
          </button>
          <button className={styles.key} data-key="T" onClick={startInteraction}>
            T
          </button>
          <button className={styles.key} data-key="Y" onClick={startInteraction}>
            Y
          </button>
          <button className={styles.key} data-key="U" onClick={startInteraction}>
            U
          </button>
          <button className={styles.key} data-key="I" onClick={startInteraction}>
            I
          </button>
          <button className={styles.key} data-key="O" onClick={startInteraction}>
            O
          </button>
          <button className={styles.key} data-key="P" onClick={startInteraction}>
            P
          </button>
        </div>

        <div className={styles.space}></div>
        <div className={styles.keyboardRow}>
          <button className={styles.key} data-key="A" onClick={startInteraction}>
            A
          </button>
          <button className={styles.key} data-key="S" onClick={startInteraction}>
            S
          </button>
            <button className={styles.key} data-key="D" onClick={startInteraction}>
            D
          </button>
          <button className={styles.key} data-key="F" onClick={startInteraction}>
            F
          </button>
          <button className={styles.key} data-key="G" onClick={startInteraction}>
            G
          </button>
          <button className={styles.key} data-key="H" onClick={startInteraction}>
            H
          </button>
          <button className={styles.key} data-key="J" onClick={startInteraction}>
            J
          </button>
          <button className={styles.key} data-key="K" onClick={startInteraction}>
            K
          </button>
          <button className={styles.key} data-key="L" onClick={startInteraction}>
            L
          </button>
        </div>
        <div className={styles.space}></div>
        <div className={styles.keyboardRow}>
          <button data-enter className={styles.keyLarge} onClick={startInteraction}>ENTER</button>
          <button className={styles.key} data-key="Z" onClick={startInteraction}>
            Z
          </button>
          <button className={styles.key} data-key="X" onClick={startInteraction}>
            X
          </button>
          <button className={styles.key} data-key="C" onClick={startInteraction}>
            C
          </button>
          <button className={styles.key} data-key="V" onClick={startInteraction}>
            V
          </button>
          <button className={styles.key} data-key="B" onClick={startInteraction}>
            B
          </button>
          <button className={styles.key} data-key="N" onClick={startInteraction}>
            N
          </button>
          <button className={styles.key} data-key="M" onClick={startInteraction}>
            M
          </button>
          <button data-delete className={styles.keyLarge} onClick={startInteraction}><BackspaceIcon /></button>
        </div>
      </div>
    </Container>
  );
}
