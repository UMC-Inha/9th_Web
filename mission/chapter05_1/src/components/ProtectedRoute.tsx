import { Navigate, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { JSX } from "react";

interface ProtectedRouteProps {
    children : JSX.Element;
}

const ProtectedRoute = ({children} : ProtectedRouteProps) => {
    const [accessToken] = useLocalStorage<string | null>("accessToken", null);

    if (!accessToken) {
        alert('로그인이 필요한 페이지입니다!');

        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute
