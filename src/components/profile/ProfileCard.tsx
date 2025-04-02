'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Database } from '@/lib/supabase/client';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileCardProps {
  profile: Profile;
  onViewMap: (profile: Profile) => void;
}

export default function ProfileCard({ profile, onViewMap }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg">
      <div className="relative h-48 bg-gray-200">
        {profile.image_url ? (
          <Image
            src={profile.image_url}
            alt={profile.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500 text-lg">{profile.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{profile.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{profile.description}</p>
        <div className="flex justify-between">
          <button
            onClick={() => onViewMap(profile)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Summary
          </button>
          <Link
            href={`/profile/${profile.id}`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}