import { redirect, notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Database } from '@/lib/supabase/client';

export default async function DeleteProfilePage({
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
  
  async function deleteProfile() {
    'use server';
    
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', params.id);
    
    if (error) {
      throw error;
    }
    
    redirect('/admin');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Delete Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Are you sure you want to delete this profile?</h2>
          <p className="text-red-600">This action cannot be undone.</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h3 className="font-medium mb-2">{profile.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{profile.address}</p>
          <p className="text-sm text-gray-600">{profile.description.substring(0, 100)}...</p>
        </div>
        
        <form action={deleteProfile}>
          <div className="flex justify-end space-x-3">
            <Link
              href="/admin"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}