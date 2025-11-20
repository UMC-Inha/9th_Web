import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key.js";

type User = {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
};

type AuthContextType = {
  user: User | null;
  isAuthed: boolean;
  login: (u: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 🔥 새로고침 시 로그인 유지
  useEffect(() => {
    const rawToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const rawRefresh = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);

    if (rawToken && rawRefresh) {
      setUser({
        id: 0,
        name: "",
        accessToken: rawToken, // ⭕ JSON.parse ❌
        refreshToken: rawRefresh, // ⭕ JSON.parse ❌
      });
    }
  }, []);

  // 🔥 로그인 성공 시 호출
  const login = (u: User) => {
    setUser(u);

    localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, u.accessToken); // ⭕
    localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, u.refreshToken); // ⭕
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthed: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
