import { isSameDay, isSameWeek, isWithinInterval, parse } from "date-fns";

export const filterEvents = (events, filter, selectedDate) => {
  const today = new Date();

  const parseDate = (dateStr) => {
    // Convierte "dd/MM/yyyy" a Date
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  if (selectedDate) {
    return events.filter((event) =>
      event.dates.some((dateStr) => isSameDay(parseDate(dateStr), selectedDate))
    );
  }

  if (filter === "today") {
    return events.filter((event) =>
      event.dates.some((dateStr) => isSameDay(parseDate(dateStr), today))
    );
  }

  if (filter === "week") {
    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + 6); // 7 días desde hoy

    return events.filter((event) =>
      event.dates.some((dateStr) =>
        isWithinInterval(parseDate(dateStr), {
          start: today,
          end: endOfWeek,
        })
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
