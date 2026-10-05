import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loading from "./components/common/Loading";
import MainLayout from "./layouts/MainLayout";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  return (
    <MainLayout>
      <Suspense fallback={<Loading fullScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
};

export default App;