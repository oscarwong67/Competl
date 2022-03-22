import { WORDS } from "./wordlist";
import { VALID_GUESSES } from "./validGuesses";

export const isWordInWordList = (word) => {
  return (
    WORDS.includes(localeAwareLowerCase(word)) ||
    VALID_GUESSES.includes(localeAwareLowerCase(word))
  );
};