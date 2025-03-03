import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const NotFoundPage = () => {
  return (
    <>
      <Navbar />
      <div className="w-full mt-10 flex flex-col justify-center items-center gap-10">
        <div className="w-[600px] h-[250px] justify-around flex items-center flex-col">
          <div className="text-4xl text-center font-bold">
            No encontramos esta pagina
          </div>
          <div className="text-2xl text-center">
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
