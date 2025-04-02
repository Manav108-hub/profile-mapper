"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import  supabase  from '@/lib/supabase/client';
import ProfileForm from '@/components/profile/ProfileForm';
import { Profile, ProfileUpdate } from '@/lib/supabase/helpers';

export default function EditProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (formData: ProfileUpdate) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          image_url: formData.image_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);

      if (error) throw error;
      router.push('/admin');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">{error}</div>;
  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProfileForm 
          initialData={profile} 
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </div>
    </div>
  );
}