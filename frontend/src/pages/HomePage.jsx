import Navbar from "../components/Navbar";
import PopularSectionBanner from "../components/PopularSectionBanner";
import SearchComponent from "../components/SearchComponent";
import Footer from "../components/Footer";
import EventBanner from "../components/EventBanner";
import useCategories from "../hooks/useCategories";
import { Loader } from "lucide-react";
import UserRecommendationsBanner from "../components/UserRecommendationBanner";
import UserReservationsBanner from "../components/UserReservationsBanner";
import { useEffect, useState } from "react";
import SmallNavbar from "../components/SmallNavbar";

const HomePage = ({ user }) => {
  const { categories, isLoadingCategories } = useCategories();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar el tamaño de la pantalla
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= 1280); // Consideramos 768px o menos como pantallas pequeñas
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize); // Escuchar cambios de tamaño

    return () => window.removeEventListener("resize", checkScreenSize); // Limpiar el evento
  }, []);

  if (isLoadingCategories)
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );

  return (
    <>
      {isMobile ? <SmallNavbar /> : <Navbar />}
      <div className="flex flex-col items-center justify-center w-full sm:gap-10 gap-5 overflow-hidden sm:mt-20 mt-10  mx-auto">
        {/* Main Text */}
        <div className="text-center sm:text-5xl text-3xl font-light xl:mt-10">
          Eventos Culturales <br /> CDMX
        </div>

        {/* Search Bar */}
        <SearchComponent />

        {/* Popular Section */}
        <PopularSectionBanner />

        {user && <UserReservationsBanner user={user} />}

        {/* Recomendaciones para el usuario */}
        {user && <UserRecommendationsBanner user={user} />}

        {categories.map((category, index) => (
          <EventBanner key={index} category={category} />
        ))}
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
