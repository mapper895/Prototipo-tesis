import { isSameDay, isSameWeek, parse } from "date-fns";

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
  return reservations.filter((reservation) => {
    const eventDate = parse(reservation.eventDate, "dd/MM/yyyy", new Date());

    if (filter === "today") {
      return isSameDay(eventDate, new Date());
    }

    if (filter === "week") {
      return isSameWeek(eventDate, new Date(), { weekStartsOn: 1 }); // semana inicia en lunes
    }

    if (filter === "custom" && selectedDate) {
      return isSameDay(eventDate, selectedDate);
    }

    return true; // "all"
  });
};
