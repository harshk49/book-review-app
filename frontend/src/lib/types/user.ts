// User-related types used throughout the frontend

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface UserRegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
