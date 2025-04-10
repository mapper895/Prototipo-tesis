// DashboardPage.js
import { useState, useEffect } from "react";
import DashboardStats from "../components/DashboardStats";
import DashboardChart from "../components/DashboardChart";
import ExportButtons from "../components/ExportButtons";
import { getDashboardStats } from "../store/dashboardStore"; // Función de Store
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setDashboardData(data);
      } catch (error) {
        console.error("Error al obtener los datos del dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Verificamos si hay eventos
  const noEvents = dashboardData.totalEvents === 0;

  // Configuración para la gráfica de Likes a lo largo del tiempo
  const likesChartData = {
    labels: dashboardData.likesOverTime.map((day) => day.date),
    datasets: [
      {
        label: "Número de likes",
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
  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col gap-5 my-10">
          <h2 className="text-6xl font-light">Dashboard de tus Eventos</h2>
          <p className="text-lg">
            Aquí podras ver las estadisticas de tus eventos.
          </p>
        </div>

        {/* Si no hay eventos mostramos el mensaje */}
        {noEvents ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-700">
              No has creado ningun evento
            </h2>
            <p className="mt-4 text-gray-500">
              No tienes eventos creados. Empieza por crear uno para ver las
              estadisticas y los graficos de tus eventos.
            </p>
          </div>
        ) : (
          <>
            {/* Resumen de Estadísticas */}
            <DashboardStats stats={dashboardData} />

            {/* Mostrar los eventos más likeados y con más vistas */}
            <div className="mt-20">
              <h3 className="text-3xl font-semibold mb-4">
                Eventos más populares
              </h3>
              <div className="grid grid-cols-2 gap-7 my-5">
                {/* Evento mas likeado */}
                <div className="space-y-4">
                  <div className="flex justify-between mx-4">
                    <h4 className="text-xl">Evento Con Más Likes</h4>
                    <div className="mt-2 text-gray-500">
                      <span>
                        Likes: {dashboardData.mostViewedEvent.likesCount}
                      </span>
                    </div>
                  </div>
                  <EventCard event={dashboardData.mostLikedEvent} />
                </div>
                {/* Evento con mas vistas */}
                <div className="space-y-4">
                  <div className="flex justify-between mx-4">
                    <h4 className="text-xl">Evento Con Más Vistas</h4>
                    <div className="mt-2 text-gray-500">
                      <span>Vistas: {dashboardData.mostViewedEvent.views}</span>
                    </div>
                  </div>
                  <EventCard event={dashboardData.mostViewedEvent} />
                </div>
              </div>
            </div>

            {/* Mostrar proximos eventos */}
            <div className="mt-20">
              <h3 className="text-3xl font-semibold mb-4">
                Tus próximos eventos
              </h3>
              <div className="grid grid-cols-4 gap-7 my-5">
                {dashboardData.upcomingEvents.length !== 0 ? (
                  dashboardData.upcomingEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))
                ) : (
                  <p>No tienes eventos próximos</p>
                )}
              </div>
            </div>

            {/* Resumen en Graficas */}
            <div className="my-20">
              <h3 className="text-3xl font-semibold">Resumen en gráficas</h3>
              <div className="flex space-x-4 mt-6">
                {/* Gráfica de Likes */}
                <div className="flex-1 mx-4">
                  <h3 className="text-xl mb-4">Likes en los últimos días</h3>
                  <DashboardChart chartData={likesChartData} chartType="line" />
                </div>
                {/* Gráfica de Eventos por Mes */}
                <div className="flex-1 mx-4">
                  <h3 className="text-xl mb-4">Eventos creados en cada mes</h3>
                  <DashboardChart chartData={eventsChartData} chartType="bar" />
                </div>
              </div>
            </div>

            {/* Botones de Exportación */}
            <ExportButtons events={dashboardData.upcomingEvents} />
          </>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
