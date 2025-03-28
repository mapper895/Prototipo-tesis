import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import EventPage from "./pages/EventPage";
import EventsPage from "./pages/EventsPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import NotFoundPage from "./pages/NotFoundPage";
import CategoryPage from "./pages/CategoryPage";
import PopularPage from "./pages/PopularPage";
import EventForm from "./pages/EventForm";
import MyEventsPage from "./pages/MyEventsPage";
import MyLikedEvents from "./pages/MyLikedEvents";

function App() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-white h-full">
          <Loader className="animate-spin text-[#001f60] size-10" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!user ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route path="/events/:id" element={<EventPage />} />
        <Route path="/create-event" element={<EventForm />} />
        <Route path="/edit-event/:eventId" element={<EventForm />} />
        <Route path="/events" element={<EventsPage />} />
        <Route
          path="/my-events"
          element={user ? <MyEventsPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/my-liked-events"
          element={user ? <MyLikedEvents /> : <Navigate to={"/"} />}
        />
        <Route path="/events/category/:category" element={<CategoryPage />} />
        <Route path="/top-10-cdmx" element={<PopularPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
