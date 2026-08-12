import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">
        403
      </h1>

      <h2 className="mt-2 text-2xl font-semibold">
        Access Denied
      </h2>

      <p className="mt-2">
        You don't have permission to access this page.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg border px-4 py-2"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Unauthorized;