import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CircleUserRound,
  Menu,
  X,
  ChevronRight,
  Loader,
  Bell,
} from "lucide-react";
import SearchComponent from "./SearchComponent"; // Asegúrate de importar correctamente el SearchComponent
import { useAuthStore } from "../store/authUser";
import useCategories from "../hooks/useCategories";
import { useNotificationStore } from "../store/notificationStore";

const SmallNavbar = () => {
  const { user, logout, clearUserData } = useAuthStore();
  const { categories, isLoadingCategories } = useCategories();
  const { isLoading, notifications, getUserNotifications, markAsRead } =
    useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = async () => {
    clearUserData();
    setIsOpen(false);
    await logout();
  };

  const handleNotificationClick = async (notificationId) => {
    await markAsRead(notificationId);
  };

  useEffect(() => {
    getUserNotifications();
  }, [getUserNotifications]);

  if (isLoadingCategories || isLoading)
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );

  return (
    <nav className="xl:hidden  p-4 bg-[#001f60] w-full">
      <div className="flex justify-between items-center flex-col">
        <div className="text-white text-2xl flex justify-between w-full">
          <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="size-8" /> : <Menu className="size-8" />}
          </button>
          {user && (
            <div className="flex items-center justify-center">
              <div className="text-base">Hola {user.username}!</div>
              <img src={user.image} alt="Avatar" className="h-12 rounded" />
            </div>
          )}
          {!user ? (
            <Link to={"/login"}>
              <CircleUserRound className="size-8" />
            </Link>
          ) : (
            <div
              className="relative cursor-pointer flex items-center"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              {notifications.length > 0 && !notificationsOpen && (
                <div className="absolute bottom-6 left-2 rounded-full bg-red-500 flex items-center justify-center text-white text-xs w-5 h-5">
                  {
                    notifications.filter((notification) => !notification.read)
                      .length
                  }
                </div>
              )}
              {notificationsOpen ? <X /> : <Bell />}
            </div>
          )}
        </div>

        {notificationsOpen && (
          <div className="mt-4 space-y-4 text-white w-full">
            <h3 className="font-bold">Notificaciones</h3>
            {/* Lista de notificaciones */}
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  to={`/events/${notification.eventId}`}
                  key={notification._id}
                  className={`block px-4 py-2 border-b border-gray-500 rounded-md ${
                    notification.read
                      ? "bg-transparent"
                      : "bg-white bg-opacity-10"
                  }`}
                  onClick={() => handleNotificationClick(notification._id)}
                >
                  <p
                    className={`${
                      notification.read ? "text-gray-500" : "text-white"
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

        {isOpen && (
          <div className="mt-4 space-y-4 text-white w-full">
            <SearchComponent />
            <div className="flex flex-col justify-center items-start text-base gap-4 w-full">
              <Link to={"/"}>Inicio</Link>
              <Link to={"/all-events"}>Todos los eventos</Link>
              <div className="w-full flex justify-center items-start flex-col">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center gap-2"
                >
                  <span>Categorias</span>
                  <ChevronRight
                    className={`transform ${
                      isCategoriesOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {isCategoriesOpen && (
                  <div className="ml-4 mt-2">
                    {categories.map((category, index) => (
                      <div className="py-2 px-3" key={index}>
                        <Link
                          to={"/events/category/" + category}
                          onClick={() => setIsOpen(!isOpen)}
                        >
                          {category.replaceAll("_", " ")[0].toUpperCase() +
                            category.replaceAll("_", " ").slice(1)}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {user && (
                <div className="flex flex-col justify-center items-start cursor-pointer gap-4">
                  <Link to={"/create-event"}>Crear evento</Link>
                  <Link to={"/my-events"}>Mis eventos creados</Link>
                  <Link to={"/my-reservations"}>Mis eventos agendados</Link>
                  <Link to={"/my-liked-events"}> Mis likes</Link>
                  <Link to={"/dashboard"}> Dashboard</Link>
                  <div onClick={handleLogout}>Cerrar sesión</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SmallNavbar;
