import { Link, Outlet } from "react-router-dom"; // Necessário para renderizar as rotas filhas

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Meu App</h1>
        <nav className="space-x-4">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/register" className="hover:underline">
            Cadastro
          </Link>
          <Link to="/profile" className="hover:underline">
            Perfil
          </Link>
        </nav>
      </header>

      <main className="flex-grow p-4">
        <Outlet />
      </main>

      <footer className="bg-gray-200 text-center py-4">
        <p>&copy; 2025 Meu App</p>
      </footer>
    </div>
  );
}

export default App;
