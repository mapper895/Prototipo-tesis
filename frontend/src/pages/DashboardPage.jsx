// DashboardPage.js
import React, { useState, useEffect } from "react";
import DashboardStats from "../components/DashboardStats";
import DashboardChart from "../components/DashboardChart";
import ExportButtons from "../components/ExportButtons";
import PopularEvents from "../components/DashboardPopularEvents"; // Importar el nuevo componente
import { getDashboardStats } from "../store/dashboardStore"; // Función de Store
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEvents: 0,
    totalLikes: 0,
    totalViews: 0,
    upcomingEvents: [],
    mostLikedEvent: {},
    mostViewedEvent: {},
    likesOverTime: [],
    eventsPerMonth: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setDashboardData(data);
      } catch (error) {
        console.error("Error al obtener los datos del dashboard", error);
      }
    };

    fetchData();
  }, []);

  // Configuración para la gráfica de Likes a lo largo del tiempo
  const likesChartData = {
    labels: dashboardData.likesOverTime.map((day) => day.date),
    datasets: [
      {
        label: "Likes en los Últimos 30 Días",
        data: dashboardData.likesOverTime.map((day) => day.likes),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  // Configuración para la gráfica de Eventos por Mes
  const eventsChartData = {
    labels: dashboardData.eventsPerMonth.map((month) => month.month),
    datasets: [
      {
        label: "Eventos por Mes",
        data: dashboardData.eventsPerMonth.map((month) => month.count),
        fill: false,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.1,
        type: "bar", // Usamos un gráfico de barras para los eventos por mes
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Dashboard de Eventos</h1>

        {/* Resumen de Estadísticas */}
        <DashboardStats stats={dashboardData} />

        {/* Gráfica de Likes */}
        <DashboardChart chartData={likesChartData} chartType="line" />

        {/* Gráfica de Eventos por Mes */}
        <DashboardChart chartData={eventsChartData} chartType="bar" />

        {/* Botones de Exportación */}
        <ExportButtons events={dashboardData.upcomingEvents} />

        {/* Mostrar los eventos más likeados y con más vistas */}
        <PopularEvents
          mostLikedEvent={dashboardData.mostLikedEvent}
          mostViewedEvent={dashboardData.mostViewedEvent}
        />
      </div>
    </>
  );
};

export default DashboardPage;
