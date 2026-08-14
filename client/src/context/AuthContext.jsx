import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";
import { authStorage } from "../utils/authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [accessToken, setAccessToken] =
    useState(() =>
      authStorage.getAccessToken()
    );

  const [loading, setLoading] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  const login = async (credentials) => {
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        credentials
      );

      const {
        accessToken,
        refreshToken,
        user,
      } = response.data.data;

      authStorage.setTokens({
        accessToken,
        refreshToken,
      });

      setAccessToken(accessToken);
      setUser(user);

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Current User
  |--------------------------------------------------------------------------
  */

  const fetchCurrentUser = async () => {
  const response = await api.get(
    "/auth/me"
  );

  const currentUser =
    response.data.data.user;

  setUser(currentUser);

  return currentUser;
};

  /*
  |--------------------------------------------------------------------------
  | Restore Login
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const restoreAuth = async () => {
      const storedAccessToken =
        authStorage.getAccessToken();

      if (!storedAccessToken) {
        setLoading(false);
        return;
      }

      try {
        setAccessToken(storedAccessToken);

        await fetchCurrentUser();
        
      } catch (error) {
        console.error(
          "Failed to restore authentication:",
          error
        );

        authStorage.clearTokens();

        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);


  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const logout = async () => {
    try {
      if (accessToken) {
          await api.post(
          "/auth/logout"
        );
      }
    } finally {
      authStorage.clearTokens();

      setUser(null);
      setAccessToken(null);
    }
  };

  const value = {
    user,
    accessToken,
    isAuthenticated:
      !!user && !!accessToken,
    loading,
    login,
    logout,
    fetchCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};