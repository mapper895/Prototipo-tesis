import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCategories from "../hooks/useCategories"; // Usamos el hook que obtiene las categorías
import { useAuthStore } from "../store/authUser"; // Store donde guardamos las preferencias del usuario

const OnboardingForm = () => {
  const { categories, isLoadingCategories } = useCategories(); // Obtenemos categorías
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();
  const { updatePreferences, isLoading, onboarded } = useAuthStore(); // Store para actualizar preferencias

  useEffect(() => {
    // Si el usuario ya ha completado el onboarding, redirigimos a la pagina principal
    if (onboarded) {
      navigate(""); // Redirigimos al usuario si ya completo el onboarding
    }
  }, [onboarded, navigate]);

  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async () => {
    try {
      // Llamada al backend a través del store para guardar las preferencias
      await updatePreferences(selectedCategories);
      navigate("/"); // Redirige al usuario después de completar el onboarding
    } catch (error) {
      console.error("Error al guardar las preferencias:", error);
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-semibold text-center">
        ¡Bienvenido! <br />
        Queremos saber tus gustos para poder recomendarte eventos.
      </h1>
      <p className="text-center text-lg mt-4">
        Selecciona hasta 5 categorías que más te interesen.
      </p>

      {isLoadingCategories || isLoading ? (
        <div className="text-center py-6">
          <p>Cargando categorías...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 mt-8">
          {categories.map((category) => (
            <div
              key={category}
              className={`p-4 border rounded-lg cursor-pointer transition transform hover:scale-105 ${
                selectedCategories.includes(category)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <img
                src={`http://localhost:5000/images/${category
                  .toLowerCase()
                  .replace(/\s+/g, "_")}.jpg`}
                alt={category}
                className="w-full h-40 object-cover rounded-md"
              />
              <p className="mt-2 text-center text-lg">{category}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <p>
          {selectedCategories.length} categoría(s) seleccionada(s). Puedes
          seleccionar hasta 5.
        </p>
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          {selectedCategories.length === 0 ? "Omitir" : "Finalizar"}
        </button>
      </div>
    </div>
  );
};

export default OnboardingForm;
