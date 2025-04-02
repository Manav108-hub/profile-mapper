"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import InteractiveMap from '@/components/map/InteractiveMap';
import supabase from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState('about');
  
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('Profile ID is required');
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 flex justify-center items-center">
        <div className="relative">
          <div className="h-32 w-32 rounded-full absolute border-t-4 border-b-4 border-purple-500 animate-spin"></div>
          <div className="h-32 w-32 rounded-full absolute border-l-4 border-r-4 border-pink-500 animate-[spin_1.5s_linear_infinite]"></div>
          <div className="h-24 w-24 rounded-full absolute border-t-4 border-pink-500 border-dashed animate-[spin_2s_linear_infinite]"></div>
          <div className="h-16 w-16 rounded-full absolute border-l-4 border-indigo-500 animate-[spin_3s_linear_infinite]"></div>
        </div>
      </div>
    );
  }
  
  if (error || !profile) {
    return notFound();
  }
  
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 py-12 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/" 
            className="inline-flex items-center text-white/90 hover:text-white mb-8 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to all profiles
          </Link>
        </motion.div>
        
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl overflow-hidden border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <motion.div 
            className="md:flex relative"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="md:w-2/5 lg:w-1/3 relative min-h-[300px] md:min-h-[400px]">
              {profile.image_url ? (
                <Image
                  src={profile.image_url}
                  alt={profile.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-all duration-500 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm">
                  <span className="text-white text-9xl font-light opacity-80">{profile.name.charAt(0)}</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:hidden">
                <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
              </div>
            </div>
            
            <div className="md:w-3/5 lg:w-2/3 p-8">
              <div className="hidden md:block">
                <h1 className="text-4xl font-bold text-white mb-2">{profile.name}</h1>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"></div>
              </div>
              
              <div className="flex mb-6 border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('about')}
                  className={`px-4 py-2 font-medium transition-all relative ${activeTab === 'about' ? 'text-white' : 'text-white/60 hover:text-white/80'}`}
                >
                  About
                  {activeTab === 'about' && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                    ></motion.div>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('address')}
                  className={`px-4 py-2 font-medium transition-all relative ${activeTab === 'address' ? 'text-white' : 'text-white/60 hover:text-white/80'}`}
                >
                  Address
                  {activeTab === 'address' && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                    ></motion.div>
                  )}
                </button>
              </div>
              
              <div className="text-white/90 space-y-4">
                {activeTab === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="leading-relaxed">{profile.description}</p>
                  </motion.div>
                )}
                
                {activeTab === 'address' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 p-4 rounded-lg backdrop-blur-sm"
                  >
                    <p className="mb-2">{profile.address}</p>
                    <div className="text-sm opacity-70">
                      <div>Latitude: {profile.latitude}</div>
                      <div>Longitude: {profile.longitude}</div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="h-[400px] md:h-[500px] relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none"></div>
            <InteractiveMap latitude={profile.latitude} longitude={profile.longitude} />
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}