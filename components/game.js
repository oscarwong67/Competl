import TimerIcon from "@mui/icons-material/Timer";
import { Grid, Typography, Container } from "@mui/material";
import { useSession, signIn } from "next-auth/react";
import styles from "../styles/Game.module.css";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  getWordOfDay,
  isGuessValid,
  checkLetter,
  checkWin,
  checkGuess,
} from "../lib/words";
import { getFormattedTime } from "../lib/utils";

const WORD_LENGTH = 5;

function clearLocalStorageIfNewDay() {
  if (typeof window !== "undefined") {
    const startTime = parseInt(localStorage.getItem("startTime"));
    const prevDayStr = new Date(startTime).toDateString();
    if (startTime && prevDayStr != new Date().toDateString()) {
      console.log('Clearing Local Storage as user last played on ' + prevDayStr + ' and it\'s now' + new Date().toDateString());
      localStorage.clear();
    }
  }
}

export default function Game({ refreshLeaderboard, popupOpen }) {
  const popupOpenRef = useRef(popupOpen);  
  const { data: session, status } = useSession();
  const [startTime, setStartTime] = useState(() => {
    if (typeof window !== 'undefined') {
      clearLocalStorageIfNewDay();
      const saved = localStorage.getItem('startTime');
      const initialValue = JSON.parse(saved);
      return initialValue || Date.now();
    }
    return Date.now();
  })

  const getTimeInMs = () => {
    if (typeof window !== 'undefined') {
      clearLocalStorageIfNewDay();
      const saved = localStorage.getItem("startTime");
      const startTime = parseInt(JSON.parse(saved));
      if (startTime) {
        let currentTime = Date.now()
        const endTime = parseInt(localStorage.getItem('endTime'));
        if (endTime) {
          currentTime = endTime
        }
        const initialValue = currentTime - startTime;
        return initialValue || 0;
      }
    }
    return 0;
  };

  let timeInMs = useRef(getTimeInMs());

  const [isActive, setIsActive] = useState(false);
  const [timeDisplayed, setDisplayTime] = useState(padTime(parseInt(timeInMs.current / (60 * 1000) ))+":"+padTime(parseInt(timeInMs.current/1000 % 60))+":"+padTime(parseInt(timeInMs.current/10 % 100)));
  
  let gameAlreadyPlayedToday = false;
  if (session) {
    const { dateLastPlayedStr } = session.user;
    gameAlreadyPlayedToday =
      dateLastPlayedStr &&
      dateLastPlayedStr === new Date().toDateString() &&
      !JSON.parse(localStorage.getItem("isGameStarted"));
  }

  const [isGameStarted, setIsGameStarted] = useState(() => {
    if (typeof window !== "undefined") {
      clearLocalStorageIfNewDay();
      const saved = localStorage.getItem("isGameStarted");
      const initialValue = JSON.parse(saved);
      if (initialValue && !isActive) {
        startTimer();
      }
      return initialValue || false;
    }
    return false;
  });
  const getNumGuesses = () => {
    if (typeof window !== "undefined") {
      clearLocalStorageIfNewDay();
      const saved = localStorage.getItem("numGuesses");
      const initialValue = JSON.parse(saved);
      return initialValue || 0;
    }
    return 0;
  };
  let numGuesses = useRef(getNumGuesses());
  const [guesses, setGuesses] = useState(() => {
    if (typeof window !== "undefined") {
      clearLocalStorageIfNewDay();
      const saved = localStorage.getItem("guesses");
      const initialValue = JSON.parse(saved);
      return initialValue || [];
    }
    return [];
  });

  let guessed = false;
  const [isGuessed, setIsGuessed] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(() => {
    if (typeof window !== "undefined") {
      clearLocalStorageIfNewDay();
      const saved = localStorage.getItem("isGameCompleted");
      const initialValue = JSON.parse(saved);
      return initialValue || false;
    }
  });

  function startTimer() {
    setIsActive(true);
  }

  function stopTimer() {
    setIsActive(false);
  }

  const updateDisplay = useCallback(() => {    
    setDisplayTime(padTime(parseInt(timeInMs.current / (60 * 1000) ))+":"+padTime(parseInt(timeInMs.current/1000 % 60))+":"+padTime(parseInt(timeInMs.current/10 % 100)));
  }, [timeInMs]);

  function padTime(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // console.log(`Today's word is: ${getWordOfDay().solution.toUpperCase()}`);
    if (isGameStarted) {
      const button = window.document.querySelector("[data-start-button]");
      button.classList.add(`${styles.hide}`);
      window.document.addEventListener("click", handleMouseClick);
      window.document.addEventListener("keydown", handleKeyPress);
    }

    if (guesses.length > 0) {
      guesses.forEach((wordObj) => {
        const word = wordObj.word;
        for(let i = 0; i < word.length; i++) {
          const letter = word.charAt(i);
          const gameboard = window.document.querySelector(
            `.${styles.gameboard}`
          );
          const nextTile = gameboard.querySelector(":not([data-letter])");
          if (nextTile) {
            nextTile.dataset.letter = letter.toLowerCase();
            nextTile.textContent = letter;
            nextTile.dataset.state = "active";
          }
        }
        const activeTiles = getActiveTiles();
        activeTiles.forEach((...params) => setTiles(...params, word));
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("guesses", JSON.stringify(guesses));
  }, [guesses]);

  useEffect(() => {
    localStorage.setItem("isGameStarted", isGameStarted);
  }, [isGameStarted]);

  // Timer
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        timeInMs.current = (Date.now() - startTime);
        updateDisplay();
      }, 10);
    } else if (!isActive && timeInMs !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeInMs.current, updateDisplay]);

  function startGame() {
    if (isGameStarted || gameAlreadyPlayedToday) return;
    console.log("Game Started");
    const button = window.document.querySelector("[data-start-button]");
    button.classList.add(`${styles.hide}`);

    window.document.addEventListener("click", handleMouseClick);
    window.document.addEventListener("keydown", handleKeyPress);

    localStorage.setItem("isGameStarted", true);
    setIsGameStarted(true);

    fetch("/api/user/updateDateLastPlayed", {
      method: "POST",
      body: JSON.stringify({
        userId: session.user._id,
        dateStr: new Date().toDateString(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const currentTime = Date.now()
    localStorage.setItem('startTime', currentTime);
    setStartTime(currentTime);
    startTimer();
  }

  function stopInteraction() {
    // console.log("Interaction Stopped");
    window.document.removeEventListener("click", handleMouseClick);
    window.document.removeEventListener("keydown", handleKeyPress);

    stopTimer();
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

  useEffect(() => {
    popupOpenRef.current = popupOpen;
  }, [popupOpen])

  const handleKeyPress = (e) => {
    if (popupOpenRef.current) return;
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
    numGuesses.current += 1;
    localStorage.setItem("numGuesses", numGuesses.current);
    console.log('time in ms', timeInMs.current);
    setGuesses(guesses => [...guesses, { word: guess, time: timeInMs.current }]);
    activeTiles.forEach((...params) => setTiles(...params, guess));


  }

  function setTiles(tile, index, array, guess) {
    const wordOfDay = getWordOfDay().solution;
    const keyboard = window.document.querySelector(`.${styles.keyboard}`);
    const letter = tile.dataset.letter.toUpperCase();
    const key = keyboard.querySelector(`[data-key="${letter}"]`);

    const letterValue = checkGuess(guess, wordOfDay)[index];

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

    if (index === array.length - 1 && !isGameComplete) {
      if (checkWin(guess, wordOfDay)) {
        showAlert("Congratulations! You guessed the word");
        setIsGuessed(true);
        stopInteraction();
        onGameCompletion(true);
        setIsGameComplete(true);
        localStorage.setItem("isGameCompleted", true);
      } else if (numGuesses.current === 6) {
        showAlert(`You lost! The word was ${guess}`);
        stopInteraction();
        onGameCompletion(false);
        setIsGameComplete(true);
        localStorage.setItem("isGameCompleted", true);
      }
      const currentTime = Date.now()
      localStorage.setItem('endTime', currentTime);
    } else if (isGameComplete || gameAlreadyPlayedToday) {
      stopInteraction();
    }
  }

  async function onGameCompletion(isWin) {
    // if (!session) {
    //   signIn();
    // }

    let position = Number.MAX_SAFE_INTEGER;
    const guessesNum = parseInt(numGuesses.current);
    if (isWin) {
      console.log("Won with " + numGuesses.current + " guesses in " + timeInMs.current + "ms."); 
      const time = parseInt(timeInMs.current);
      const positionRes = await fetch("/api/scores/addScore", {
        method: "POST",
        body: JSON.stringify({
          userId: session.user._id,
          timeInMs: time,
          numGuesses: guessesNum,
          dateString: new Date().toString(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      position = await positionRes.json();
      localStorage.setItem('position', position);
    }
    await fetch("/api/stats/updateStats", {
      method: "POST",
      body: JSON.stringify({
        userId: session.user._id,
        isWin,
        numGuesses: guessesNum,
        leaderboardPosition: position,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    refreshLeaderboard();
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
          <Typography>
            <span id="displayTime">{timeDisplayed}</span>
          </Typography>
        </Grid>
      </Grid>
      <div data-start-button className={styles.startButtonContainer}>
        <button
          className={styles.startButton}
          onClick={() => {
            startGame();
            if (gameAlreadyPlayedToday) {
              showAlert("You Already Played Today!");
            }
          }}
        >
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
