export const getWeekdays = () => {
  const weekdays = [];
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: "short" };
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    weekdays.push(day.toLocaleDateString("en-US", options));
  }
  return weekdays;
};
