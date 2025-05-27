import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authUser";
import { Eye, EyeOff } from "lucide-react";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { signup, isSigninUp } = useAuthStore();

  const handleMouseDown = () => {
    setShowPassword(true);
  };

  const handleMouseUp = () => {
    setShowPassword(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup({ email, username, password });
      navigate("/onboarding");
    } catch (error) {
      console.log("error al registrar el usuario", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center mt-32 mx-3">
        <div className="w-full max-w-md p-8 space-y-6 bg-grey/60 rounded-lg shadow-md">
          <h1 className="text-center text-5xl mb-4">Registro</h1>

          <form className="space-y-4" onSubmit={handleSignUp}>
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
                htmlFor="username"
                className="text-sm font-medium text-gray-700 block"
              >
                Username
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 mt-1 border border-[#001f60] rounded-md bg-transparent text-black focus:outline-none focus:ring"
                placeholder="usuario123"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              disabled={isSigninUp}
            >
              {isSigninUp ? "Cargando..." : "Crear usuario"}
            </button>
          </form>
          <div className="text-center text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link to={"/login"} className="text-[#456eff] hover:text-[#001f60]">
              Inicia Sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
