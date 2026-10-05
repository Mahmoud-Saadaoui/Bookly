import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t("notFound.title")}
        </h2>
        <p className="text-gray-600 mb-6">
          {t("notFound.message")}
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
        >
          {t("notFound.goHome")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
