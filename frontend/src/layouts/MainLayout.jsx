import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

const MainLayout = ({ children }) => {
    const { i18n } = useTranslation();

    useEffect(() => {
        const lang = i18n.language;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    }, [i18n.language]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full">{children}</main>
        </div>
    );
};

export default MainLayout;
