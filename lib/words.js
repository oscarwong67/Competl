import { WORDS } from "./wordlist";
import { VALID_GUESSES } from "./validGuesses";

const FIRST_DAY_OFFSET = new Date(2022, 2, 22); // First word at March 22, 2022

export const isWordInWordList = (word) => {
  return (
    WORDS.includes(localeAwareLowerCase(word)) ||
    VALID_GUESSES.includes(localeAwareLowerCase(word))
  );
};

export const getWordOfTheDay = () => {
  const msOffset = Date.now() - FIRST_DAY_OFFSET; // Millisecond offset from start date
  const dayOffset = msOffset / 1000 / 60 / 60 / 24; // Convert milliseconds into day

  return WORDS[Math.floor(dayOffset)];
}

export const checkLetter = (guess, target, index) => {
  if (guess[index] === target[index]) {
    return 2;
  } else if (target.includes(guess[index])) {
    return 1;
  }
  
  return 0;
}

export const checkWin = (guess, target) => {
  return guess.lowerCase() === target.lowerCase();
}