const EventFormComponent = ({
  eventData,
  setEventData,
  categories,
  isLoadingCategories,
  handleSubmit,
  isCreatingEvent,
  isUpdatingEvent,
  eventId,
}) => {
  // Función para agregar una nueva fecha
  const handleAddDate = () => {
    setEventData({
      ...eventData,
      dates: [...eventData.dates, ""], // Agregar un campo vacío para la nueva fecha
    });
  };

  // Función para eliminar una fecha
  const handleRemoveDate = (index) => {
    const newDates = eventData.dates.filter((_, i) => i !== index);
    setEventData({ ...eventData, dates: newDates });
  };

  // Función para agregar un nuevo horario
  const handleAddTime = () => {
    setEventData({
      ...eventData,
      schedules: [...eventData.schedules, ""], // Agregar un campo vacío para el nuevo horario
    });
  };

  // Función para eliminar un horario
  const handleRemoveTime = (index) => {
    const newSchedules = eventData.schedules.filter((_, i) => i !== index);
    setEventData({ ...eventData, schedules: newSchedules });
  };

  // Función para manejar el campo de costos
  const handleAddCost = () => {
    setEventData({
      ...eventData,
      costs: [...eventData.costs, { type: "", price: "" }], // Añadimos un nuevo campo vacío para el costo
    });
  };

  const handleRemoveCost = (index) => {
    const newCosts = eventData.costs.filter((_, i) => i !== index);
    setEventData({ ...eventData, costs: newCosts });
  };

  const handleCostChange = (index, field, value) => {
    const newCosts = [...eventData.costs];
    newCosts[index][field] = value;
    setEventData({ ...eventData, costs: newCosts });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="title"
          className="text-sm font-medium text-gray-700 block"
        >
          Nombre del evento
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
          placeholder="Nombre del evento"
          id="title"
          value={eventData.title}
          onChange={(e) =>
            setEventData({ ...eventData, title: e.target.value })
          }
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700 block"
        >
          Descripción del evento
        </label>
        <textarea
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
          placeholder="Descripción del evento"
          id="description"
          value={eventData.description}
          onChange={(e) =>
            setEventData({ ...eventData, description: e.target.value })
          }
        />
      </div>
      <div>
        <label
          htmlFor="categories"
          className="text-sm font-medium text-gray-700 block"
        >
          Categoria
        </label>
        <select
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
          id="categories"
          value={eventData.category}
          onChange={(e) =>
            setEventData({ ...eventData, category: e.target.value })
          }
        >
          <option value="">Seleccionar categoria</option>
          {isLoadingCategories
            ? "Cargando categorias"
            : categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="location"
          className="text-sm font-medium text-gray-700 block"
        >
          Lugar
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
          placeholder="Lugar del evento"
          id="location"
          value={eventData.location}
          onChange={(e) =>
            setEventData({ ...eventData, location: e.target.value })
          }
        />
      </div>

      {/* Sección para las fechas */}
      <div>
        <label
          htmlFor="date"
          className="text-sm font-medium text-gray-700 block"
        >
          Fechas del evento
        </label>
        {eventData.dates.map((date, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="date"
              className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
              value={date}
              onChange={(e) => {
                const newDates = [...eventData.dates];
                newDates[index] = e.target.value;
                setEventData({ ...eventData, dates: newDates });
              }}
            />
            <button
              type="button"
              className="text-red-500"
              onClick={() => handleRemoveDate(index)}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button type="button" className="text-blue-500" onClick={handleAddDate}>
          Agregar fecha
        </button>
      </div>

      {/* Sección para los horarios */}
      <div>
        <label
          htmlFor="time"
          className="text-sm font-medium text-gray-700 block"
        >
          Horarios del evento
        </label>
        {eventData.schedules.map((time, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="time"
              className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
              value={time}
              onChange={(e) => {
                const newSchedules = [...eventData.schedules];
                newSchedules[index] = e.target.value;
                setEventData({ ...eventData, schedules: newSchedules });
              }}
            />
            <button
              type="button"
              className="text-red-500"
              onClick={() => handleRemoveTime(index)}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button type="button" className="text-blue-500" onClick={handleAddTime}>
          Agregar horario
        </button>
      </div>

      <div>
        <label
          htmlFor="duration"
          className="text-sm font-medium text-gray-700 block"
        >
          Duración del evento
        </label>
        <input
          type="number"
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
          placeholder="Duración del evento (ej. 2 horas)"
          id="duration"
          value={eventData.duration}
          onChange={(e) =>
            setEventData({ ...eventData, duration: e.target.value })
          }
        />
      </div>
      <div>
        <label
          htmlFor="target"
          className="text-sm font-medium text-gray-700 block"
        >
          Público objetivo
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
          placeholder="Ej. A partir de 18 años"
          id="target"
          value={eventData.target}
          onChange={(e) =>
            setEventData({ ...eventData, target: e.target.value })
          }
        />
      </div>
      <div>
        <label
          htmlFor="accessibility"
          className="text-sm font-medium text-gray-700 block"
        >
          Accesibilidad
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
          placeholder="Ej. Accesible para personas con discapacidad"
          id="accessibility"
          value={eventData.accessibility}
          onChange={(e) =>
            setEventData({ ...eventData, accessibility: e.target.value })
          }
        />
      </div>
      {/* Sección de costos */}
      <div>
        <label
          htmlFor="costs"
          className="text-sm font-medium text-gray-700 block"
        >
          Costos
        </label>
        {eventData.costs.map((cost, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
              placeholder="Tipo (ej. General)"
              value={cost.type}
              onChange={(e) => handleCostChange(index, "type", e.target.value)}
            />
            <input
              type="text"
              className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
              placeholder="Precio (ej. $100)"
              value={cost.price}
              onChange={(e) => handleCostChange(index, "price", e.target.value)}
            />
            <button
              type="button"
              className="text-red-500"
              onClick={() => handleRemoveCost(index)}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button type="button" className="text-blue-500" onClick={handleAddCost}>
          Agregar costo
        </button>
      </div>

      <div>
        <label
          htmlFor="organizer"
          className="text-sm font-medium text-gray-700 block"
        >
          Organizador del evento
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
          placeholder="Organizador del evento"
          id="organizer"
          value={eventData.organizer}
          onChange={(e) =>
            setEventData({ ...eventData, organizer: e.target.value })
          }
        />
      </div>
      <div>
        <label
          htmlFor="eventUrl"
          className="text-sm font-medium text-gray-700 block"
        >
          URL del evento
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
          placeholder="https://eventourl.com"
          id="eventUrl"
          value={eventData.eventUrl}
          onChange={(e) =>
            setEventData({ ...eventData, eventUrl: e.target.value })
          }
        />
      </div>
      <div>
        <label
          htmlFor="image"
          className="text-sm font-medium text-gray-700 block"
        >
          Url de la imagen del evento
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
          placeholder="https://imagen.com"
          id="image"
          value={eventData.imageUrl}
          onChange={(e) =>
            setEventData({ ...eventData, imageUrl: e.target.value })
          }
        />
      </div>

      <button
        className="w-full py-2 bg-[#001f60] text-white font-semibold rounded-md hover:bg-[#456eff] "
        disabled={isCreatingEvent}
      >
        {isCreatingEvent || isUpdatingEvent
          ? "Cargando..."
          : eventId
          ? "Actualizar Evento"
          : "Crear Evento"}
      </button>
    </form>
  );
};

export default EventFormComponent;
