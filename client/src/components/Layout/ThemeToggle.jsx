import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border p-2 transition hover:scale-105"
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}