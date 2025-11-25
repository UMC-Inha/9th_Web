import { useEffect } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GooglePage = () => {
  const navigate = useNavigate();
  const { setAuthTokens } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
    const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

    if (accessToken) {
      setAuthTokens(accessToken, refreshToken);
      navigate("/");
    }
  }, [setAuthTokens, navigate]);
  return <div>구글 화면</div>;
};

export default GooglePage;
