import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const GoogleCallbackPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        let accessToken = params.get("accessToken");
        let refreshToken = params.get("refreshToken");
        let name = params.get("name");

        if (!accessToken && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

            accessToken = hashParams.get("accessToken");
            refreshToken = hashParams.get("refreshToken");
            name = hashParams.get("name");
        }

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);

            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            window.history.replaceState(null, "", window.location.pathname);

            alert(`${name || "user"} 님, 구글 로그인에 성공했습니다!`);

            navigate("/", { replace: true });
        } 

        else {
            const savedToken = localStorage.getItem("accessToken");

            if (savedToken) {
                navigate("/", { replace: true });
            } 
            
            else {
                alert("로그인 토큰이 없습니다. 다시 로그인해주세요.");
                navigate("/login", { replace: true });
            }
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen text-white bg-black">
            구글 로그인 처리 중입니다...
        </div>
    );
};

export default GoogleCallbackPage;
