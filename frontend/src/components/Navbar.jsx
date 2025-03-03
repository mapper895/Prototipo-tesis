import { ChevronDown, ChevronUp, CircleUserRound, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { useState } from "react";

const Navbar = ({ categories }) => {
  const { user, logout } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="w-full h-20 flex items-center justify-between flex-row px-5 bg-[#001f60] text-white">
      <div className="flex flex-row gap-5 text-[22px]">
        <div>
          <Link to={"/"}>Inicio</Link>
        </div>
        {" | "}
        <div className="relative inline-block text-left">
          <button
            className="flex items-center justify-center w-full"
            onClick={toggleDropDown}
          >
            Categorias
            {isOpen ? (
              <ChevronUp className="ml-2 h-5 w-5" />
            ) : (
              <ChevronDown className="ml-2 h-5 w-5" />
            )}
          </button>
          {isOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-white text-black ring-opacity-5">
              {categories.map((category, index) => (
                <div className="py-2 px-3" key={index}>
                  <Link to={"/category/" + category} onClick={closeMenu}>
                    {category.replaceAll("_", " ")[0].toUpperCase() +
                      category.replaceAll("_", " ").slice(1)}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {!user ? (
        <Link to={"/signup"}>
          <CircleUserRound className="size-8" />{" "}
        </Link>
      ) : (
        <div className="flex gap-5 items-center justify-center">
          <div className="text-[22px]">Hola {user.username}!</div>
          <img
            src={user.image}
            alt="Avatar"
            className="h-14 rounded cursor-pointer"
          />
          <button onClick={logout}>
            <LogOut className="size-8" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
