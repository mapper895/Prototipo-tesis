import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import SmallNavbar from "../components/SmallNavbar";

const NotFoundPage = () => {
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
  return (
    <>
      {isMobile ? <SmallNavbar /> : <Navbar />}
      <div className="w-full h-screen flex flex-col justify-center items-center gap-10 px-4">
        <div className="md:w-[600px] h-[250px] w-full justify-around flex items-center flex-col">
          <div className="md:text-4xl text-2xl text-center font-bold">
            No encontramos esta pagina
          </div>
          <div className="md:text-2xl text-lg text-center">
            Buscamos por todos lados, pero no encontramos la pagina que estas
            buscando
          </div>
          <Link
            to={"/"}
            className="w-[150px] py-2 bg-[#001f60] text-white text-center font-semibold rounded-full hover:bg-[#456eff]"
          >
            Inicio
          </Link>
        </div>
        <img src="/404Horse.gif" alt="horse" className="w-[500px]" />
      </div>
    </>
  );
};

export default NotFoundPage;
