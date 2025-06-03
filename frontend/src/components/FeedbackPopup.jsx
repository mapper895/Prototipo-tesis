import { useState, useEffect } from "react";
import { Star } from "lucide-react"; // Usamos el icono de estrella completa de lucide-react

const FeedbackPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0); // Guarda la puntuación seleccionada
  const [hoverRating, setHoverRating] = useState(0); // Guarda la puntuación de la estrella cuando el usuario pasa el mouse sobre ella

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true); // Muestra el popup después de un tiempo (por ejemplo, 10 segundos)
    }, 10000); // 10000 ms = 10 segundos

    return () => clearTimeout(timer);
  }, []);

  // Función para manejar el clic en una estrella
  const handleStarClick = (value) => {
    setRating(value); // Establece la puntuación seleccionada
  };

  // Función para manejar el hover sobre las estrellas
  const handleStarHover = (value) => {
    setHoverRating(value); // Establece el valor cuando el mouse pasa por encima de la estrella
  };

  const handleStarLeave = () => {
    setHoverRating(0); // Restablece el valor cuando el mouse deja las estrellas
  };

  // Renderiza las estrellas
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      // Creamos 5 estrellas
      const value = i; // Los valores van de 1 a 5

      stars.push(
        <div
          key={i}
          className="cursor-pointer"
          onClick={() => handleStarClick(value)} // Al hacer clic en una estrella, asigna el valor correspondiente
          onMouseEnter={() => handleStarHover(value)} // Muestra el valor cuando el mouse pasa por encima de la estrella
          onMouseLeave={handleStarLeave}
        >
          {/* Mostrar estrellas completas dependiendo del rating */}
          {value <= (hoverRating || rating) ? (
            <Star size={30} color="#ffd700" /> // Estrella completa
          ) : (
            <Star size={30} color="#e0e0e0" /> // Estrella vacía
          )}
        </div>
      );
    }
    return stars;
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl mb-4 text-center">¡Tu opinión importa!</h2>
            <div className="flex justify-center mb-4">{renderStars()}</div>
            <div className="text-center">
              <p>Tu calificación: {rating}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
              >
                Enviar Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackPopup;
