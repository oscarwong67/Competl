import TimerIcon from "@mui/icons-material/Timer";
import { Grid, Typography, Container, Snackbar } from "@mui/material";
import { useSession } from "next-auth/react";
import styles from "../styles/Game.module.css";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useState, useEffect } from "react";
import {
  getWordOfDay,
  isGuessValid,
  checkLetter,
  checkWin,
} from "../lib/words";
import { getFormattedTime } from "../lib/utils";

const WORD_LENGTH = 5;

export default function Game() {
  const [timeInMs, setTimeInMs] = useState(0.0);
  const [isGuessed, setIsGuessed] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  let numGuesses = 0;
  const { data: session } = useSession();

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    console.log(`Today's word is: ${getWordOfDay().solution.toUpperCase()}`);
  }, []);

  function startGame() {
    if (isGameStarted) {
      return;
    }
    setIsGameStarted(true);
    const button = window.document.querySelector("[data-start-button]");
    button.classList.add(`${styles.hide}`);

    window.document.addEventListener("click", handleMouseClick);
    window.document.addEventListener("keydown", handleKeyPress);
  }

  function stopInteraction() {
    console.log("Interaction Stopped");
    window.document.removeEventListener("click", handleMouseClick);
    window.document.removeEventListener("keydown", handleKeyPress);
  }

  const handleMouseClick = (e) => {
    if (isGuessed) return;

    if (e.target.matches("[data-key]")) {
      pressKey(e.target.dataset.key);
      return;
    }

    if (e.target.matches("[data-enter]")) {
      submitWord();
      return;
    }
    if (
      e.target.matches("[data-delete]") ||
      (e.target.parentNode && e.target.parentNode.matches("[data-delete]")) ||
      // Backspace icon path
      (e.target.getAttribute("d") &&
        e.target
          .getAttribute("d")
          .includes(
            "M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"
          ))
    ) {
      deleteLetter();
      return;
    }
  };

  const handleKeyPress = (e) => {
    if (isGuessed) return;

    if (e.key === "Enter") {
      submitWord();
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      deleteLetter();
      return;
    }

    if (e.key.match(/^[a-z]$/)) {
      pressKey(e.key);
      return;
    }
  };

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
    const lastTile = activeTiles[activeTiles.length - 1];
    if (lastTile == null) return;
    lastTile.textContent = "";
    delete lastTile.dataset.state;
    delete lastTile.dataset.letter;
  }

  function submitWord() {
    const activeTiles = [...getActiveTiles()];
    if (activeTiles.length !== WORD_LENGTH) {
      showAlert("Not enough letters!");
      return;
    }

    const guess = activeTiles.reduce((word, tile) => {
      return word + tile.dataset.letter;
    }, "");

    if (!isGuessValid(guess)) {
      showAlert("Not in word list!");
      return;
    }
    numGuesses++;
    activeTiles.forEach((...params) => setTiles(...params, guess));
  }

  function setTiles(tile, index, array, guess) {
    const wordOfDay = getWordOfDay().solution;
    const keyboard = window.document.querySelector(`.${styles.keyboard}`);
    const letter = tile.dataset.letter.toUpperCase();
    const key = keyboard.querySelector(`[data-key="${letter}"]`);

    const letterValue = checkLetter(guess, wordOfDay, index);

    switch (letterValue) {
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

    if (index === array.length - 1) {
      if (checkWin(guess, wordOfDay)) {
        showAlert("Congratulations! You guessed the word");
        setIsGuessed(true);
        stopInteraction();
        onGameCompletion(true);
      } else if (numGuesses === 6) {
        showAlert("You lost!");
        stopInteraction();
        onGameCompletion(false);
      }
    }
  }

  async function onGameCompletion(isWin) {
    let position = Number.MAX_SAFE_INTEGER;
    if (isWin) {
      const positionRes = await fetch("/api/scores/addScore", {
        method: "POST",
        body: JSON.stringify({
          userId: session.user._id,
          timeInMs,
          numGuesses,
          dateString: new Date().toString(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      position = await positionRes.json();
    }
    await fetch("/api/stats/updateStats", {
      method: "POST",
      body: JSON.stringify({
        userId: session.user._id,
        isWin,
        numGuesses,
        leaderboardPosition: position,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    props.refreshLeaderboard();
  }

  function getActiveTiles() {
    const gameboard = window.document.querySelector(`.${styles.gameboard}`);
    return gameboard.querySelectorAll('[data-state="active"]');
  }

  function showAlert(message, duration = 1000) {
    const alertContainer = window.document.querySelector(
      "[data-alert-container]"
    );
    const alert = document.createElement("div");
    alert.textContent = message;
    alert.classList.add(`${styles.alert}`);
    alertContainer.prepend(alert);
    if (duration == null) return;

    setTimeout(() => {
      alert.classList.add(`${styles.hide}`);
      alert.addEventListener("transitionend", () => {
        alert.remove();
      });
    }, duration);
  }

  return (
    <Container className={styles.gameContainer}>
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ textAlign: "right", paddingLeft: "0px" }}>
          <TimerIcon color="inherit" />
        </Grid>
        <Grid item xs={6} sx={{ paddingLeft: "5px" }}>
          <Typography>{getFormattedTime(timeInMs)}</Typography>
        </Grid>
      </Grid>
      <div data-start-button className={styles.startButtonContainer}>
        <button className={styles.startButton} onClick={startGame}>
          START
        </button>
      </div>
      <div data-alert-container className={styles.alertContainer}></div>
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
          <button className={styles.key} data-key="D">
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
        <div className={styles.space}></div>
        <div className={styles.keyboardRow}>
          <button data-enter className={styles.keyLarge}>
            ENTER
          </button>
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
          <button data-delete className={styles.keyLarge}>
            <BackspaceIcon data-delete />
          </button>
        </div>
      </div>
    </Container>
  );
}
