import Navbar from "../components/Navbar";
import PopularSectionBanner from "../components/PopularSectionBanner";
import SearchComponent from "../components/SearchComponent";
import Footer from "../components/Footer";
import EventBanner from "../components/EventBanner";
import useCategories from "../hooks/useCategories";
import { Loader } from "lucide-react";

const HomePage = () => {
  const { categories, isLoadingCategories } = useCategories();

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
      <Navbar />
      <div className="flex flex-col items-center justify-center w-full gap-10 overflow-hidden mt-20">
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
