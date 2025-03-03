import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authUser";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { signup, isSigninUp } = useAuthStore();

  const handleSignUp = (e) => {
    e.preventDefault();
    signup({ email, username, password });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center mt-20 mx-3">
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
