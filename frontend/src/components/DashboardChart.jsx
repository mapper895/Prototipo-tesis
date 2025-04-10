// DashboardChart.js
import { useEffect, useRef } from "react";
import { Chart } from "chart.js";

// Importar todos los componentes necesarios de Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
} from "chart.js";

// Registrar todos los componentes necesarios
ChartJS.register(
  CategoryScale, // Escala de categorías para el eje X
  LinearScale, // Escala lineal para el eje Y
  LineElement, // Elemento de línea para dibujar la línea
  PointElement, // Elemento de punto para los puntos en la gráfica de línea
  BarElement, // Elemento de barra para los gráficos de barras
  Title, // Título de la gráfica
  Tooltip, // Tooltip para mostrar información al pasar el mouse
  Legend, // Leyenda
  LineController, // Controlador para el gráfico de líneas
  BarController // Controlador para el gráfico de barras
);

const DashboardChart = ({ chartData, chartType }) => {
  const chartContainer = useRef(null); // Referencia al contenedor del gráfico
  const chartInstance = useRef(null); // Para almacenar la instancia del gráfico

  useEffect(() => {
    // Si ya existe una instancia del gráfico, destrúyela antes de crear una nueva
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Crear un nuevo gráfico cada vez que los datos cambien
    chartInstance.current = new Chart(chartContainer.current, {
      type: chartType, // Tipo de gráfico, puede ser 'line' o 'bar'
      data: chartData,
      options: {
        responsive: true,
        scales: {
          x: {
            type: "category", // Escala 'category' para el eje X
          },
          y: {
            beginAtZero: true, // Asegúrate de que el eje Y comience desde 0
          },
        },
      },
    });

    // Limpiar el gráfico cuando el componente se desmonte o los datos cambien
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]); // Solo recrear el gráfico si los datos cambian

  return <canvas ref={chartContainer}></canvas>; // Renderiza el gráfico en un <canvas>
};

export default DashboardChart;
