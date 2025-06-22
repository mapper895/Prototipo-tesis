import { Event } from "../models/event.model.js";
import { parse } from "json2csv";
import PDFDocument from "pdfkit";
import fs from "fs";
import moment from "moment";

// Funcion para obtener stats del dashboard
export const getUserDashboardStats = async (req, res) => {
  const userId = req.user;

  try {
    // Obtener todos los eventos del creador
    const events = await Event.find({ createdBy: userId });

    // 1. Total de eventos creados
    const totalEvents = events.length;

    // 2. Total de likes
    const totalLikes = events.reduce(
      (sum, ev) => sum + (ev.likesCount || 0),
      0
    );

    // 3. Total de vistas
    const totalViews = events.reduce(
      (sum, ev) => sum + (ev.views || 0), // Sumamos las vistas de todos los eventos
      0
    );

    // Fechas base con moment
    const today = moment().startOf("day");
    const nextWeek = moment(today).add(7, "days");
    const firstDayCurrentMonth = moment(today).startOf("month");
    const firstDayLastMonth = moment(today)
      .subtract(1, "month")
      .startOf("month");
    const lastDayLastMonth = moment(today).subtract(1, "month").endOf("month");

    // 4. Eventos próximos (fechas en próximos 7 días)
    const upcomingEvents = events.filter((ev) =>
      ev.dates.some((dateStr) => {
        const eventDate = moment(dateStr, "DD/MM/YYYY");
        return eventDate.isAfter(today) && eventDate.isSameOrBefore(nextWeek);
      })
    );

    // 5. Evento mas likeado
    const mostLikedEvent = events.reduce(
      (max, ev) => (ev.likesCount > max.likesCount ? ev : max),
      events[0]
    );

    // 6. Evento con más vistas
    const mostViewedEvent = events.reduce(
      (max, ev) => (ev.views > max.views ? ev : max),
      events[0]
    );

    // 7. Likes a lo largo del tiempo (últimos 30 días)
    const last30Days = [...Array(30)]
      .map((_, i) => {
        const d = moment(today).subtract(i, "days");
        return { date: d.format("YYYY-MM-DD"), likes: 0 };
      })
      .reverse();

    events.forEach((event) => {
      const createdAtDate = moment(event.createdAt)
        .startOf("day")
        .format("YYYY-MM-DD");
      const match = last30Days.find((day) => day.date === createdAtDate);
      if (match) {
        match.likes += event.likesCount || 0;
      }
    });

    // 8. Eventos creados por mes
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
      const month = moment(event.createdAt).month();
      eventsPerMonth[month].count += 1;
    });

    // 9. Eventos caducos (terminados) solo del mes actual y mes anterior
    const expiredEvents = events.filter((ev) => {
      const eventDates = ev.dates.map((dateStr) =>
        moment(dateStr, "DD/MM/YYYY")
      );

      const allExpired = eventDates.every((eventDate) =>
        eventDate.isBefore(today, "day")
      );

      const hasDateInLastTwoMonths = eventDates.some(
        (date) =>
          date.isBetween(firstDayLastMonth, lastDayLastMonth, "day", "[]") ||
          date.isBetween(firstDayCurrentMonth, today, "day", "[]")
      );

      return allExpired && hasDateInLastTwoMonths;
    });

    res.json({
      totalEvents,
      totalLikes,
      totalViews,
      upcomingEvents,
      expiredEvents,
      mostLikedEvent,
      mostViewedEvent,
      events,
      likesOverTime: last30Days,
      eventsPerMonth,
    });
  } catch (error) {
    console.error("Error al obtener dashboard:", error);
    res.status(500).json({ message: "Error al obtener el dashboard" });
  }
};

// Funcion para exportar el reporte en CSV
export const exportDashboardToCSV = async (req, res) => {
  const userId = req.user._id;

  try {
    const events = await Event.find({ createdBy: userId });

    const convertToDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript
    };

    // Preparamos los datos a exportar
    const data = events.map((event) => {
      const sortedDates = event.dates.map(convertToDate).sort((a, b) => a - b);
      const startDate = sortedDates[0]; // Fecha de inicio
      const endDate = sortedDates[sortedDates.length - 1]; // Fecha de fin

      return {
        title: event.title,
        category: event.category,
        likes: event.likesCount,
        views: event.views,
        startDate: moment(startDate).format("DD/MM/YYYY"), // Fecha de inicio
        endDate: moment(endDate).format("DD/MM/YYYY"), // Fecha de fin
        createdAt: moment(event.createdAt).format("DD/MM/YYYY"), // Fecha de creación
      };
    });

    // Convertimos los datos a CSV
    const csv = parse(data);

    //  Guardamos el archivo CSV en el servidor
    const filePath = `reporte_eventos_${userId}.csv`;
    fs.writeFileSync(filePath, csv);

    // Enviamos el archivo CSV al cliente
    res.download(filePath, () => {
      // Eliminar archivo temporal despues de la descarga
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.log("Error al generar el reporte CSV", error);
    res.status(500).json({ message: "Error al generar el reporte CSV" });
  }
};

// Función para exportar el dashboard a PDF
export const exportDashboardToPDF = async (req, res) => {
  const userId = req.user._id;

  try {
    const events = await Event.find({ createdBy: userId });

    // Crear el documento PDF
    const doc = new PDFDocument();

    // Establecer la respuesta como un PDF (esto envía directamente el archivo al cliente sin guardarlo)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reporte_eventos_${userId}.pdf`
    );

    doc.pipe(res); // Enviar el archivo PDF directamente a la respuesta

    doc.fontSize(20).text("Reporte de Eventos", { align: "center" });

    const convertToDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    };

    // Agregar los eventos al PDF
    events.forEach((event, index) => {
      const sortedDates = event.dates
        .map((date) => convertToDate(date))
        .sort((a, b) => a - b);
      const startDate = sortedDates[0]; // Fecha de inicio (primer fecha)
      const endDate = sortedDates[sortedDates.length - 1]; // Fecha de fin (última fecha)

      // Mostrar las fechas de inicio y fin en formato adecuado
      const formattedStartDate = startDate.toLocaleDateString();
      const formattedEndDate = endDate.toLocaleDateString();

      doc
        .fontSize(12)
        .text(
          `${index + 1}. ${event.title} - ${event.category} - Likes: ${
            event.likesCount
          } - Views: ${
            event.views
          } - Fechas: ${formattedStartDate} a ${formattedEndDate}`
        );
    });

    doc.end(); // Terminar el documento PDF
  } catch (error) {
    console.error("Error al generar el reporte PDF", error);
    res.status(500).json({ message: "Error al generar el reporte PDF" });
  }
};

export const exportAllEvents = async (req, res) => {
  try {
    const user = req.user;

    if (user.username !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Acceso denegado" });
    }

    // Obtenemos los eventos de la base de datos
    const events = await Event.find();

    // Convertir los eventos a formato JSON
    const eventsJson = JSON.stringify(events, null, 2);

    // Establecemos los encabezados de la respuesta para indicar que es un JSON descargable
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=allEvents_${
        new Date().toISOString().split("T")[0]
      }.json`
    );

    // Enviamos el archivo JSON directamente en la respuesta
    res.send(eventsJson);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener eventos" });
  }
};
