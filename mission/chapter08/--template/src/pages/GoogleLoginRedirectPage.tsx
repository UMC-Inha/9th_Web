import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constans/key";

const GoogleLoginRedirectPage = () => {
  const qc = useQueryClient();

  const { setRaw: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { setRaw: setRefreshToken } = useLocalStorage(
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

        // 토큰 저장 후 정확한 query key로 invalidate
        await qc.invalidateQueries({ queryKey: ["me", accessToken] });
        // prefix 매칭으로 모든 me 쿼리도 invalidate
        await qc.invalidateQueries({ queryKey: ["me"] });

        // 원하는 복귀 경로가 있으면 state로 넘겨서 처리 가능
        window.location.replace("/my")
      } else {
        // 토큰이 없으면 로그인 페이지로
        window.location.replace("/login");
      }
    })();
  }, [qc, setAccessToken, setRefreshToken]);

  return <div />;
};

export default GoogleLoginRedirectPage;
