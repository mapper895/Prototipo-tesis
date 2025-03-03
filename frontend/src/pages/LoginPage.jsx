import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLogginIn } = useAuthStore();

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center mt-20 mx-3">
        <div className="w-full max-w-md p-8 space-y-6 bg-grey/60 rounded-lg shadow-md">
          <h1 className="text-center text-5xl mb-4">Inicia Sesión</h1>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                placeholder="nombre@correo.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 block"
              >
                Contraseña
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                placeholder="********"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="w-full py-2 bg-[#001f60] text-white font-semibold rounded-md hover:bg-[#456eff] "
              disabled={isLogginIn}
            >
              {isLogginIn ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>
          <div className="text-center text-gray-400">
            ¿Primera vez?{" "}
            <Link
              to={"/signup"}
              className="text-[#456eff] hover:text-[#001f60]"
            >
              Registrate
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
