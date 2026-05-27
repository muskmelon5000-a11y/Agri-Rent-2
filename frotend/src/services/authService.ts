import api from './api';

export interface OTPResponse {
  message: string;
  dev_otp?: string;  // Only in DEV_MODE
}

export interface AuthUser {
  access_token?: string;
  token_type?: string;
  user_id: number;
  role: string;
  name: string | null;
  is_new_user?: boolean;
  phone?: string;
  village?: string;
  district?: string;
  skill_points?: number;
}

export const authService = {
  async sendOTP(phone: string): Promise<OTPResponse> {
    const { data } = await api.post('/auth/send-otp', { phone });
    return data;
  },

  async verifyOTP(phone: string, otp: string, role?: string, name?: string): Promise<AuthUser> {
    const { data } = await api.post('/auth/verify-otp', { phone, otp, role, name });
    // Persist token + user
    localStorage.setItem('agrirent_token', data.access_token);
    localStorage.setItem('agrirent_user', JSON.stringify(data));
    return data;
  },

  logout() {
    localStorage.removeItem('agrirent_token');
    localStorage.removeItem('agrirent_user');
  },

  getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem('agrirent_user');
    return raw ? JSON.parse(raw) : null;
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem('agrirent_token');
  },

  async getMe(): Promise<AuthUser> {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
