// app/admin/profiles/create/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import  supabase  from '@/lib/supabase/client';
import ProfileForm from '@/components/profile/ProfileForm';
import { ProfileInsert } from '@/lib/supabase/helpers';

export default function CreateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: ProfileInsert) => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.name || !formData.description || !formData.address) {
        throw new Error('All required fields must be filled');
      }

      const { error } = await supabase.from('profiles').insert({
        name: formData.name,
        description: formData.description,
        address: formData.address,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        image_url: formData.image_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      router.push('/admin');
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Profile</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProfileForm 
          onSubmit={handleSubmit} 
          isLoading={loading}
        />
      </div>
    </div>
  );
}