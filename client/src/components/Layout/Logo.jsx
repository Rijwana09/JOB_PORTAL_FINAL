import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      className="text-2xl font-bold text-blue-600"
    >
      JobPortal
    </Link>
  );
}