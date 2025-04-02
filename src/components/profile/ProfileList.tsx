// components/profile/ProfileList.tsx
'use client';


import dynamic from 'next/dynamic';

import StaticMap from '../map/StaticMap';
import ProfileCard from './ProfileCard';
import { Database } from '@/lib/supabase/client';

type Profile = Database['public']['Tables']['profiles']['Row'];
const MapModal = dynamic(
  () => import('@/components/map/InteractiveMap'),
  { 
    ssr: false,
    loading: () => <div className="h-[500px] bg-gray-200 animate-pulse" />
  }
);

interface ProfileListProps {
  profiles: Profile[];
  searchTerm?: string;
  selectedProfile?: Profile | null;
}

export default function ProfileList({ 
  profiles, 
  searchTerm = '',
  selectedProfile 
}: ProfileListProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <form method="GET" action="/" className="mb-6">
        <input
          type="text"
          name="q"
          placeholder="Search profiles by name or address..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue={searchTerm}
        />
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isSelected={selectedProfile?.id === profile.id}
          />
        ))}
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
            <div className="p-4 bg-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-semibold">{selectedProfile.name} - Location</h3>
              <a
                href="/"
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </a>
            </div>
            <div className="h-[500px]">
              <MapModal 
                latitude={selectedProfile.latitude} 
                longitude={selectedProfile.longitude} 
              />
            </div>
          </div>
        </div>
      )}

      {profiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No profiles found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}