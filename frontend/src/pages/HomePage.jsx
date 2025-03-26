import Navbar from "../components/Navbar";
import PopularSectionBanner from "../components/PopularSectionBanner";
import SearchComponent from "../components/SearchComponent";
import Footer from "../components/Footer";
import EventBanner from "../components/EventBanner";
import useCategories from "../hooks/useCategories";

const HomePage = () => {
  const { categories, isLoadingCategories } = useCategories();

  if (isLoadingCategories) return <div>Cargando categorias...</div>;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center w-full gap-10 overflow-hidden">
        {/* Main Text */}
        <div className="text-center text-5xl font-light mt-10">
          Eventos Culturales <br /> CDMX
        </div>

        {/* Search Bar */}
        <SearchComponent />

        {/* Popular Section */}
        <PopularSectionBanner />

        {categories.map((category, index) => (
          <EventBanner key={index} category={category} />
        ))}
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
