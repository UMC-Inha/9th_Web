import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const GoogleCallbackPage = () => {
    const navigate = useNavigate();
    const {setAccessToken, setRefreshToken, setName} = useAuth();

    const lock = useRef(false); // 좀비 프로세스 방지용

    useEffect(() => {
        if (lock.current) {
            return;
        }

        lock.current = true;

        if (window.location.search) {
            const searchParams = new URLSearchParams(window.location.search);

            const newAccessToken = searchParams.get("accessToken");
            const newRefreshToken = searchParams.get("refreshToken");
            const newName = searchParams.get("name");

            if (newAccessToken) {
                setAccessToken(newAccessToken);

                if (newRefreshToken) {
                    setRefreshToken(newRefreshToken);
                }

                if (newName) {
                    setName(newName);
                }

                window.history.replaceState(null, "", window.location.pathname);

                alert(`${newName || "user"} 님, 구글 로그인에 성공했습니다!`);

                navigate("/", { replace: true });
            } 

            else {
                alert("로그인 정보가 올바르지 않습니다.");

                navigate("/login", { replace: true });
            }
        }

        else {
            alert("잘못된 접근입니다. 다시 로그인 해주세요.");

            navigate("/login", { replace: true });
        }
    }, [navigate, setAccessToken, setRefreshToken, setName]);

    return (
        <div className="flex items-center justify-center h-screen text-white bg-black">
            구글 로그인 처리 중입니다...
        </div>
    );
};

export default GoogleCallbackPage;
