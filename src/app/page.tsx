// app/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ProfileList from '@/components/profile/ProfileList';
import StaticMap from '@/components/map/StaticMap';
import { Database } from '@/lib/supabase/client';

export const revalidate = 0;

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  // Get search parameters
  const searchTerm = Array.isArray(searchParams?.q)
    ? searchParams.q[0]
    : searchParams?.q ?? '';
    
  const summaryId = Array.isArray(searchParams?.summary)
    ? searchParams.summary[0]
    : searchParams?.summary;

  // Base query
  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  // Add search filter
  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
  }

  // Get profiles
  const { data: profiles, error } = await query;

  // Get selected profile if summary ID exists
  let selectedProfile = null;
  if (summaryId) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', summaryId)
      .single();
    selectedProfile = profileData;
  }

  if (error) {
    console.error('Error fetching profiles:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-red-500">Failed to load profiles. Please try again later.</p>
      </div>
    );
  }

  return (
    <main>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Profile Explorer</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Browse through profiles and explore their locations on the map
          </p>
        </div>
      </div>

      <ProfileList 
        profiles={profiles || []} 
        searchTerm={searchTerm}
        selectedProfile={selectedProfile}
      />
    </main>
  );
}