import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppHeader } from '../../../components/shared/AppHeader';
import { BottomNav } from '../../../components/shared/BottomNav';
import { Button } from '../../../components/shared/Button';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Avatar } from '../../../components/shared/Avatar';
import {
  StarIcon,
  PhoneIcon,
  MessageCircleIcon,
  MapPinIcon,
  Loader2Icon } from
'lucide-react';
import { userService } from '../../../services/userService';
import { equipmentService, Equipment } from '../../../services/equipmentService';
export function OwnerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [profileData, equipmentData] = await Promise.all([
          userService.getPublicProfile(id!),
          equipmentService.getByOwner(id!)
        ]);
        setProfile(profileData);
        setEquipmentList(equipmentData);
      } catch (e) {
        console.error("Failed to load owner profile", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-full bg-background flex flex-col items-center justify-center">
        <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-full bg-background pb-20">
      <AppHeader title="Owner Profile" showBack />

      <div className="px-6 py-6 space-y-6">
        {/* Profile Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar name={profile.name || "Owner"} verified size="xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {profile.name || "Owner"}
          </h1>
          <p className="text-base text-gray-600 mb-4">Equipment Provider</p>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-1 bg-secondary-50 px-3 py-2 rounded-xl">
              <StarIcon className="w-5 h-5 text-secondary-700 fill-secondary-700" />
              <span className="font-bold text-gray-900">4.8</span>
              <span className="text-sm text-gray-600">({profile.skill_points || 0} Points)</span>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="flex gap-3">
            <Button variant="primary" className="flex-1">
              <PhoneIcon className="w-5 h-5" />
              Call
            </Button>
            <Button variant="secondary" className="flex-1">
              <MessageCircleIcon className="w-5 h-5" />
              Message
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-primary mb-1">{profile.joined_year ? new Date().getFullYear() - profile.joined_year : 0}</p>
            <p className="text-sm text-gray-600">Years Active</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-primary mb-1">{profile.completed_jobs || 0}</p>
            <p className="text-sm text-gray-600">Rentals</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-primary mb-1">{profile.equipment_count || 0}</p>
            <p className="text-sm text-gray-600">Machines</p>
          </Card>
        </div>

        {/* Rating Breakdown */}
        <Card className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Rating Breakdown
          </h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) =>
            <div key={stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-8">
                  {stars}★
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                  className="h-full bg-secondary"
                  style={{
                    width: `${stars === 5 ? 75 : stars === 4 ? 20 : 5}%`
                  }} />
                
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {stars === 5 ? 36 : stars === 4 ? 10 : 2}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Location */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPinIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Location</h2>
          </div>
          <p className="text-base text-gray-700">
            {profile.village || 'Unknown'}, {profile.district || 'Unknown District'}, Gujarat
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Serves within 15 km radius
          </p>
        </Card>

        {/* Equipment List */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Available Equipment
          </h2>
          {equipmentList.length === 0 ? (
            <p className="text-gray-500">No equipment listed.</p>
          ) : (
            <div className="space-y-3">
              {equipmentList.map((item) =>
                <Link key={item.id} to={`/seeker/machine/${item.id}`}>
                  <Card className="flex gap-4 p-4">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl" />
                  
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <Badge variant="neutral" size="sm" className="mb-2">
                        {item.type}
                      </Badge>
                      <p className="text-base font-bold text-primary">
                        ₹{item.price_per_day}/day
                      </p>
                    </div>
                    <span className="text-primary font-semibold self-center">
                      →
                    </span>
                  </Card>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNav role="seeker" />
    </div>);

}