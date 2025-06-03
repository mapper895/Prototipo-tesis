import {
  ChevronDown,
  ChevronUp,
  CircleUserRound,
  Loader,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import useCategories from "../hooks/useCategories";
import { useEffect, useRef, useState } from "react";
import SearchComponent from "./SearchComponent";
import { useNotificationStore } from "../store/notificationStore";

const Navbar = () => {
  const { user, logout, clearUserData } = useAuthStore();
  const { isLoading, notifications, getUserNotifications, markAsRead } =
    useNotificationStore();
  const { categories, isLoadingCategories } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [notificationsMenuOpen, setNotificationsMenuOpen] = useState(false);

  const handleNotificationClick = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleNotificationsMenu = (event) => {
    event.stopPropagation(); // Evitar que el clic se propague a document
    setNotificationsMenuOpen((prev) => !prev); // Toggle entre abrir y cerrar el menú
  };

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navRef = useRef(null);
  const navButtonRef = useRef(null);
  const notificationsMenuRef = useRef(null);

  // Detectar clic fuera del menú de usuario
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

  // Detectar clic fuera del menú de categorías
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

  // Detectar clic fuera del menú de notificaciones
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsMenuRef.current &&
        !notificationsMenuRef.current.contains(event.target)
      ) {
        setNotificationsMenuOpen(false); // Cerrar el menú si se hace clic fuera
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getUserNotifications();
  }, [getUserNotifications]);

  const handleLogout = async () => {
    clearUserData();
    await logout();
  };

  if (isLoadingCategories || isLoading)
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );

  return (
    <nav className="fixed top-0 z-50 w-full h-20 flex items-center justify-between flex-row px-5 bg-[#001f60] text-white">
      <div className="flex flex-row gap-5 text-[22px]">
        <div>
          <Link to={"/"}>Inicio</Link>
        </div>
        {" | "}
        <div>
          <Link to={"/all-events"}>Todos los eventos</Link>
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
      <div>
        <SearchComponent />
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
            className="h-full relative cursor-pointer"
            onClick={toggleNotificationsMenu} // Toggle menú de notificaciones
          >
            {notifications.length > 0 && (
              <div className="absolute bottom-3 left-2 rounded-full bg-red-500 flex items-center justify-center text-white text-xs w-5 h-5">
                {
                  notifications.filter((notification) => !notification.read)
                    .length
                }
              </div>
            )}

            <Bell />

            {/* Menú de notificaciones */}
            {notificationsMenuOpen && (
              <div
                ref={notificationsMenuRef} // Referencia para detectar clic fuera del menú
                className="absolute top-10 right-2 bg-white border border-gray-300 shadow-lg w-96 text-black max-h-[400px] overflow-y-auto rounded-lg"
              >
                <h3 className="font-bold p-4">Notificaciones</h3>
                {/* Lista de notificaciones */}
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <Link
                      to={`/events/${notification.eventId}`}
                      key={notification._id}
                      className={`block pb-4 px-4 border-b ${
                        notification.read ? "bg-white" : "bg-gray-100"
                      }`}
                      onClick={() => handleNotificationClick(notification._id)}
                    >
                      <p
                        className={`${
                          notification.read ? "text-gray-600" : "text-black"
                        }`}
                      >
                        {notification.message}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="p-4">No tienes notificaciones</p>
                )}
              </div>
            )}
          </div>
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
                <div className="py-2 px-3">
                  <Link to={"/my-events"}>Mis eventos creados</Link>
                </div>
                <div className="py-2 px-3">
                  <Link to={"/my-reservations"}>Mis eventos agendados</Link>
                </div>
                <div className="py-2 px-3">
                  <Link to={"/my-liked-events"}> Mis likes</Link>
                </div>
                <div className="py-2 px-3">
                  <Link to={"/dashboard"}> Dashboard</Link>
                </div>
                <div className="py-2 px-3" onClick={handleLogout}>
                  Cerrar sesión
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
