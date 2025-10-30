export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: User;
  };
  error?: string;
}

class SimpleAuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/auth';
  }

  // Authentifier l'utilisateur
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data?.token) {
        // Sauvegarder le token en localStorage
        localStorage.setItem('vanalexcars_token', data.data.token);
        localStorage.setItem('vanalexcars_user', JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de l'authentification:", error);
      return {
        success: false,
        error: 'Erreur de connexion',
      };
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const token = localStorage.getItem('vanalexcars_token');
    return !!token;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('vanalexcars_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('vanalexcars_token');
    localStorage.removeItem('vanalexcars_user');
  }

  // Obtenir le token pour les requêtes authentifiées
  getToken(): string | null {
    return localStorage.getItem('vanalexcars_token');
  }
}

export const simpleAuthService = new SimpleAuthService();
