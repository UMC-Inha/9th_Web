import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { postSignin, postSignout } from '../apis/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../apis/axiosInstance';
import { AxiosError, AxiosRequestConfig } from 'axios';

interface AuthContextProps {
    accessToken : string | null;
    refreshToken : string | null;
    name : string | null;
    userId: number | null;
    signin : (email : string, password : string) => Promise<void>;
    signout : () => void;
    setAccessToken : (token : string | null) => void;
    setRefreshToken : (token : string | null) => void;
    setName : (name : string | null) => void;
    setUserId: (id: number | null) => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error ("useAuth 는 AuthProvider 와 함께 필수 사용");
    }

    return context;
}

export const AuthProvider = ({ children } : PropsWithChildren) => {
    const [accessToken, setAccessToken] = useLocalStorage<string | null>("accessToken", null);
    const [refreshToken, setRefreshToken] = useLocalStorage<string | null>("refreshToken", null);
    const [name, setName] = useLocalStorage<string | null>("name", null);
    const [userId, setUserId] = useLocalStorage<number | null>("userId", null);

    const navigate = useNavigate();

    const signin = async (email : string, password : string) => {
        const { accessToken, refreshToken, name, id } = await postSignin({ email, password });

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setName(name);
        setUserId(id);
    };

    const signout = async () => {
        try {
            await postSignout();
        }

        catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                console.warn("Signout failed (401), proceeding with local logout.");
            }

            else {
                let message = "알 수 없는 에러가 발생하였습니다 !";

                if (error instanceof Error) {
                    message = error.message;
                }
    
                alert(message);
            }
        }

        finally {
            setAccessToken(null);
            setRefreshToken(null);
            setName(null);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            navigate('/');
        }
    };

    /*
    useEffect(() => {
        if (!accessToken) {
            alert ('로그인 세션이 만료되었습니다. 다시 로그인 해주세요 !');
        }
    }, [accessToken]);
    */

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                if (accessToken && config.headers) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
        
                return config;
            }, 
            
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            
            async (error : AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & {__retry? : boolean};
        
                if (originalRequest?.url?.includes('/auth/signout')) {
                    return Promise.reject(error);
                }
        
                if (error.response?.status === 401 && !originalRequest.__retry) {
                    originalRequest.__retry = true;

                    if (!refreshToken) {
                        alert ('로그인 세션이 만료되었습니다. 다시 로그인 해 주세요 !');
        
                        signout();
        
                        return Promise.reject(error);
                    }
        
                    try {
                        const response = await axiosInstance.post('/auth/refresh', {
                            refreshToken,
                        })
        
                        const newAccessToken = response.data?.data?.accessToken;
        
                        if (newAccessToken) {
                            setAccessToken(newAccessToken);
        
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                            }
        
                            return axiosInstance(originalRequest);
                        } 
                        
                        else {
                            alert ('새 토큰이 발급되지 않았습니다. 다시 로그인 해주세요 !');
        
                            signout();
                        }
                    }
        
                    catch (error) {
                        alert ('로그인 세션이 만료되었습니다. 다시 로그인 해주세요 !');
        
                        signout();
        
                        return Promise.reject(error);
                    }
                }
        
                return Promise.reject(error);
            }
        )

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        }
    }, [accessToken, refreshToken, setAccessToken, signout])

    return (
        <AuthContext.Provider value={{accessToken, refreshToken, name, userId, signin, signout, setAccessToken, setRefreshToken, setName, setUserId}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
