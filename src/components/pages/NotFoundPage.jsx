import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="w-dvw h-dvh m-auto flex flex-col items-center justify-evenly">
      <h1 className="text-5xl font-avro text-red-600">
        404 - Page is not Found!
      </h1>
      <Link to={"/"}>
        <button className="text-center text-2xl text-primary p-2 rounded-xl font-poppins border border-black/50 hover:text-primary-accent hover:bg-gray-300 cursor-pointer ">
          Go back home
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
