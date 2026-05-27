import React, { useEffect, useState } from 'react';
import { AppHeader } from '../../components/shared/AppHeader';
import { BottomNav } from '../../components/shared/BottomNav';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Avatar } from '../../components/shared/Avatar';
import { CalendarIcon, StarIcon, Loader2Icon } from 'lucide-react';
import { bookingService, Booking } from '../../services/bookingService';

export function CompletedJobs() {
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await bookingService.getProviderRequests();
        const completed = data.filter(b => b.status === 'completed');
        setJobs(completed);
      } catch (error) {
        console.error("Failed to load completed jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadJobs();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Completed Jobs" showBack />

      <div className="px-6 py-6 space-y-4">
        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 phone-scrollbar">
          <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold whitespace-nowrap">
            All Time
          </button>
          <button className="px-4 py-2 bg-surface text-gray-600 border border-gray-200 rounded-full text-sm font-semibold whitespace-nowrap">
            This Month
          </button>
          <button className="px-4 py-2 bg-surface text-gray-600 border border-gray-200 rounded-full text-sm font-semibold whitespace-nowrap">
            Tractors Only
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2Icon className="w-8 h-8 text-primary animate-spin mb-2" />
            <p>Loading completed jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No completed jobs found.</p>
          </div>
        ) : (
          jobs.map((job) =>
            <Card key={job.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={job.seeker_name || "Seeker"} size="md" />
                  <div>
                    <h3 className="font-bold text-gray-900">{job.seeker_name || "Farmer"}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarIcon className="w-3 h-3" />
                      {formatDate(job.start_date)} - {formatDate(job.end_date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-lg">₹{job.total_amount}</p>
                  <Badge variant="success" size="sm">
                    Paid
                  </Badge>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                <p className="font-semibold text-gray-700 text-sm">
                  {job.equipment_name}
                </p>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-secondary-700 fill-secondary-700" />
                  <span className="text-sm font-bold text-gray-900">
                    5.0
                  </span>
                </div>
              </div>
            </Card>
          )
        )}
      </div>

      <BottomNav role="provider" />
    </div>);

}