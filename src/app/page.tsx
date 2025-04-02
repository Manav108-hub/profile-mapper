"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfileList from '@/components/profile/ProfileList';
import supabase from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function Home() {
  const searchParams = useSearchParams();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get search parameters
  const searchTerm = searchParams.get('q') || '';
  const summaryId = searchParams.get('summary') || '';

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true);
        
        // Base query
        let query = supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        // Add search filter if provided
        if (searchTerm) {
          query = query.or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
        }

        // Get profiles
        const { data, error: profileError } = await query;

        if (profileError) {
          throw new Error(`Failed to fetch profiles: ${profileError.message}`);
        }

        setProfiles(data || []);
        
        // Get selected profile if summary ID exists
        if (summaryId) {
          const { data: profileData, error: singleProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', summaryId)
            .single();
          
          if (singleProfileError && singleProfileError.code !== 'PGRST116') {
            console.error('Error fetching selected profile:', singleProfileError);
          }
          
          setSelectedProfile(profileData);
        } else {
          setSelectedProfile(null);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfiles();
  }, [searchTerm, summaryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-blue-400 border-solid rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-r-4 border-purple-400 border-solid rounded-full animate-spin absolute top-0 animate-[spin_1.2s_linear_infinite]"></div>
          <div className="w-16 h-16 border-b-4 border-pink-400 border-solid rounded-full animate-spin absolute top-0 animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 flex justify-center items-center p-4">
        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-8 shadow-2xl border border-white/20 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-red-200 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700"
    >
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative pt-16 pb-8 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-pink-300"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Profile Explorer
            </motion.h1>
            <motion.p 
              className="text-xl max-w-2xl mx-auto text-blue-100 opacity-90"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Browse through profiles and explore their locations on the map
            </motion.p>
          </div>
        </div>
      </div>

      <ProfileList 
        profiles={profiles} 
        searchTerm={searchTerm}
        selectedProfile={selectedProfile}
      />
      
      {/* Add styles for animation */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </motion.main>
  );
}