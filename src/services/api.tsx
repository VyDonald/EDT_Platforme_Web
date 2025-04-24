import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types pour les données
interface Role {
  id: string;
  nom: string;
}

interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  roleId: string;
  profilePic?: string;
  provider?: 'email' | 'google' | 'facebook';
}

interface AuthResponse {
  token: string;
  utilisateur: Utilisateur;
}

interface Credentials {
  email: string;
  password: string;
}

interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface SocialLoginData {
  provider: 'google' | 'facebook';
  token: string;
  name: string;
  email: string;
  profilePic?: string;
}

// Configurer l'instance Axios
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Intercepter les requêtes pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fonctions pour interagir avec l'API
export const login = async (credentials: Credentials): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await api.post('/login', credentials);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await api.post('/register', data);
  return response.data;
};

export const socialLogin = async (data: SocialLoginData): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await api.post('/social-login', data);
  return response.data;
};

export const getRoles = async (): Promise<Role[]> => {
  const response: AxiosResponse<Role[]> = await api.get('/roles');
  return response.data;
};

export const createRole = async (role: Omit<Role, 'id'>): Promise<Role> => {
  const response: AxiosResponse<Role> = await api.post('/roles', role);
  return response.data;
};

export default api;