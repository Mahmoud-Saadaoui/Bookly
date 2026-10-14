import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/common/Loading";
import toast from "react-hot-toast";

/**
 * Landing page for the OAuth redirect flow.
 * The backend redirects here with either `?token=...` (success)
 * or `?error=...` (failure). It establishes the session then navigates home.
 */
const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    // Guard against React 18 StrictMode double-invoking the effect in dev.
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      if (error) toast.error(error);
      navigate("/login", { replace: true });
      return;
    }

    loginWithToken(token).then((result) => {
      navigate(result.success ? "/" : "/login", { replace: true });
    });
  }, [loginWithToken, navigate, searchParams]);

  return <Loading fullScreen />;
};

export default AuthCallbackPage;
