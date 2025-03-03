import { Link } from "react-router-dom";
import { popular_events } from "../data/data";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PopularPage = () => {
  const img_base_url = "https://picsum.photos/id/";

  if (!popular_events) {
    return <h2>No se encontraron eventos</h2>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col gap-5 my-5">
          <div className="flex gap-2">
            <Link to={"/"}>Inicio</Link>
            {">"}
            <Link> Top 10 CDMX</Link>
          </div>
          <div className="text-6xl font-light">Top 10 CDMX</div>
          <div className="text-lg">
            Descubre los 10 mejores eventos en la Ciudad de México.
          </div>
        </div>
        <div className="grid grid-cols-4 gap-7 my-5">
          {popular_events.map((popular_event) => (
            <Link
              key={popular_event.id}
              className="shadow-lg rounded-lg overflow-hidden "
              to={`/event/${popular_event.id}`}
            >
              <img
                src={`${img_base_url + popular_event.id}/200/300`}
                alt="evento"
                className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
              />
              <div className="font-bold text-lg ml-2 mt-2">
                {popular_event.nombre}
              </div>
              <div className="text-gray-600 mx-2 mb-1">
                {popular_event.descripcion.length > 60
                  ? `${popular_event.descripcion.slice(0, 55)}...`
                  : popular_event.descripcion}{" "}
                {popular_event.descripcion.length > 60 && (
                  <Link
                    to={`/event/${popular_event.id}`}
                    className="text-blue-600 hover:underline mt-2"
                  >
                    Ver más
                  </Link>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PopularPage;
