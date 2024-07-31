import { set } from 'date-fns/set';

export function getTimeAsDate(time, date = new Date()) {
  const timeRegex = /^\d{1,2}:\d{2}:\d{2}$/;
  const isValidFormat = timeRegex.test(time);
  if (!isValidFormat) {
    throw new Error('invalid format for time must be 00:00:00');
  }
  const [hour, minute, second] = time.split(':');
  return set(date, {
    hours: Number(hour),
    minutes: Number(minute),
    seconds: Number(second),
  });
}
