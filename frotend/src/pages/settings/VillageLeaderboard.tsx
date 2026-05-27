import React, { useEffect, useState } from 'react';
import { AppHeader } from '../../components/shared/AppHeader';
import { Card } from '../../components/shared/Card';
import { Avatar } from '../../components/shared/Avatar';
import { TrophyIcon, Loader2Icon } from 'lucide-react';
import { userService } from '../../services/userService';

export function VillageLeaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [village, setVillage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await userService.getVillageLeaderboard();
        setVillage(data.village);
        setLeaders(data.leaders);
      } catch (e) {
        console.error("Failed to load leaderboard", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full bg-background flex flex-col items-center justify-center">
        <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Leaderboard" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {village} Village
          </h1>
          <p className="text-gray-600 mb-6">Top contributors this month</p>

          <div className="flex bg-surface rounded-xl p-1 border border-gray-200 max-w-xs mx-auto">
            <button className="flex-1 py-2 text-sm font-semibold bg-primary text-white rounded-lg shadow-sm">
              Rentals
            </button>
            <button className="flex-1 py-2 text-sm font-semibold text-gray-600 rounded-lg">
              Eco-Score
            </button>
          </div>
        </div>

        {/* Top 3 Podium */}
        {leaders.length >= 3 ? (
          <div className="flex items-end justify-center gap-2 pt-8 pb-4">
            {/* Rank 2 */}
            <div className="flex flex-col items-center">
              <Avatar name={leaders[1].name} size="md" />
              <div className="w-20 h-24 bg-gray-200 rounded-t-xl mt-2 flex flex-col items-center justify-start pt-2">
                <span className="text-xl font-bold text-gray-500">2</span>
                <span className="text-xs font-bold text-gray-700 mt-1 truncate w-full text-center px-1">
                  {leaders[1].name.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Rank 1 */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar name={leaders[0].name} size="lg" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">
                  👑
                </div>
              </div>
              <div className="w-24 h-32 bg-primary-100 rounded-t-xl mt-2 flex flex-col items-center justify-start pt-2 border-t-4 border-primary">
                <span className="text-2xl font-bold text-primary">1</span>
                <span className="text-sm font-bold text-gray-900 mt-1 truncate w-full text-center px-1">
                  {leaders[0].name.split(' ')[0]}
                </span>
                <span className="text-xs text-primary font-semibold mt-1">
                  {leaders[0].points} pts
                </span>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex flex-col items-center">
              <Avatar name={leaders[2].name} size="md" />
              <div className="w-20 h-20 bg-earth-amber/20 rounded-t-xl mt-2 flex flex-col items-center justify-start pt-2">
                <span className="text-xl font-bold text-earth-amber">3</span>
                <span className="text-xs font-bold text-gray-700 mt-1 truncate w-full text-center px-1">
                  {leaders[2].name.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Not enough data for podium.</div>
        )}

        {/* List */}
        <div className="space-y-3">
          {leaders.slice(3).map((leader) =>
          <Card
            key={leader.rank}
            className={`p-4 flex items-center gap-4 ${leader.isMe ? 'border-2 border-primary bg-primary-50' : ''}`}>
            
              <div className="w-8 text-center font-bold text-gray-500">
                #{leader.rank}
              </div>
              <Avatar name={leader.name} size="sm" />
              <div className="flex-1">
                <h3
                className={`font-bold ${leader.isMe ? 'text-primary' : 'text-gray-900'}`}>
                
                  {leader.name} {leader.isMe && '(You)'}
                </h3>
                <p className="text-xs text-gray-600">
                  {leader.rentals} rentals
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900">{leader.points}</span>
                <span className="text-xs text-gray-500 block">pts</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>);

}