import { WORDS } from "./wordlist";
import { VALID_GUESSES } from "./validGuesses";

export const isWordInWordList = (word) => {
  return (
    WORDS.includes(localeAwareLowerCase(word)) ||
    VALID_GUESSES.includes(localeAwareLowerCase(word))
  );
};

export const getWordOfTheDay = () => {
  const firstDayOfGame = new Date(2022, 2, 22); // First word at March 22, 2022
  const msOffset = Date.now() - firstDayOfGame; // Millisecond offset from start date
  const dayOffset = msOffset / 1000 / 60 / 60 / 24; // Convert milliseconds into day

  console.log(dayOffset);
  return WORDS[Math.floor(dayOffset)];
}

export const checkWin = (guess, target) => {
  return guess.lowerCase === target.lowerCase();
}