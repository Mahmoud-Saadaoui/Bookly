import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between gap-4 text-sm text-gray-600">
        <p>{t("footer.copyright", { year })}</p>
        <p>{t("footer.slogan")}</p>
      </div>
    </footer>
  );
};

export default Footer;