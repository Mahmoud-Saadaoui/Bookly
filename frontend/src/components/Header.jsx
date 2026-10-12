import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import RoleGuard from "./auth/RoleGuard";

const Header = () => {
  const { user, isAuthenticated, logout, isStaff } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold font-cairo tracking-tight">
          Fleet<span className="text-accent">ly</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-cairo text-gray-300 hover:text-white transition-colors">
            Accueil
          </Link>
          <Link to="/vehicles" className="text-sm font-cairo text-gray-300 hover:text-white transition-colors">
            Véhicules
          </Link>
          {isAuthenticated && (
            <Link to="/my-bookings" className="text-sm font-cairo text-gray-300 hover:text-white transition-colors">
              Mes locations
            </Link>
          )}
          <RoleGuard roles={['admin', 'fleet_manager', 'agent', 'finance_manager']}>
            <Link to="/admin" className="text-sm font-cairo text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
          </RoleGuard>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-300 hidden sm:block">{user?.name}</span>
              <button
                onClick={logout}
                className="px-6 py-2 bg-accent text-dark text-sm font-semibold rounded-full hover:bg-accent-light transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-cairo text-gray-300 hover:text-white transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-accent text-dark text-sm font-semibold rounded-full hover:bg-accent-light transition-colors"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;