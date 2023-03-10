export function convertToLocalTime(date: Date, timeZone: string) {
  return new Date(date).toLocaleString(timeZone, {hour12: false});
}
