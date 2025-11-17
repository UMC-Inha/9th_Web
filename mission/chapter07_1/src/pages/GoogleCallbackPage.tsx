import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const GoogleCallbackPage = () => {
    const navigate = useNavigate();
    const { setAccessToken, setRefreshToken, setName, setUserId } = useAuth();

    const lock = useRef(false);

    useEffect(() => {
        if (lock.current) {
            return;
        }

        lock.current = true;

        if (window.location.search) {
            const searchParams = new URLSearchParams(window.location.search);

            const newAccessToken = searchParams.get("accessToken");
            const newRefreshToken = searchParams.get("refreshToken");
            
            const rawName = searchParams.get("name");
            const newName = rawName ? decodeURIComponent(rawName) : null;

            const newUserIdStr = searchParams.get("id") || searchParams.get("userId");

            if (newAccessToken) {
                setAccessToken(newAccessToken);

                if (newRefreshToken) {
                    setRefreshToken(newRefreshToken);
                }

                if (newName) {
                    setName(newName);
                }

                if (newUserIdStr) {
                    const parsedId = Number(newUserIdStr);
                    if (!isNaN(parsedId)) {
                        setUserId(parsedId);
                    }
                }

                window.history.replaceState(null, "", window.location.pathname);

                alert(`${newName || "회원"} 님, 구글 로그인에 성공했습니다!`);

                navigate("/", { replace: true });
            } else {
                alert("로그인 정보가 올바르지 않습니다.");
                navigate("/login", { replace: true });
            }
        } else {
            alert("잘못된 접근입니다. 다시 로그인 해주세요.");
            navigate("/login", { replace: true });
        }
    }, [navigate, setAccessToken, setRefreshToken, setName, setUserId]);

    return (
        <div className="flex items-center justify-center h-screen text-white bg-black">
            구글 로그인 처리 중입니다...
        </div>
    );
};

export default GoogleCallbackPage;