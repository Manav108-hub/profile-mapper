"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import  supabase  from '@/lib/supabase/client';
import { Profile } from '@/lib/supabase/helpers';

export default function DeleteProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      router.push('/admin');
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete profile');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">{error}</div>;
  if (!profile) return null;

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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Link
            href="/admin"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}