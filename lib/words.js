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
