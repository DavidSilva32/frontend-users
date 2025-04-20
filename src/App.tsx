import { Link, Outlet } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text transition-colors">
      <header className="bg-primary p-4 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">My App</h1>

        <div className="flex items-center gap-4">
          <button
            className="lg:hidden"
            onClick={toggleMenu}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <nav className="space-x-4 hidden lg:block">
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
          </nav>

          <button
            onClick={toggleDarkMode}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Off-canvas overlay */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 lg:hidden ${
          isMenuOpen ? "block" : "hidden"
        }`}
        onClick={closeMenu}
      />

      {/* Off-canvas menu */}
      <div
        className={`fixed left-0 top-0 w-64 h-full bg-primary text-white p-4 transform transition-transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="flex justify-end mb-4">
          <button onClick={closeMenu} aria-label="Close menu">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="space-y-4 flex flex-col">
          <Link to="/login" className="hover:underline" onClick={closeMenu}>
            Login
          </Link>
          <Link to="/register" className="hover:underline" onClick={closeMenu}>
            Register
          </Link>
          <Link to="/profile" className="hover:underline" onClick={closeMenu}>
            Profile
          </Link>
        </nav>
      </div>

      <main className="flex-grow p-4">
        <Outlet />
      </main>

      <footer className="bg-surface text-center py-4 border-t border-border">
        <p>&copy; 2025 My App</p>
      </footer>
    </div>
  );
}

export default App;
