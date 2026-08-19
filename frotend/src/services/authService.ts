import api from './api';

export interface OTPResponse {
  message: string;
  dev_otp?: string;  // Only in DEV_MODE
}

export interface SendOtpPayload {
  email: string;
}

export interface SignupPayload {
  email: string;
  name: string;
  password: string;
  role: string;
  otp: string;
  village?: string;
  district?: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  access_token?: string;
  token_type?: string;
  user_id: string;
  role: string;
  name: string | null;
  is_new_user?: boolean;
  email?: string;
  phone?: string;
  village?: string;
  district?: string;
  skill_points?: number;
}

export const authService = {
  async sendOTP(email: string): Promise<OTPResponse> {
    const { data } = await api.post('/auth/send-otp', { email });
    return data;
  },

  async signup(email: string, otp: string, password: string, name: string, role: string, village?: string, district?: string, phone?: string): Promise<AuthUser> {
    const { data } = await api.post('/auth/signup', { email, otp, password, name, role, village, district, phone });
    // Persist token immediately so getMe works
    localStorage.setItem('agrirent_token', data.access_token);
    
    // Fetch full user profile
    const { data: fullUser } = await api.get('/auth/me');
    const userWithToken = { ...fullUser, access_token: data.access_token };
    
    localStorage.setItem('agrirent_user', JSON.stringify(userWithToken));
    return userWithToken;
  },

  async login(email: string, password: string): Promise<AuthUser> {
    const { data } = await api.post('/auth/login', { email, password });
    // Persist token immediately so getMe works
    localStorage.setItem('agrirent_token', data.access_token);
    
    // Fetch full user profile
    const { data: fullUser } = await api.get('/auth/me');
    const userWithToken = { ...fullUser, access_token: data.access_token };
    
    localStorage.setItem('agrirent_user', JSON.stringify(userWithToken));
    return userWithToken;
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
  }
};
