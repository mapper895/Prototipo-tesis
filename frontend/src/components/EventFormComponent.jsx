import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse } from "date-fns";
import { useLocation } from "react-router-dom";
import axios from "axios";

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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState(""); // Para mostrar el rango de fechas
  const location = useLocation(); // Utilizamos useLocation para escuchar cambios en la ruta

  // Restablecer el estado cuando la ruta cambia a la de creación
  useEffect(() => {
    if (location.pathname === "/create-event") {
      setEventData({
        title: "",
        description: "",
        category: "",
        dates: [],
        location: "",
        imageUrl: "",
        target: "",
        accessibility: "",
        organizer: "",
        schedules: [],
        costs: [],
      }); // Restablecer el formulario
      setStartDate(null); // Limpiar fecha de inicio
      setEndDate(null); // Limpiar fecha de fin
      setSelectedRange(""); // Limpiar el rango de fechas seleccionado
    }
  }, [location.pathname, setEventData]); // Este useEffect escucha los cambios de ruta

  const formatDateDDMMYYYY = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generateDatesInRange = (start, end) => {
    let dates = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(formatDateDDMMYYYY(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Actualizar las fechas en el estado
  const handleDateChange = (start, end) => {
    if (start && end) {
      const dates = generateDatesInRange(start, end);
      setEventData({
        ...eventData,
        dates: dates, // Setea el array de fechas en el estado
      });

      // Establecer el rango seleccionado para mostrarlo
      setSelectedRange(
        `Desde el ${dates[0]} hasta el ${dates[dates.length - 1]}`
      );
    }
  };

  /// Limpiar el rango si alguna fecha cambia
  useEffect(() => {
    if (startDate && endDate) {
      handleDateChange(startDate, endDate); // Establecer el rango inmediatamente cuando se seleccionan las fechas
    }
  }, [startDate, endDate]); // Este useEffect se activará cada vez que cambien las fechas

  // Si estamos en modo edición, cargamos las fechas del evento
  useEffect(() => {
    if (
      eventData &&
      eventData.dates &&
      eventData.dates.length > 0 &&
      !startDate &&
      !endDate
    ) {
      // Convertimos las fechas a objetos Date usando date-fns
      const firstDate = parse(eventData.dates[0], "d/MM/yyyy", new Date()); // Usamos parse de date-fns
      const lastDate = parse(
        eventData.dates[eventData.dates.length - 1],
        "d/MM/yyyy",
        new Date()
      );

      // Asegurarnos de que las fechas sean válidas antes de asignarlas
      if (!isNaN(firstDate.getTime()) && !isNaN(lastDate.getTime())) {
        setStartDate(firstDate); // Asignamos la fecha de inicio
        setEndDate(lastDate); // Asignamos la fecha de fin
      }
    }
  }, [eventData, startDate, endDate]); // Se ejecuta cada vez que los datos del evento cambian

  // Actualizamos el estado de las fechas cuando el usuario las selecciona
  const handleStartDateChange = (date) => {
    setStartDate(date); // Se actualiza la fecha de inicio
  };

  const handleEndDateChange = (date) => {
    setEndDate(date); // Se actualiza la fecha de fin
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

  // Función para subir la imagen a Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "proyecto_terminal"); // Asegúrate de poner tu "upload preset"

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/daaj78igi/image/upload`, // Asegúrate de poner tu "cloud_name"
        formData
      );

      // Si la carga fue exitosa, devuelve la URL de la imagen
      return response.data.secure_url; // Esta es la URL pública de la imagen cargada
    } catch (error) {
      console.error("Error al subir la imagen a Cloudinary:", error);
      throw new Error("No se pudo cargar la imagen");
    }
  };

  // Función para manejar la carga de imagen
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Obtener el archivo cargado

    if (!file) return; // Si no hay archivo, no hacemos nada

    try {
      // Llamar a la función para subir la imagen
      const imageUrl = await uploadImageToCloudinary(file); // Obtienes la URL pública de Cloudinary

      // Ahora actualizamos el estado de Zustand con la URL de la imagen
      setEventData((prev) => ({ ...prev, imageUrl }));
    } catch (error) {
      console.error("Error al cargar la imagen", error);
    }
  };

  // Funcion para quitar la imagen del estado
  const handleRemoveImage = () => {
    setEventData({ ...eventData, imageUrl: "" });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="title"
          className="text-sm font-medium text-gray-700 block"
        >
          Nombre del evento <span className="text-red-500">*</span>
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
          Descripción del evento <span className="text-red-500">*</span>
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
          Categoria <span className="text-red-500">*</span>
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
          Lugar <span className="text-red-500">*</span>
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
      {/* Selector de fecha de inicio */}
      <div>
        <label
          htmlFor="startDate"
          className="text-sm font-medium text-gray-700 block"
        >
          Fecha de inicio <span className="text-red-500">*</span>
        </label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
        />
      </div>

      {/* Selector de fecha de fin */}
      <div>
        <label
          htmlFor="endDate"
          className="text-sm font-medium text-gray-700 block"
        >
          Fecha de fin <span className="text-red-500">*</span>
        </label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate} // La fecha de fin no puede ser anterior a la de inicio
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
        />
      </div>

      {/* Mostrar el rango de fechas seleccionado */}
      {selectedRange && (
        <div className="mt-4 text-sm text-gray-600">
          <strong>Rango de fechas seleccionado:</strong> {selectedRange}
        </div>
      )}

      {/* Sección para los horarios */}
      <div>
        <label
          htmlFor="time"
          className="text-sm font-medium text-gray-700 block"
        >
          Horarios del evento
        </label>
        {eventData.schedules && eventData.schedules.length > 0 ? (
          eventData.schedules.map((time, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="time"
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                value={time || ""}
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
          ))
        ) : (
          <p>No hay horarios agregados</p>
        )}
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
          type="text"
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
        {eventData.costs && eventData.costs.length > 0 ? (
          eventData.costs.map((cost, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                placeholder="Tipo (ej. General)"
                value={cost.type}
                onChange={(e) =>
                  handleCostChange(index, "type", e.target.value)
                }
              />
              <input
                type="text"
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                placeholder="Precio (ej. $100)"
                value={cost.price}
                onChange={(e) =>
                  handleCostChange(index, "price", e.target.value)
                }
              />
              <button
                type="button"
                className="text-red-500"
                onClick={() => handleRemoveCost(index)}
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p>No hay costos agregados</p>
        )}
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
          Cargar imagen del evento
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageUpload} // Llama a la función para manejar la carga
          className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
        />
        {/* Mostrar vista previa de la imagen */}
        {eventData.imageUrl && (
          <div className="mt-4">
            <img
              src={eventData.imageUrl}
              alt="Vista previa de la imagen"
              className="w-32 h-32 object-cover"
            />
            <button
              type="button"
              className="text-red-500 mt-2"
              onClick={handleRemoveImage}
            >
              Quitar imagen
            </button>
          </div>
        )}
      </div>

      <p className="text-red-600">* Campos obligatorios </p>

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
