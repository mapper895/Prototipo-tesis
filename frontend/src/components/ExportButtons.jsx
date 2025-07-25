import { Loader } from "lucide-react";
import {
  exportDashboardToCSV,
  exportDashboardToPDF,
  exportAllEventsToJSON,
} from "../store/dashboardStore";

const LoadingIndicator = () => (
  <div className="flex justify-center items-center">
    <Loader className="animate-spin text-blue-500" size={40} />
    <p className="ml-2">Generando el reporte...</p>
  </div>
);

const ExportButtons = ({ username }) => {
  return (
    <>
      <div className="my-10 flex justify-center md:space-x-6 space-x-4">
        <button
          onClick={exportDashboardToPDF} // Aquí debes implementar la exportación a PDF
          className="md:px-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 md:text-base text-xs"
        >
          Exportar a PDF
        </button>

        <button
          onClick={exportDashboardToCSV}
          className="md:px-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 md:text-base text-xs"
        >
          Exportar a CSV
        </button>

        {username === "admin" && (
          <button
            onClick={exportAllEventsToJSON}
            className="md:px-6 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 md:text-base text-xs"
          >
            Exportar JSON
          </button>
        )}
      </div>
      <div id="loading" className="hidden mb-10">
        <LoadingIndicator />
      </div>
    </>
  );
};

export default ExportButtons;
