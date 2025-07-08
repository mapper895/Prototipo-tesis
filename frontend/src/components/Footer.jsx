import { Link } from "react-router-dom";
import { useFeedbackStore } from "../store/feedbackStore";

const Footer = () => {
  const {
    comment,
    isSubmitting,
    successMessage,
    errorMessage,
    setCommentData,
    sendComment,
  } = useFeedbackStore();

  const handleSubmit = (e) => {
    e.preventDefault();

    sendComment({ comment }).then(() => {
      setCommentData({ comment: "" });
    });
  };

  return (
    <footer className="flex-col items-center w-full bg-[#001f60] py-4">
      {/* <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center items-center gap-5"
      >
        <div className="w-full flex flex-col justify-center items-center gap-4">
          <label htmlFor="comment" className="text-xl font-medium text-white">
            Dejanos tu comentario
          </label>
          <textarea
            id="comment"
            className="bg-transparent text-white border border-white rounded-xl md:w-1/2 w-full px-4 focus:ring focus:outline-none"
            value={comment}
            onChange={(e) => setCommentData(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}

        <button
          type="submit"
          className="py-4 bg-[#001f60] text-white font-semibold rounded-md hover:bg-[#456eff] border border-white w-[250px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando" : "Enviar comentario"}
        </button>
      </form> */}
      {/* Formulario para comentarios */}
      <div className="text-white flex flex-col items-center md:gap-4 gap-2 my-5 lg:px-0 px-4">
        <h2 className="md:text-3xl text-2xl">Déjanos un comentario</h2>
        <p className="md:text-lg text-sm  text-center">
          Queremos saber que opinas sobre nuestra plataforma. Tu opinión es muy
          importante para nosotros.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex lg:w-1/2 w-full items-center justify-between lg:flex-row flex-col"
        >
          <input
            type="textarea"
            placeholder="Tu comentario"
            className="bg-transparent border border-white py-4 rounded-xl lg:w-3/5 w-full my-4 text-white text-center text-sm md:text-base"
            value={comment}
            onChange={(e) => setCommentData({ comment: e.target.value })}
            required
          />

          <button
            type="submit"
            className="py-4 rounded-xl text-white font-semibold hover:bg-blue-500 bg-blue-800 lg:w-[250px] w-1/2 md:text-base text-xs"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar comentario"}
          </button>
        </form>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}
      </div>
      <div className="w-full flex items-center justify-between md:flex-row flex-col gap-5 md:gap-0 text-center">
        <ul className="flex gap-5 ml-5 text-white list-none md:flex-row flex-col">
          <Link
            to={"/legal/terminos-de-uso"}
            className="md:text-lg text-sm cursor-pointer hover:underline"
          >
            Términos de uso
          </Link>
          <Link
            to={"/legal/politica-de-privacidad"}
            className="md:text-lg text-sm cursor-pointer hover:underline"
          >
            Política de privacidad
          </Link>
        </ul>
        <p className="mr-5 md:text-lg text-sm text-white">
          Desarrollada por alumnos del IPN - &copy;{new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
