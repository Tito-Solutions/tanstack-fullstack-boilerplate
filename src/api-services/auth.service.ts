import { apiClient } from './client';
import {
  SignInRequest,
  SignUpRequest,
  AuthResponse,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  AuthTokens,
  User
} from './types';

export class AuthService {
  async signIn(credentials: SignInRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // response.data is the AuthResponse { user, tokens }
    const authData = response.data;
    
    // Store tokens in localStorage and set them in the apiClient
    if (authData.tokens) {
      apiClient.setAuthToken(authData.tokens.accessToken);
      apiClient.setRefreshToken(authData.tokens.refreshToken);
    }
    
    return authData;
  }

  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      // response.data is the AuthResponse { user, tokens }
      const authData = response.data;
      
      // Store tokens in localStorage
      if (authData.tokens) {
        apiClient.setAuthToken(authData.tokens.accessToken);
        apiClient.setRefreshToken(authData.tokens.refreshToken);
      }
      
      return authData;
    } catch (error) {
      // Re-throw the error so it can be handled by the calling function
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      // Get the refresh token before clearing it
      const refreshToken = apiClient.getRefreshToken();
      
      // Get current user to get userId
      if (refreshToken && this.isAuthenticated()) {
        try {
          const user = await this.getCurrentUser();
          await apiClient.post('/auth/logout', {
            userId: user.id,
            refreshToken: refreshToken
          });
        } catch (error) {
          // If getting user fails, still try to logout with what we have
          console.warn('Failed to get user for logout:', error);
        }
      }
    } finally {
      // Always clear local tokens
      apiClient.removeAuthToken();
      apiClient.removeRefreshToken();
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await apiClient.post('/auth/reset-password', request);
  }

  async updatePassword(request: UpdatePasswordRequest): Promise<void> {
    await apiClient.post('/auth/update-password', request);
  }

  async refreshToken(): Promise<AuthTokens | null> {
    try {
      const refreshToken = apiClient.getRefreshToken();
      if (!refreshToken) return null;

      const response = await apiClient.post<{ tokens: AuthTokens }>('/auth/refresh', {
        refreshToken,
      });

      if (response.success && response.data.tokens) {
        apiClient.setAuthToken(response.data.tokens.accessToken);
        apiClient.setRefreshToken(response.data.tokens.refreshToken);
        return response.data.tokens;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token });
  }

  async resendVerificationEmail(email: string): Promise<void> {
    await apiClient.post('/auth/resend-verification', { email });
  }

  // OAuth methods for external providers
  async getOAuthUrl(provider: 'google' | 'github' | 'auth0'): Promise<string> {
    const response = await apiClient.get<{ url: string }>(`/auth/oauth/${provider}`);
    return response.data.url;
  }

  async handleOAuthCallback(code: string, state: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/oauth/callback', { code, state });
    
    // Store tokens in localStorage
    if (response.success && response.data.tokens) {
      localStorage.setItem('auth_token', response.data.tokens.accessToken);
      localStorage.setItem('refresh_token', response.data.tokens.refreshToken);
    }
    
    return response.data;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Get current auth token
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  }
}

export const authService = new AuthService();