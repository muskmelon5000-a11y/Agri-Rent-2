import React from 'react';
import { AppHeader } from '../../components/shared/AppHeader';
import { Card } from '../../components/shared/Card';
const badges = [
{
  id: 1,
  name: 'First Rental',
  description: 'Completed your first successful rental',
  icon: '🌱',
  unlocked: true,
  date: 'Oct 2022'
},
{
  id: 2,
  name: 'Eco Driver',
  description: 'Saved 50L of fuel using Deal-Helper',
  icon: '🍃',
  unlocked: true,
  date: 'Jan 2023'
},
{
  id: 3,
  name: 'On-Time Master',
  description: 'Returned equipment on time 5 times',
  icon: '⏱️',
  unlocked: true,
  date: 'Mar 2023'
},
{
  id: 4,
  name: 'Village Hero',
  description: 'Rent equipment to 10 different farmers',
  icon: '🦸‍♂️',
  unlocked: false,
  progress: 60
},
{
  id: 5,
  name: 'Power User',
  description: 'Complete 50 total rentals',
  icon: '⚡',
  unlocked: false,
  progress: 24
}];

export function SkillBadges() {
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Skill Badges" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-50 rounded-full mb-4">
            <span className="text-4xl">🏆</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Achievements
          </h1>
          <p className="text-gray-600">
            Unlock badges by using the app and helping your community.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) =>
          <Card
            key={badge.id}
            className={`p-4 text-center relative overflow-hidden ${badge.unlocked ? 'bg-surface' : 'bg-gray-50 border-dashed'}`}>
            
              {!badge.unlocked &&
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10" />
            }

              <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-3 ${badge.unlocked ? 'bg-primary-50' : 'bg-gray-200 grayscale'}`}>
              
                {badge.icon}
              </div>

              <h3
              className={`font-bold mb-1 ${badge.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
              
                {badge.name}
              </h3>

              <p className="text-xs text-gray-500 mb-3 h-8 line-clamp-2">
                {badge.description}
              </p>

              {badge.unlocked ?
            <span className="text-xs font-bold text-primary bg-primary-50 px-2 py-1 rounded-md">
                  Unlocked {badge.date}
                </span> :

            <div className="w-full relative z-20">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{badge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                  className="bg-gray-400 h-1.5 rounded-full"
                  style={{
                    width: `${badge.progress}%`
                  }} />
                
                  </div>
                </div>
            }
            </Card>
          )}
        </div>
      </div>
    </div>);

}