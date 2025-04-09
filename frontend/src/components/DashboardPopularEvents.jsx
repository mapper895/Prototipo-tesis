import React from "react";

const PopularEvents = ({ mostLikedEvent, mostViewedEvent }) => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Eventos Más Populares</h3>
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h4 className="text-xl font-semibold">Evento Más Likeado</h4>
          <p>{mostLikedEvent.title}</p>
          <p>Likes: {mostLikedEvent.likesCount}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h4 className="text-xl font-semibold">Evento Con Más Vistas</h4>
          <p>{mostViewedEvent.title}</p>
          <p>Vistas: {mostViewedEvent.views}</p>
        </div>
      </div>
    </div>
  );
};

export default PopularEvents;
