'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Profile, ProfileInsert, ProfileUpdate } from '@/lib/supabase/helpers';

// components/profile/ProfileForm.tsx
// components/profile/ProfileForm.tsx
interface ProfileFormProps {
  initialData?: Profile | null;
  onSubmit: (formData: {
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    image_url?: string | null;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const isSubmitting = isPending || loading;
  const [activeSection, setActiveSection] = useState('basic');
  
  const defaultData: ProfileInsert = {
    name: '',
    description: '',
    image_url: '',
    address: '',
    latitude: 0,
    longitude: 0,
    ...initialData
  };
  
  const [formData, setFormData] = useState<ProfileInsert | ProfileUpdate>(defaultData);
  const [previewError, setPreviewError] = useState(false);

  const geocodeAddress = async () => {
    if (!formData.address) return;
    
    try {
      setLoading(true);
      const query = encodeURIComponent(formData.address);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      
      const data = await response.json();
      
      if (data.features?.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude
        }));
        setActiveSection('location');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Failed to get coordinates. Please try again or enter manually.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      const submissionData = {
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        image_url: formData.image_url || null
      } as ProfileInsert; // Type assertion after validation
      
      await onSubmit(submissionData);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const formSections = {
    basic: (
      <motion.div 
        key="basic-info"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-1.5">
            Profile Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="block w-full rounded-lg border-0 bg-white/10 backdrop-blur-md text-white shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-purple-500 p-3"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter profile name"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white/90 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="block w-full rounded-lg border-0 bg-white/10 backdrop-blur-md text-white shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-purple-500 p-3 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter profile description"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-white/90 mb-1.5">
            Image URL
          </label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            className="block w-full rounded-lg border-0 bg-white/10 backdrop-blur-md text-white shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-purple-500 p-3"
            value={formData.image_url || ''}
            onChange={(e) => {
              setFormData({ ...formData, image_url: e.target.value });
              setPreviewError(false);
            }}
            placeholder="Enter image URL (optional)"
          />
          
          {formData.image_url && (
            <div className="mt-4 flex items-start space-x-4">
              <div className="relative h-32 w-32 rounded-lg overflow-hidden border border-white/20 shadow-md">
                {previewError ? (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                ) : (
                  <Image
                    src={formData.image_url}
                    alt="Profile preview"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg transition-transform duration-500 hover:scale-110"
                    onError={() => {
                      setPreviewError(true);
                    }}
                  />
                )}
              </div>
              
              <div className="text-sm text-white/70">
                <p className="font-medium text-white mb-1">Image Preview</p>
                {previewError ? (
                  <div className="text-red-400">
                    <p>Invalid image URL. Please check the URL and try again.</p>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="mt-2 text-purple-400 hover:text-purple-300 underline text-xs"
                    >
                      Clear Image URL
                    </button>
                  </div>
                ) : (
                  <p>This image will be displayed on the profile card and detail page.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    ),
    location: (
      <motion.div 
        key="location-info"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-white/90 mb-1.5">
            Address
          </label>
          <div className="flex rounded-lg shadow-sm">
            <input
              type="text"
              id="address"
              name="address"
              required
              className="block w-full rounded-l-lg border-0 bg-white/10 backdrop-blur-md text-white shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-purple-500 p-3"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter location address"
            />
            <button
              type="button"
              onClick={geocodeAddress}
              className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-white/20 bg-white/10 hover:bg-white/20 text-white font-medium transition-colors duration-300"
              disabled={isSubmitting || !formData.address}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading</span>
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Get Coordinates</span>
                </span>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-white/90 mb-1.5">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              required
              className="block w-full rounded-lg border-0 bg-white/10 backdrop-blur-md text-white shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-purple-500 p-3"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
            />
          </div>
          
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-white/90 mb-1.5">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              required
              className="block w-full rounded-lg border-0 bg-white/10 backdrop-blur-md text-white shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-purple-500 p-3"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
            />
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <h3 className="text-sm font-medium text-white/90 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Location Tips
          </h3>
          <ul className="text-xs text-white/70 space-y-1 list-disc pl-5">
            <li>Use the "Get Coordinates" button to automatically fill in latitude and longitude</li>
            <li>For better accuracy, include city, state, and country in the address</li>
            <li>You can manually adjust coordinates if needed for precise positioning</li>
          </ul>
        </div>
      </motion.div>
    )
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/10">
        <div className="mb-6 flex border-b border-white/10 pb-4">
          <nav className="flex space-x-1 w-full">
            <button
              type="button"
              onClick={() => setActiveSection('basic')}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors relative ${
                activeSection === 'basic' 
                  ? 'text-white bg-white/10' 
                  : 'text-white/60 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Basic Info
              {activeSection === 'basic' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                ></motion.div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('location')}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors relative ${
                activeSection === 'location' 
                  ? 'text-white bg-white/10' 
                  : 'text-white/60 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
              {activeSection === 'location' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                ></motion.div>
              )}
            </button>
          </nav>
        </div>
        
        <div className="min-h-[350px]">
          {formSections[activeSection as keyof typeof formSections]}
        </div>
        
        <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2.5 border border-white/20 rounded-lg text-white bg-white/5 hover:bg-white/10 transition-colors duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <div className="flex space-x-2">
            {activeSection === 'basic' ? (
              <button
                type="button"
                onClick={() => setActiveSection('location')}
                className="inline-flex items-center px-4 py-2.5 border border-purple-500 rounded-lg text-white bg-purple-500/20 hover:bg-purple-500/30 transition-colors duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900"
              >
                Next: Location
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveSection('basic')}
                  className="inline-flex items-center px-4 py-2.5 border border-white/20 rounded-lg text-white bg-white/5 hover:bg-white/10 transition-colors duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span>
                      {initialData?.id ? 'Update Profile' : 'Create Profile'}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}