import api from './api';

export interface EarningsDay {
  name: string;
  value: number;
}

export interface ProviderDashboard {
  total_earnings_month: number;
  earnings_change_pct: number;
  active_rentals: number;
  completed_jobs: number;
  pending_requests: number;
  weekly_chart: EarningsDay[];
  top_machine_name: string | null;
  top_machine_image: string | null;
  top_machine_earnings: number | null;
  top_machine_rentals: number | null;
}

export const providerService = {
  async getDashboard(): Promise<ProviderDashboard> {
    const { data } = await api.get('/provider/dashboard');
    return data;
  },

  async getMonthlyEarnings(): Promise<EarningsDay[]> {
    const { data } = await api.get('/provider/earnings/monthly');
    return data;
  }
};
