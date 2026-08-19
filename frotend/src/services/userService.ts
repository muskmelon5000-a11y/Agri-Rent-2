import api from './api';

export interface UserProfile {
  id: string;
  phone: string;
  name: string | null;
  role: string;
  language: string;
  village: string | null;
  district: string | null;
  state: string | null;
  skill_points: number;
  profile_image: string | null;
}

export const userService = {
  async getMyProfile(): Promise<UserProfile> {
    const { data } = await api.get('/users/me');
    return data;
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
    const { data } = await api.put('/users/me', payload);
    return data;
  },
  
  async getPublicProfile(userId: string): Promise<any> {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },

  async getVillageLeaderboard(): Promise<{village: string, leaders: any[]}> {
    const { data } = await api.get('/users/leaderboard/village');
    return data;
  }
};
