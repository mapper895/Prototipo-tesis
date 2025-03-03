const Footer = () => {
  return (
    <footer className="flex items-center justify-between w-full h-20 bg-[#001f60]">
      <ul className="flex gap-5 ml-5 text-white list-none">
        <li className="text-lg cursor-pointer hover:underline">
          Términos de uso
        </li>
        <li className="text-lg cursor-pointer hover:underline">
          Política de privacidad
        </li>
      </ul>
      <p className="mr-5 text-lg text-white">
        Desarrollada por alumnos del IPN - &copy;2024
      </p>
    </footer>
  );
};

export default Footer;
