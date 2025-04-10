const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="p-4 bg-gray-100 rounded-lg shadow">
        <p className="text-xl font-semibold">Total de Eventos</p>
        <p className="text-2xl">{stats.totalEvents}</p>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg shadow">
        <p className="text-xl font-semibold">Total de Likes</p>
        <p className="text-2xl">{stats.totalLikes}</p>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg shadow">
        <p className="text-xl font-semibold">Total de Vistas</p>
        <p className="text-2xl">{stats.totalViews}</p>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg shadow">
        <p className="text-xl font-semibold">Eventos Próximos</p>
        <p className="text-2xl">{stats.upcomingEvents.length}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
