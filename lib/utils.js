export function getFormattedTime(timeInMs) {
  const MS_PER_MINUTE = 60000;
  const MS_PER_SECOND = 1000;

  let time = timeInMs;
  const minutes = Math.floor(time / MS_PER_MINUTE);
  time %= MS_PER_MINUTE;

  const seconds = Math.floor(time / MS_PER_SECOND);
  time %= MS_PER_SECOND;

  const zeroPad = (num, places) => String(num).padStart(places, "0");
  return `${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}:${zeroPad(time, 2)}`;
}