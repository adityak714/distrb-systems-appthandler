//convert date
export function convertDate(date: string): Date {
  const convertedDate = new Date(date);
  convertedDate.setHours(convertedDate.getHours() + 1);
  return convertedDate;
}
