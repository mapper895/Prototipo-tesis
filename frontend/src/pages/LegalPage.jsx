import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SmallNavbar from "../components/SmallNavbar";
import { useState } from "react";
import { useEffect } from "react";

const termsContent = `TÉRMINOS Y CONDICIONES DE USO
Fecha de entrada en vigor: 28 de junio de 2025

Gracias por utilizar nuestro servicio en https://tesis-app-7sij.onrender.com/ (en adelante, "la Aplicación"). Al acceder o utilizar la Aplicación, aceptas estos Términos y Condiciones de Uso. Si no estás de acuerdo con estos términos, por favor no utilices la Aplicación.

1. Descripción del servicio
La Aplicación es un gestor de eventos dirigido a personas en la Ciudad de México. Permite visualizar eventos, crear nuevos eventos y acceder a ubicaciones mediante Google Maps.

2. Registro de usuarios
El registro no es obligatorio para navegar por la Aplicación, pero algunas funcionalidades pueden requerir que proporciones un correo electrónico, nombre de usuario y contraseña.

3. Contenido generado por usuarios
Los usuarios pueden crear eventos. Eres responsable del contenido que publiques y debes asegurarte de que cumple con todas las leyes aplicables.

4. Uso aceptable
Te comprometes a no utilizar la Aplicación para fines ilegales o no autorizados, incluyendo la publicación de contenido ofensivo, difamatorio o engañoso.

5. Propiedad intelectual
Todos los derechos sobre la Aplicación y su contenido (excepto el generado por usuarios) pertenecen a los desarrolladores de la Aplicación.

6. Terminación
Nos reservamos el derecho de suspender o eliminar cuentas que violen estos Términos sin previo aviso.

7. Modificaciones
Podemos actualizar estos Términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en la Aplicación.`;
const privacyContent = `POLÍTICA DE PRIVACIDAD

Fecha de entrada en vigor: 28 de junio de 2025

Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tu información cuando usas nuestra Aplicación.

1. Información que recopilamos
Podemos recopilar la siguiente información personal:

Correo electrónico

Nombre de usuario

Contraseña (almacenada de forma segura)

2. Uso de la información
La información que recopilamos se utiliza para:

Permitir el acceso y uso de la Aplicación

Crear y administrar cuentas de usuario

Mostrar eventos y mapas a través de Google Maps

3. Cookies y tecnologías similares
Utilizamos cookies para almacenar tokens de autenticación (JWT). Estas cookies son necesarias para mantener tu sesión iniciada y mejorar tu experiencia.

4. Compartición de datos
No compartimos tu información personal con terceros.

5. Servicios de terceros
Utilizamos la API de Google Maps para mostrar ubicaciones de eventos. Al usar la Aplicación, aceptas las condiciones y políticas de privacidad de Google.

6. Seguridad de la información
Aplicamos medidas de seguridad razonables para proteger tu información personal.

7. Conservación de datos
Tu información se conserva mientras tu cuenta esté activa. Actualmente, no ofrecemos una opción para eliminar cuentas.

8. Cambios en esta política
Podemos actualizar esta Política de Privacidad en cualquier momento. Te notificaremos mediante la Aplicación o por correo electrónico si realizamos cambios sustanciales.

9. Contacto
Si tienes preguntas sobre esta Política de Privacidad o los Términos de Uso, puedes contactarnos a través del correo electrónico proporcionado en la Aplicación.

`;

const LegalPage = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isMobile, setIsMobile] = useState(false);

  const content = path.includes("terminos-de-uso")
    ? termsContent
    : privacyContent;

  // Detectar el tamaño de la pantalla
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= 1280); // Consideramos 768px o menos como pantallas pequeñas
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize); // Escuchar cambios de tamaño

    return () => window.removeEventListener("resize", checkScreenSize); // Limpiar el evento
  }, []);

  return (
    <>
      {isMobile ? <SmallNavbar /> : <Navbar />}
      <div className="max-w-4xl mx-auto p-6 sm:mt-20 mt-10">
        <article className="prose prose-lg">
          {content.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </article>
      </div>
      <Footer />
    </>
  );
};

export default LegalPage;
