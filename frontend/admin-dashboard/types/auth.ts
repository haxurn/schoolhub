export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface LoginFormData extends LoginCredentials {
  rememberMe: boolean;
}