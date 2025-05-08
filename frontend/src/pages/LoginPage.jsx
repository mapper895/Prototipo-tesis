import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLogginIn } = useAuthStore();

  const handleMouseDown = () => {
    setShowPassword(true);
  };

  const handleMouseUp = () => {
    setShowPassword(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center mt-32 mx-3">
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                  placeholder="********"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Icono para mostrar/ocultar contraseña */}
                <span
                  onMouseDown={handleMouseDown} // Mostrar contraseña al presionar el mouse
                  onMouseUp={handleMouseUp} // Ocultar la contraseña al soltar el mouse
                  className="absolute top-4 right-2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
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
