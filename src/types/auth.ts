export interface User {
  id: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  role: 'student' | 'lecturer' | 'admin';
  firstName: string;
  lastName: string;
}