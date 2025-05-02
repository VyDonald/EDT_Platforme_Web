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
    config.headers.Authorization = `Bearer ${token}`; // Correction de la syntaxe
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

// Interface pour un Cours
interface Cours {
  id: string;
  nom: string;
  capacite: number;
  description: string;
  enseignantId: string;
  statutId: string;
}

// Interface pour un Enseignant
interface Enseignant {
  id: string;
  nom: string;
  prenom: string;
}

// Interface pour un Statut
interface Statut {
  id: string;
  nom: string;
}

// Récupérer tous les cours
export const getCours = async (): Promise<Cours[]> => {
  const response: AxiosResponse<Cours[]> = await api.get('/cours');
  return response.data;
};

// Créer un cours
export const createCours = async (cours: Omit<Cours, 'id'>): Promise<Cours> => {
  const response: AxiosResponse<Cours> = await api.post('/cours', cours);
  return response.data;
};

// Mettre à jour un cours
export const updateCours = async (id: string, cours: Partial<Cours>): Promise<void> => {
  await api.patch(`/cours/${id}`, cours); // Correction de la syntaxe
};

// Supprimer un cours
export const deleteCours = async (id: string): Promise<void> => {
  await api.delete(`/cours/${id}`); // Correction de la syntaxe
};

// Récupérer les enseignants
export const getEnseignants = async (): Promise<Utilisateur[]> => { // Changé en Utilisateur pour cohérence
  try {
    const response: AxiosResponse<Utilisateur[]> = await api.get('/utilisateurs/enseignants');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des enseignants via l\'API, filtrage côté client', error);
    const utilisateurs = await getUtilisateurs();
    return utilisateurs.filter(user => user.roleId === 'enseignant');
  }
};

// Récupérer les statuts
export const getStatuts = async (): Promise<Statut[]> => {
  const response: AxiosResponse<Statut[]> = await api.get('/statuts');
  return response.data;
};

// Interface pour une Salle
interface Salle {
  id: string;
  nom: string;
  capacite: number;
}

// Récupérer toutes les salles
export const getSalles = async (): Promise<Salle[]> => {
  const response: AxiosResponse<Salle[]> = await api.get('/salles');
  return response.data;
};

// Créer une salle
export const createSalle = async (salle: Omit<Salle, 'id'>): Promise<Salle> => {
  const response: AxiosResponse<Salle> = await api.post('/salles', salle);
  return response.data;
};

// Mettre à jour une salle
export const updateSalle = async (id: string, salle: Partial<Salle>): Promise<void> => {
  await api.patch(`/salles/${id}`, salle); // Correction de la syntaxe
};

// Supprimer une salle
export const deleteSalle = async (id: string): Promise<void> => {
  await api.delete(`/salles/${id}`); // Correction de la syntaxe
};

// Interface pour une Filière
interface Filiere {
  id: string;
  nom: string;
}

// Récupérer toutes les filières
export const getFilieres = async (): Promise<Filiere[]> => {
  const response: AxiosResponse<Filiere[]> = await api.get('/filieres');
  return response.data;
};

// Créer une filière
export const createFiliere = async (filiere: Omit<Filiere, 'id'>): Promise<Filiere> => {
  const response: AxiosResponse<Filiere> = await api.post('/filieres', filiere);
  return response.data;
};

// Mettre à jour une filière
export const updateFiliere = async (id: string, filiere: Partial<Filiere>): Promise<void> => {
  await api.patch(`/filieres/${id}`, filiere); // Correction de la syntaxe
};

// Supprimer une filière
export const deleteFiliere = async (id: string): Promise<void> => {
  await api.delete(`/filieres/${id}`); // Correction de la syntaxe
};

// Interface pour un Utilisateur (mise à jour)
interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  roleId: string;
  filiereId?: string;
  classe?: string; // Optionnel
  password?: string;
}

// Récupérer tous les utilisateurs
export const getUtilisateurs = async (): Promise<Utilisateur[]> => {
  const response: AxiosResponse<Utilisateur[]> = await api.get('/utilisateurs');
  return response.data;
};

// Récupérer les utilisateurs avec le rôle délégué
export const getDelegues = async (): Promise<Utilisateur[]> => {
  try {
    const response: AxiosResponse<Utilisateur[]> = await api.get('/utilisateurs/delegues');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des délégués via l\'API, filtrage côté client', error);
    const utilisateurs = await getUtilisateurs();
    return utilisateurs.filter(user => user.roleId === 'delegue');
  }
};

// Récupérer les utilisateurs avec le rôle enseignant
export const getEnseignant = async (): Promise<Utilisateur[]> => { // Renommé pour cohérence
  try {
    const response: AxiosResponse<Utilisateur[]> = await api.get('/utilisateurs/enseignants');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des enseignants via l\'API, filtrage côté client', error);
    const utilisateurs = await getUtilisateurs();
    return utilisateurs.filter(user => user.roleId === 'enseignant');
  }
};

// Créer un utilisateur
export const createUtilisateur = async (utilisateur: Omit<Utilisateur, 'id'>): Promise<Utilisateur> => {
  const response: AxiosResponse<Utilisateur> = await api.post('/utilisateurs', utilisateur);
  return response.data;
};

// Mettre à jour un utilisateur
export const updateUtilisateur = async (id: string, utilisateur: Partial<Utilisateur>): Promise<void> => {
  await api.patch(`/utilisateurs/${id}`, utilisateur); // Correction de la syntaxe
};

// Supprimer un utilisateur
export const deleteUtilisateur = async (id: string): Promise<void> => {
  await api.delete(`/utilisateurs/${id}`); // Correction de la syntaxe
};
//Nouvelles fonctions pour les créneaux
export const getCreneaux = async (): Promise<Creneau[]> => {
  const response: AxiosResponse<Creneau[]> = await api.get('/creneaux');
  return response.data;
};

// Nouvelles fonctions pour les emplois du temps
export const getEmploisDuTemps = async (): Promise<EmploiDuTemps[]> => {
  const response: AxiosResponse<EmploiDuTemps[]> = await api.get('/emplois-du-temps');
  return response.data;
};

export const createEmploiDuTemps = async (emploiDuTemps: Omit<EmploiDuTemps, 'id'>): Promise<EmploiDuTemps> => {
  const response: AxiosResponse<EmploiDuTemps> = await api.post('/emplois-du-temps', emploiDuTemps);
  return response.data;
};

export const updateEmploiDuTemps = async (id: string, emploiDuTemps: Partial<EmploiDuTemps>): Promise<void> => {
  await api.patch(`/emplois-du-temps/${id}`, emploiDuTemps);
};

export const deleteEmploiDuTemps = async (id: string): Promise<void> => {
  await api.delete(`/emplois-du-temps/${id}`);
};

export const visualiserEmploiDuTemps = async (id: string): Promise<EmploiDuTempsVisualisation> => {
  const response: AxiosResponse<EmploiDuTempsVisualisation> = await api.get(`/emplois-du-temps/${id}/visualiser`);
  return response.data;
};

// Nouvelles fonctions pour les séances
export const getSeances = async (): Promise<Seance[]> => {
  const response: AxiosResponse<Seance[]> = await api.get('/seances');
  return response.data;
};

export const createSeance = async (seance: Omit<Seance, 'id'>): Promise<Seance> => {
  const response: AxiosResponse<Seance> = await api.post('/seances', seance);
  return response.data;
};

export const updateSeance = async (id: string, seance: Partial<Seance>): Promise<void> => {
  await api.patch(`/seances/${id}`, seance);
};

export const deleteSeance = async (id: string): Promise<void> => {
  await api.delete(`/seances/${id}`);
};

export default api;