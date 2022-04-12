import { WORDS } from "./wordlist";
import { VALID_GUESSES } from "./valid-guesses";

const WORDS_SET = new Set(WORDS);

export const isGuessValid = (guess) => {
  return WORDS_SET.has(guess) || VALID_GUESSES.has(guess);
};

export const getWordOfDay = () => {
  // March 7, 2022 Game Epoch
  const epochMs = new Date("March 7, 2022").valueOf();

  const MS_PER_DAY = 86400000;
  const index = Math.floor((Date.now() - epochMs) / MS_PER_DAY);

  return {
    solution: WORDS[index % WORDS.length],
    solutionIndex: index
  };
};

export const checkLetter = (guess, target, index) => {
  if (guess[index] === target[index]) {
    return 2;
  } else if (target.includes(guess[index])) {
    return 1;
  }
  
  return 0;
}

export const checkWin = (guess, target) => {
  return guess.toLowerCase() === target.toLowerCase();
};


export const checkGuess = (guessInput, targetInput) => {
  
  let output = [0,0,0,0,0];

  let guess = guessInput.toLowerCase();
  let target = targetInput.toLowerCase();

  
  let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  alphabet.forEach(function(letter) {
      if (guess.includes(letter)) {
          
          let letterOccurnces = 0;
          target.split("").forEach(element => {
              if (element === letter) {
                  letterOccurnces += 1;
              }
          });
      
          // Check for letters in the same position
          for (var i = 0; i < 5; i++) {
              if (guess[i] === letter && guess[i] === target[i]) {
                  output[i] = 2;
                  letterOccurnces -= 1;
              }
          }
          // Check for letters in word but different position
          for (var i = 0; i < 5; i++) {
              if (guess[i] === letter && output[i] != 2 && target.includes(guess[i]) && letterOccurnces > 0) {
                  output[i] = 1;
                  letterOccurnces -= 1;
              }
          }
          
         console.log("hello world");
      }
  });
      
  return output;
}
