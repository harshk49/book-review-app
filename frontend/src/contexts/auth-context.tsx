"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { STORAGE_KEYS, ROUTES } from "@/lib/constants";
import { User } from "@/lib/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    if (token && user) {
      setState({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      setState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success("Logged in successfully!");
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? error.response?.data?.message || "An error occurred during login"
          : "An error occurred during login";

      toast.error(errorMessage);
      console.error("Login error:", error);
      throw error;
    }
  };

  // Register function
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await authAPI.register({ username, email, password });
      const { token, user } = response.data;

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      setState({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success("Account created successfully!");
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? error.response?.data?.message ||
            "An error occurred during registration"
          : "An error occurred during registration";

      toast.error(errorMessage);
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // No need to call the logout API endpoint as we're just clearing local storage
      // Clean up local storage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      // Update state
      setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Redirect to home
      router.push(ROUTES.HOME);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout properly");

      // Still clear client-side data even if server logout fails
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      setState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
