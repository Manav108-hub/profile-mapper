import Link from 'next/link';
import Image from 'next/image';
import { Database } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileCardProps {
  profile: Profile;
  isSelected?: boolean;
  index?: number;
}

export default function ProfileCard({ profile, isSelected, index = 0 }: ProfileCardProps) {
  return (
    <motion.div 
      className="group h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl overflow-hidden h-full shadow-lg transition-all duration-300 hover:shadow-xl transform group-hover:translate-y-1 flex flex-col">
        <div className="relative h-48 overflow-hidden">
          {profile.image_url ? (
            <div className="relative h-full w-full">
              <Image
                src={profile.image_url}
                alt={profile.name}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <span className="text-white text-8xl font-light opacity-80">{profile.name.charAt(0)}</span>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white drop-shadow-md">{profile.name}</h3>
          </div>
          
          {/* Location indicator */}
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        
        <div className="p-5 text-white/90 flex-grow">
          <p className="line-clamp-3 text-sm mb-5">{profile.description}</p>
          
          <div className="text-xs text-white/70 mb-4">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{profile.address}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 pt-0 space-y-2">
          <a
            href={`/?summary=${profile.id}`}
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-center px-4 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
          >
            View Location
          </a>
          
          <Link
            href={`/profiles/${profile.id}`}
            className="block w-full bg-white/10 hover:bg-white/20 text-white text-center px-4 py-2.5 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}