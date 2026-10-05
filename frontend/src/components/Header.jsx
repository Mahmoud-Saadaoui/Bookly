import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./common/LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation();

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded transition-colors ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-gray-900">
          {t("brand.name")}
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={linkClass}>
            {t("nav.home")}
          </NavLink>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};

export default Header;