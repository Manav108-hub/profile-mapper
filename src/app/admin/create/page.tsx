import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ProfileForm from '@/components/profile/ProfileForm';
import { Database } from '@/lib/supabase/client';

export default function CreateProfilePage() {
  async function createProfile(formData: FormData) {
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
    
    try {
      const { error } = await supabase.from('profiles').insert({
        name,
        description,
        image_url: image_url || null,
        address,
        latitude,
        longitude,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (error) {
        throw error;
      }
      
      // This will properly end the request and redirect
      return redirect('/admin');
    } catch (error) {
      // Re-throw the error to be handled by the client
      throw error;
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProfileForm onSubmit={createProfile} />
      </div>
    </div>
  );
}