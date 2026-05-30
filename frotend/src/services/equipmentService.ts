import api from './api';

export interface Equipment {
  id: number;
  owner_id: number;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  hp?: number;
  year?: number;
  description?: string;
  price_per_day: number;
  price_per_hour?: number;
  latitude: number;
  longitude: number;
  village?: string;
  district?: string;
  is_available: boolean;
  images: string[];
  attachments: string[];
  rating: number;
  total_ratings: number;
  total_rentals: number;
  distance_km?: number;
  owner_name?: string;
  owner_phone?: string;
}

export interface NearbyParams {
  lat: number;
  lng: number;
  radius_km?: number;
  equipment_type?: string;
  min_price?: number;
  max_price?: number;
}

export const equipmentService = {
  async getNearby(params: NearbyParams): Promise<Equipment[]> {
    const { data } = await api.get('/equipment/nearby', { params: { radius_km: 20, ...params } });
    return data;
  },

  async getByCategory(category: string, lat?: number, lng?: number): Promise<Equipment[]> {
    const { data } = await api.get(`/equipment/category/${category}`, {
      params: lat && lng ? { lat, lng } : {},
    });
    return data;
  },

  async search(q: string, lat?: number, lng?: number): Promise<Equipment[]> {
    const { data } = await api.get('/equipment/search', {
      params: { q, ...(lat && lng ? { lat, lng } : {}) },
    });
    return data;
  },

  async getById(id: number): Promise<Equipment> {
    const { data } = await api.get(`/equipment/${id}`);
    return data;
  },

  async getMyEquipment(): Promise<Equipment[]> {
    const { data } = await api.get('/equipment/mine/list');
    return data;
  },

  async getByOwner(ownerId: number): Promise<Equipment[]> {
    const { data } = await api.get(`/equipment/owner/${ownerId}`);
    return data;
  },

  async create(payload: Partial<Equipment>): Promise<Equipment> {
    const { data } = await api.post('/equipment/', payload);
    return data;
  },

  async update(id: number, payload: Partial<Equipment>): Promise<Equipment> {
    const { data } = await api.put(`/equipment/${id}`, payload);
    return data;
  },

  async toggleAvailability(id: number): Promise<{ id: number; is_available: boolean }> {
    const { data } = await api.patch(`/equipment/${id}/availability`);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/equipment/${id}`);
  },
};
