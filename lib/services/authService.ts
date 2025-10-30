export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user_email: string;
    user_nicename: string;
    user_display_name: string;
  };
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  display_name: string;
}

class AuthService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    // Utiliser l'endpoint Next.js pour éviter les problèmes CORS
    this.baseUrl = '/api/auth';
    this.token = this.getStoredToken();
  }

  // Obtenir le token stocké
  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }

  // Stocker le token
  private setStoredToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_token', token);
    }
  }

  // Supprimer le token
  private removeStoredToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
    }
  }

  // Authentifier l'utilisateur
  async authenticate(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      console.log(
        "Tentative d'authentification vers:",
        `${this.baseUrl}/login`
      );
      console.log('Identifiants:', credentials);

      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Réponse reçue:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur de réponse:', errorText);
        throw new Error(
          `Échec de l'authentification: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Données reçues:', data);

      if (data.success && data.data?.token) {
        this.token = data.data.token;
        if (this.token) {
          this.setStoredToken(this.token);
        }
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de l'authentification:", error);
      if (
        error instanceof TypeError &&
        error.message.includes('Failed to fetch')
      ) {
        throw new Error(
          "Impossible de se connecter au serveur. Vérifiez que l'API est accessible"
        );
      }
      throw error;
    }
  }

  // Valider le token
  async validateToken(): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/token/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: this.token }),
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // Obtenir les headers d'authentification
  getAuthHeaders(): Record<string, string> {
    if (!this.token) {
      return {};
    }

    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  // Déconnexion
  logout(): void {
    this.token = null;
    this.removeStoredToken();
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser(): AuthUser | null {
    if (!this.token) {
      return null;
    }

    try {
      // Décoder le token JWT (partie payload)
      const parts = this.token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      return payload.data.user;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
