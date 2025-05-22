import api from "./base";
import {
  AuthResponse,
  UserLoginInput,
  UserRegisterInput,
} from "@/lib/types/user";

export const authAPI = {
  register: (userData: UserRegisterInput) =>
    api.post<AuthResponse>("/auth/signup", userData),
  login: (credentials: UserLoginInput) =>
    api.post<AuthResponse>("/auth/login", credentials),
  // No logout API needed as we handle that client-side
};
