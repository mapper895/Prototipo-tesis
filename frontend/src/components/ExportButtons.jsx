import {
  exportDashboardToCSV,
  exportDashboardToPDF,
  exportAllEventsToJSON,
} from "../store/dashboardStore";

const ExportButtons = ({ username }) => {
  return (
    <div className="my-10 flex justify-center space-x-6">
      <button
        onClick={exportDashboardToPDF} // Aquí debes implementar la exportación a PDF
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Exportar a PDF
      </button>

      <button
        onClick={exportDashboardToCSV}
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Exportar a CSV
      </button>

      {username === "admin" && (
        <button
          onClick={exportAllEventsToJSON}
          className="px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
        >
          Exportar JSON
        </button>
      )}
    </div>
  );
};

export default ExportButtons;
