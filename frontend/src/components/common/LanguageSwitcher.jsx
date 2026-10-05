import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "عربي" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current =
    LANGUAGES.find((lang) => lang.code === i18n.language) ?? LANGUAGES[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="px-3 py-2 rounded border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label}
      </button>
      {open && (
        <ul
          className="absolute top-full mt-1 start-0 w-full rounded border border-gray-200 bg-white shadow-lg"
          role="listbox"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                onClick={() => changeLanguage(lang.code)}
                className={`w-full px-3 py-2 text-start text-sm hover:bg-gray-50 ${
                  lang.code === i18n.language
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
                role="option"
                aria-selected={lang.code === i18n.language}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;