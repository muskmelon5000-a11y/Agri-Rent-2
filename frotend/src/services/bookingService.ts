import api from './api';

export interface Booking {
  id: number;
  seeker_id: number;
  equipment_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  total_amount: number;
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'cancelled' | 'rejected';
  delivery_type: 'pickup' | 'delivery';
  delivery_address?: string;
  estimated_area?: number;
  notes?: string;
  created_at?: string;
  equipment_name?: string;
  equipment_image?: string;
  seeker_name?: string;
  seeker_phone?: string;
  owner_name?: string;
  owner_phone?: string;
  equipment_price_per_day?: number;
  equipment_village?: string;
}

export interface CreateBookingPayload {
  equipment_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  delivery_type?: string;
  delivery_address?: string;
  estimated_area?: number;
  estimated_hours?: number;
  notes?: string;
  attachments_requested?: string;
}

export const bookingService = {
  async create(payload: CreateBookingPayload): Promise<Booking> {
    const { data } = await api.post('/bookings/', payload);
    return data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const { data } = await api.get('/bookings/my');
    return data;
  },

  async getProviderRequests(): Promise<Booking[]> {
    const { data } = await api.get('/bookings/provider');
    return data;
  },

  async getById(id: number): Promise<Booking> {
    const { data } = await api.get(`/bookings/${id}`);
    return data;
  },

  async updateStatus(id: number, status: string): Promise<Booking> {
    const { data } = await api.patch(`/bookings/${id}/status`, { status });
    return data;
  },

  async cancel(id: number): Promise<void> {
    await api.delete(`/bookings/${id}/cancel`);
  },
};
