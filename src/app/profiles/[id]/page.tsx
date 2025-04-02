import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MapDisplay from '@/components/map/MapDisplay';
import { Database } from '@/lib/supabase/client';

export const revalidate = 0;

export default async function ProfileDetailPage({
  params
}: {
  params: { id: string }
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single();
  
  if (error || !profile) {
    return notFound();
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6">
        &larr; Back to all profiles
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <div className="aspect-square relative">
              {profile.image_url ? (
                <Image
                  src={profile.image_url}
                  alt={profile.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="bg-gray-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <span className="text-gray-500 text-6xl">{profile.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-4">{profile.name}</h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700">{profile.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Address</h2>
              <p className="text-gray-700">{profile.address}</p>
            </div>
          </div>
        </div>
        
        <div className="h-[500px]">
          <MapDisplay
            latitude={profile.latitude}
            longitude={profile.longitude}
            address={profile.address}
            name={profile.name}
          />
        </div>
      </div>
    </main>
  );
}