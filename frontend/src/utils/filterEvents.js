export const filterEvents = (events, filter, selectedDate) => {
  const now = new Date();

  if (selectedDate) {
    return events.filter((event) => {
      // Verificamos si alguna de las fechas del evento coincide con la fecha seleccionada
      return event.dates.some((dateString) => {
        const eventDate = new Date(dateString.split("/").reverse().join("-")); // Convertimos dd/MM/yyyy a yyyy-MM-dd
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    });
  }

  if (filter === "today") {
    return events.filter((event) => {
      // Verificar si alguna de las fechas del evento corresponde al día actual
      return event.dates.some((dateString) => {
        const eventDate = new Date(dateString.split("/").reverse().join("-"));
        return (
          eventDate.getDate() === now.getDate() &&
          eventDate.getMonth() === now.getMonth() &&
          eventDate.getFullYear() === now.getFullYear()
        );
      });
    });
  }

  if (filter === "week") {
    const startOfWeek = now;
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + 7);

    return events.filter((event) => {
      // Verificar si alguna de las fechas del evento está dentro de esta semana
      return event.dates.some((dateString) => {
        const eventDate = new Date(dateString.split("/").reverse().join("-"));
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      });
    });
  }

  return events;
};
