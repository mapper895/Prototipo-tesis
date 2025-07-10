import { isSameDay, isSameWeek, parse } from "date-fns";

export const filterEvents = (events, filter, selectedDate) => {
  const today = new Date();

  // Convierte una cadena "DD/MM/YYYY" en un objeto Date
  const parseEventDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  if (selectedDate) {
    return events.filter((event) =>
      event.dates.some((dateStr) =>
        isSameDay(parseEventDate(dateStr), selectedDate)
      )
    );
  }

  if (filter === "today") {
    return events.filter((event) =>
      event.dates.some((dateStr) => isSameDay(parseEventDate(dateStr), today))
    );
  }

  if (filter === "week") {
    return events.filter((event) =>
      event.dates.some(
        (dateStr) =>
          isSameWeek(parseEventDate(dateStr), today, { weekStartsOn: 1 }) // semana inicia en lunes
      )
    );
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
