export function convertSeconds(s: number) {
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min < 10 ? `0${min}` : `${min}`}:${sec < 10 ? `0${sec}` : `${sec}`}`;
}
