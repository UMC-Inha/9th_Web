import React, { createContext, useState } from 'react';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (token: string, refresh: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { set, remove, get } = useLocalStorage();
  const [isLoggedIn, setIsLoggedIn] = useState(!!get(LOCAL_STORAGE_KEY.accessToken));

  const login = (accessToken: string, refreshToken: string) => {
    set(LOCAL_STORAGE_KEY.accessToken, accessToken);
    set(LOCAL_STORAGE_KEY.refreshToken, refreshToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    remove(LOCAL_STORAGE_KEY.accessToken);
    remove(LOCAL_STORAGE_KEY.refreshToken);
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
