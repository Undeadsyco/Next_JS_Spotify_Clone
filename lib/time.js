export function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  console.log('seconds', seconds < 10);
  return seconds === 60 
    ? `${minutes + 1}:00`
    : `${minutes}:${seconds > 10 ? `${seconds}` : `0${seconds}`}`;
}