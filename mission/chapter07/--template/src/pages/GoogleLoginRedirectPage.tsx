import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constans/key";

const GoogleLoginRedirectPage = () => {
  const qc = useQueryClient();

  const { setItem: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { setItem: setRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
      const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

      if (accessToken) {
        setAccessToken(accessToken);
        if (refreshToken) setRefreshToken(refreshToken);

        await qc.invalidateQueries({ queryKey: ["me"] });

        // 원하는 복귀 경로가 있으면 state로 넘겨서 처리 가능
        window.location.replace("/my");
      } else {
        // 토큰이 없으면 로그인 페이지로
        window.location.replace("/login");
      }
    })();
  }, [qc, setAccessToken, setRefreshToken]);

  return <div />;
};

export default GoogleLoginRedirectPage;
