import { redirect, notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ProfileForm from '@/components/profile/ProfileForm';
import { Database } from '@/lib/supabase/client';

export default async function EditProfilePage({
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
  
  async function updateProfile(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image_url = formData.get('image_url') as string;
    const address = formData.get('address') as string;
    const latitude = parseFloat(formData.get('latitude') as string);
    const longitude = parseFloat(formData.get('longitude') as string);
    
    if (!name || !description || !address || isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Missing required fields');
    }
    
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
    
    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        description,
        image_url: image_url || null,
        address,
        latitude,
        longitude,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id);
    
    if (error) {
      throw error;
    }
    
    redirect('/admin');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProfileForm initialData={profile} onSubmit={updateProfile} />
      </div>
    </div>
  );
}