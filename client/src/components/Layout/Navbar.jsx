import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
} from "react-icons/fa";

import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Jobs",
      path: "/jobs",
    },
    {
      name: "Companies",
      path: "/companies",
    },
    {
      name: "About",
      path: "/about",
    },
  ];

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">

        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="whitespace-nowrap font-medium transition hover:text-blue-600"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          <Link
            to="/login"
            className="rounded-lg border px-4 py-2 transition hover:bg-slate-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-xl transition hover:bg-slate-100 md:hidden"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            {/* Mobile Navigation Links */}
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 font-medium transition hover:bg-slate-100 hover:text-blue-600"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="mt-4 flex flex-col gap-3 border-t pt-4">

              {/* Theme */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Theme
                </span>

                <ThemeToggle />
              </div>

              {/* Auth Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-lg border px-4 py-2.5 text-center font-medium transition hover:bg-slate-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-center font-medium text-white transition hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}