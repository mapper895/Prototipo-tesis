const Footer = () => {
  return (
    <footer className="flex items-center justify-between w-full md:h-20 bg-[#001f60] md:flex-row flex-col gap-5 md:gap-0 py-4 md:py-0 text-center">
      <ul className="flex gap-5 ml-5 text-white list-none md:flex-row flex-col">
        <li className="md:text-lg text-sm cursor-pointer hover:underline">
          Términos de uso
        </li>
        <li className="md:text-lg text-sm cursor-pointer hover:underline">
          Política de privacidad
        </li>
      </ul>
      <p className="mr-5 md:text-lg text-sm text-white">
        Desarrollada por alumnos del IPN - &copy;{new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
