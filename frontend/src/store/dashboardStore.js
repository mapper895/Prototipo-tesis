import axios from "axios";
import toast from "react-hot-toast";

// Función para obtener las estadísticas del dashboard
export const getDashboardStats = async () => {
  try {
    const response = await axios.get("/api/v1/dashboard/stats"); // Ruta para obtener estadísticas
    return response.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Error al obtener las estadisticas"
    );
    throw new Error("Error al obtener las estadísticas");
  }
};

// Función para exportar a CSV con fecha en el nombre del archivo
export const exportDashboardToCSV = async () => {
  try {
    document.getElementById("loading").classList.remove("hidden");

    const response = await axios.get("/api/v1/dashboard/export/csv", {
      responseType: "blob", // Asegurarse de que el backend devuelva un blob
    });

    // Obtener la fecha actual y formatearla como YYYY-MM-DD
    const currentDate = new Date().toISOString().split("T")[0]; // Ej: 2025-04-10
    const fileName = `reporte_eventos_${currentDate}.csv`; // Nombre del archivo con fecha

    const url = window.URL.createObjectURL(new Blob([response.data])); // Crear URL del archivo CSV
    const link = document.createElement("a"); // Crear un enlace de descarga
    link.href = url;
    link.setAttribute("download", fileName); // Usar el nombre con fecha
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Eliminar el enlace después de hacer clic
    document.getElementById("loading").classList.add("hidden");
  } catch (error) {
    toast.error(error.response?.data?.message || "Error al generar el CSV");
  }
};

// Función para exportar el dashboard a PDF
export const exportDashboardToPDF = async () => {
  try {
    document.getElementById("loading").classList.remove("hidden");

    const response = await axios.get("/api/v1/dashboard/export/pdf", {
      responseType: "blob",
    });

    // Asegurarte de que es un PDF y no otro tipo de archivo
    const contentType = response.headers["content-type"];
    if (contentType === "application/pdf") {
      // Crear un objeto URL a partir del blob recibido
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Obtener la fecha actual y formatearla como YYYY-MM-DD
      const currentDate = new Date().toISOString().split("T")[0]; // Ej: 2025-04-10
      // Crear un enlace temporal para descargar el archivo PDF
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_eventos_${currentDate}.pdf`); // Establecer el nombre del archivo
      document.body.appendChild(link);
      link.click(); // Simular un clic para iniciar la descarga
      document.body.removeChild(link); // Eliminar el enlace después de la descarga

      document.getElementById("loading").classList.add("hidden");

      window.URL.revokeObjectURL(url);
    } else {
      alert("No se ha recibido un archivo PDF");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Error al generar el PDF");
  }
};

// Función para exportar todos los eventos a JSON con fecha en el nombre del archivo
export const exportAllEventsToJSON = async () => {
  try {
    const response = await axios.get("/api/v1/dashboard/export/all-events", {
      responseType: "blob",
    });

    // Obtener la fecha actual y formatearla como YYYY-MM-DD
    const currentDate = new Date().toISOString().split("T")[0]; // Ej: 2025-04-10
    const fileName = `allEvents_${currentDate}.json`; // Nombre del archivo con fecha

    const url = window.URL.createObjectURL(new Blob([response.data])); // Crear URL del archivo JSON
    const link = document.createElement("a"); // Crear un enlace de descarga
    link.href = url;
    link.setAttribute("download", fileName); // Usar el nombre con fecha
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Eliminar el enlace después de hacer clic
  } catch (error) {
    toast.error(error.response?.data?.message || "Error al generar el JSON");
  }
};
