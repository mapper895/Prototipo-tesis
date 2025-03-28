import { ChevronDown, ChevronUp, CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import useCategories from "../hooks/useCategories";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { categories, isLoadingCategories } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navRef = useRef(null);
  const navButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsUserOpen(false); // Cerrar menú
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target) &&
        navButtonRef.current &&
        !navButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false); // Cerrar menú
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  if (isLoadingCategories) return <div>Cargando categorias...</div>;

  return (
    <nav className="w-full h-20 flex items-center justify-between flex-row px-5 bg-[#001f60] text-white">
      <div className="flex flex-row gap-5 text-[22px]">
        <div>
          <Link to={"/"}>Inicio</Link>
        </div>
        {" | "}
        <div className="relative inline-block text-left">
          <button
            ref={navButtonRef}
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
            <div
              ref={navRef}
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-white text-black ring-opacity-5"
            >
              {categories.map((category, index) => (
                <div className="py-2 px-3" key={index}>
                  <Link to={"/events/category/" + category} onClick={closeMenu}>
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
          <Link className="text-[22px]" to={"/create-event"}>
            Crear evento
          </Link>
          <div
            className="flex flex-row items-center cursor-pointer relative"
            ref={buttonRef}
            onClick={() => setIsUserOpen(!isUserOpen)}
          >
            <div className="text-[22px]">Hola {user.username}!</div>
            <img
              src={user.image}
              alt="Avatar"
              className="h-14 rounded cursor-pointer"
            />
            {isUserOpen && (
              <div
                ref={menuRef}
                className="origin-top-right absolute right-0 mt-2 top-12 w-56 rounded-md shadow-lg bg-white ring-1 ring-white text-black ring-opacity-5"
              >
                <div className="py-2 px-3" onClick={logout}>
                  Cerrar sesión
                </div>
                <div className="py-2 px-3">
                  <Link to={"/my-events"}>Mis eventos</Link>
                </div>
                <div className="py-2 px-3">
                  <Link to={"/my-liked-events"}> Mis likes</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
