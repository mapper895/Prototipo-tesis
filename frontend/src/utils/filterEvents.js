export const filterEvents = (events, filter, selectedDate) => {
  const now = new Date();

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (selectedDate) {
    const selectedStr = formatDate(selectedDate);
    return events.filter((event) => event.dates.includes(selectedStr));
  }

  if (filter === "today") {
    const todayStr = formatDate(now);
    return events.filter((event) => event.dates.includes(todayStr));
  }

  if (filter === "week") {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return events.filter((event) => {
      return event.dates.some((dateStr) => {
        const [day, month, year] = dateStr.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        return date >= today && date <= nextWeek;
      });
    });
  }

  return events;
};

export const filterReservations = (reservations, filter, selectedDate) => {
  const now = new Date();

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (selectedDate) {
    const selectedStr = formatDate(selectedDate);
    return reservations.filter(
      (reservation) => reservation.eventDate === selectedStr
    );
  }

  if (filter === "today") {
    const todayStr = formatDate(now);
    return reservations.filter(
      (reservation) => reservation.eventDate === todayStr
    );
  }

  if (filter === "week") {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return reservations.filter((reservation) => {
      const [day, month, year] = reservation.eventDate.split("/");
      const resDate = new Date(`${year}-${month}-${day}`);
      return resDate >= today && resDate <= nextWeek;
    });
  }

  return reservations;
};
