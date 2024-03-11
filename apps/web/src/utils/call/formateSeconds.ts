import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export function formatSeconds(seconds: number): string {
  const duration = dayjs.duration(seconds, 'seconds');
  const hours = duration.hours();
  const minutes = duration.minutes();
  const secs = duration.seconds();

  let formattedTime = '';

  if (hours > 0) {
    formattedTime += hours.toString().padStart(2, '0') + ':';
  }

  formattedTime += minutes.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');

  return formattedTime;
}
