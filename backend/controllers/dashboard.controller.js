import { Event } from "../models/event.model.js";

export const getUserDashboardStats = async (req, res) => {
  const { userId } = req.params;

  try {
    // Obtener todos los eventos del creador
    const events = await Event.find({ organizer: userId });

    // 1. Total de eventos creados
    const totalEvents = events.length;

    // 2. Total de likes
    const totalLikes = events.reduce(
      (sum, ev) => sum + (ev.likesCount || 0),
      0
    );

    // 3. Eventos próximos
    const upcomingEvents = events.filter(
      (ev) => new Date(ev.date) > new Date()
    );

    // 4. Eventos más populares (top 3 por likes)
    const popularEvents = [...events]
      .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
      .slice(0, 3); // Top 3 más populares

    // 5. Likes a lo largo del tiempo (últimos 30 días)
    const today = new Date();
    const last30Days = [...Array(30)]
      .map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0]; // yyyy-mm-dd
        return { date: dateStr, likes: 0 };
      })
      .reverse();

    events.forEach((event) => {
      const dateKey = new Date(event.createdAt).toISOString().split("T")[0];
      const match = last30Days.find((day) => day.date === dateKey);
      if (match) {
        match.likes += event.likesCount || 0;
      }
    });

    // 6. Eventos creados por mes
    const monthMap = {
      0: "Enero",
      1: "Febrero",
      2: "Marzo",
      3: "Abril",
      4: "Mayo",
      5: "Junio",
      6: "Julio",
      7: "Agosto",
      8: "Septiembre",
      9: "Octubre",
      10: "Noviembre",
      11: "Diciembre",
    };

    const eventsPerMonth = Array.from({ length: 12 }, (_, i) => ({
      month: monthMap[i],
      count: 0,
    }));

    events.forEach((event) => {
      const month = new Date(event.createdAt).getMonth();
      eventsPerMonth[month].count += 1;
    });

    res.json({
      totalEvents,
      totalLikes,
      upcomingEvents: upcomingEvents.slice(0, 5),
      popularEvents,
      events,
      likesOverTime: last30Days,
      eventsPerMonth,
    });
  } catch (error) {
    console.error("Error al obtener dashboard:", error);
    res.status(500).json({ message: "Error al obtener el dashboard" });
  }
};
