'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ProfileCard from './ProfileCard';
import { Database } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type Profile = Database['public']['Tables']['profiles']['Row'];
const MapModal = dynamic(
  () => import('@/components/map/InteractiveMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-md animate-pulse flex items-center justify-center">
        <div className="h-16 w-16 border-t-4 border-r-4 border-blue-400 rounded-full animate-spin"></div>
      </div>
    )
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState(searchTerm);
  const [isModalOpen, setIsModalOpen] = useState(!!selectedProfile);

  useEffect(() => {
    // When selectedProfile changes, update modal state
    setIsModalOpen(!!selectedProfile);

    // Add body class to prevent scrolling when modal is open
    if (selectedProfile) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedProfile]);

  useEffect(() => {
    setSearchInputValue(searchTerm);
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="max-w-3xl mx-auto mb-10">
        <motion.form 
          method="GET" 
          action="/"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-black/20 backdrop-blur-xl rounded-full flex items-center overflow-hidden border border-white/20 shadow-lg">
              <input
                type="text"
                name="q"
                placeholder="Search profiles by name or address..."
                className="w-full px-6 py-4 bg-transparent text-white focus:outline-none placeholder-white/60"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-4 transition-all duration-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="ml-2 hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </motion.form>
      </div>

      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {profiles.map((profile, index) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isSelected={selectedProfile?.id === profile.id}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div 
          className="text-center py-12 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">No profiles found</h3>
          <p className="text-white/70 text-lg max-w-md mx-auto">We couldn't find any profiles matching "{searchTerm}". Try a different search term.</p>
          <a 
            href="/" 
            className="mt-6 inline-block bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 rounded-full transition-all duration-300"
          >
            Clear search
          </a>
        </motion.div>
      )}

      {/* Location Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProfile && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-full max-w-4xl bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/20"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
            >
              <div className="p-4 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{selectedProfile.name}'s Location</h3>
                </div>
                <a
                  href="/"
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              
              <div className="p-4 text-white/80 text-sm bg-white/5">
                <p>{selectedProfile.address}</p>
                <div className="flex space-x-4 mt-1 text-xs text-white/60">
                  <span>Lat: {selectedProfile.latitude}</span>
                  <span>Long: {selectedProfile.longitude}</span>
                </div>
              </div>
              
              <div className="h-[500px] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none"></div>
                <MapModal
                  latitude={selectedProfile.latitude}
                  longitude={selectedProfile.longitude}
                />
              </div>
              
              <div className="p-4 bg-black/20 flex justify-between items-center">
                <a
                  href="/"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Close
                </a>
                <Link
                  href={`/profiles/${selectedProfile.id}`}
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                >
                  <span>View Full Profile</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}