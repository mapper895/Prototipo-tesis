export const filterEvents = (events, filter, selectedDate) => {
  const now = new Date();

  if (selectedDate) {
    return events.filter((event) => {
      const d = new Date(event.date);
      return (
        d.getDate() === selectedDate.getDate() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear()
      );
    });
  }

  if (filter === "today") {
    return events.filter((event) => {
      const d = new Date(event.date);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
  }

  if (filter === "week") {
    const next = new Date(now);
    next.setDate(now.getDate() + 7);
    return events.filter((event) => {
      const d = new Date(event.date);
      return d >= now && d <= next;
    });
  }

  return events;
};
