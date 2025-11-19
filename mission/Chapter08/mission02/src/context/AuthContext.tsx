import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { RequestSigninDto, ResponseMyInfoDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY, QUERY_KEY } from "../constants/key";
import { getMyInfo, postLogout, postSignin } from "../apis/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type User = ResponseMyInfoDto["data"];

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (signInData: RequestSigninDto) => Promise<boolean>;
  logout: () => Promise<void>;
  setAuthTokens: (accessToken: string, refreshToken: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null,
  login: async () => false,
  logout: async () => {},
  setAuthTokens: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenFromStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenFromStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );

  const queryClient = useQueryClient();

  const { data: myInfoResponse, error: myInfoError } = useQuery({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const user = myInfoResponse?.data ?? null;

  useEffect(() => {
    if (myInfoError) {
      console.error("유저 정보 조회 실패 (토큰 만료 등):", myInfoError);
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      queryClient.removeQueries({ queryKey: [QUERY_KEY.myInfo] });
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
    }
  }, [
    myInfoError,
    queryClient,
    removeAccessTokenFromStorage,
    removeRefreshTokenFromStorage,
  ]);

  const login = async (signInData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signInData);

      if (data) {
        const newAccessToken = data.accessToken;
        const newrefreshToken = data.refreshToken;

        setAccessTokenFromStorage(newAccessToken);
        setRefreshTokenFromStorage(newrefreshToken);

        setAccessToken(newAccessToken);
        setRefreshToken(newrefreshToken);

        alert("로그인 성공");
        return true;
      }
    } catch (error) {
      console.log(error);
      alert("로그인 실패");
      return false;
    }

    return true;
  };

  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();

      setAccessToken(null);
      setRefreshToken(null);

      queryClient.setQueryData([QUERY_KEY.myInfo], null);

      alert("로그아웃됨");
    } catch (error) {
      console.log(error);
      alert("로그아웃 실패");
    }
  };

  const setAuthTokens = (
    newAccessToken: string,
    newRefreshToken: string | null
  ) => {
    setAccessTokenFromStorage(newAccessToken);
    setAccessToken(newAccessToken);

    if (newRefreshToken) {
      setRefreshTokenFromStorage(newRefreshToken);
      setRefreshToken(newRefreshToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, setAuthTokens, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }

  return context;
};
