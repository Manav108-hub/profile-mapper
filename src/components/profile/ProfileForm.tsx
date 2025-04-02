'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';

interface ProfileFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    image_url?: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const isSubmitting = isPending || loading;
  
  const defaultData = {
    name: '',
    description: '',
    image_url: '',
    address: '',
    latitude: 0,
    longitude: 0,
    ...initialData
  };
  
  const [formData, setFormData] = useState(defaultData);
  
  // Function to handle fetching coordinates from address
  const geocodeAddress = async () => {
    if (!formData.address) return;
    
    try {
      setLoading(true);
      // Using Mapbox Geocoding API
      const query = encodeURIComponent(formData.address);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude
        }));
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      alert('Failed to get coordinates from address. Please try again or enter coordinates manually.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      setLoading(true);
      // Let the server action handle the redirect
      await onSubmit(formData);
      // Removed router.push - server handles redirection
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
      setLoading(false); // Only reset loading on error
    }
  };
  
  const handleCancel = () => {
    // Use browser history instead of router
    window.history.back();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        ></textarea>
      </div>
      
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          id="image_url"
          name="image_url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.image_url || ''}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        />
        {formData.image_url && (
          <div className="mt-2 relative h-32 w-32 border rounded">
            <Image
              src={formData.image_url}
              alt="Profile preview"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded"
              onError={() => {
                alert('Invalid image URL');
                setFormData({ ...formData, image_url: '' });
              }}
            />
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="address"
            name="address"
            required
            className="block w-full rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <button
            type="button"
            onClick={geocodeAddress}
            className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Get Coordinates
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            id="latitude"
            name="latitude"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
          />
        </div>
        
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            id="longitude"
            name="longitude"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Profile' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
}