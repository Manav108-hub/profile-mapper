'use client';

import { useState } from 'react';
import ProfileCard from './ProfileCard';
import MapDisplay from '../map/MapDisplay';
import { Database } from '@/lib/supabase/client';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileListProps {
  profiles: Profile[];
}

export default function ProfileList({ profiles }: ProfileListProps) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProfiles = profiles.filter(profile => 
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search profiles by name or address..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onViewMap={setSelectedProfile}
          />
        ))}
      </div>
      
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
            <div className="p-4 bg-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-semibold">{selectedProfile.name} - Location</h3>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="h-[500px]">
              <MapDisplay 
                latitude={selectedProfile.latitude} 
                longitude={selectedProfile.longitude} 
                address={selectedProfile.address}
                name={selectedProfile.name}
              />
            </div>
          </div>
        </div>
      )}
      
      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No profiles found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}