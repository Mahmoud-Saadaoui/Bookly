import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  FaHome,
  FaCar,
  FaBuilding,
  FaCalendarAlt,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";

const SIDEBAR_ITEMS = [
  { to: "/admin", label: "Tableau de bord", icon: FaHome, roles: ["admin", "fleet_manager", "agent", "finance_manager"] },
  { to: "/admin/vehicles", label: "Véhicules", icon: FaCar, roles: ["admin", "fleet_manager"] },
  { to: "/admin/branches", label: "Agences", icon: FaBuilding, roles: ["admin", "fleet_manager"] },
  { to: "/admin/bookings", label: "Réservations", icon: FaClipboardList, roles: ["admin", "fleet_manager", "agent"] },
  { to: "/admin/users", label: "Utilisateurs", icon: FaUsers, roles: ["admin"] },
  { to: "/admin/calendar", label: "Calendrier", icon: FaCalendarAlt, roles: ["admin", "fleet_manager", "agent"] },
  { to: "/admin/analytics", label: "Analytique", icon: FaChartBar, roles: ["admin", "fleet_manager", "finance_manager"] },
];

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const userRole = user?.role || (user?.isAdmin ? "admin" : "customer");

  const filteredItems = SIDEBAR_ITEMS.filter((item) => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-dark flex pt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-light/50 border-r border-white/10 hidden lg:block">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-montserrat font-semibold">Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">{user?.name}</p>
          <p className="text-xs text-accent mt-1 uppercase tracking-wider">{userRole}</p>
        </div>
        <nav className="p-4 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-accent/20 text-accent"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="text-base" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <FaSignOutAlt />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
