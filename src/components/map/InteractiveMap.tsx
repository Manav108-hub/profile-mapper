'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { motion } from 'framer-motion';

// Custom map styles for a dark theme
const mapStyles = [
  {
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#ffffff"}]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#000000"}, {"lightness": 13}]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#000000"}]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#144b53"}, {"lightness": 14}, {"weight": 1.4}]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{"color": "#08304b"}]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{"color": "#0c4152"}, {"lightness": 5}]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#000000"}]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#0b434f"}, {"lightness": 25}]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [{"color": "#000000"}]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#0b3d51"}, {"lightness": 16}]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{"color": "#000000"}]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{"color": "#146474"}]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{"color": "#021019"}]
  }
];

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const Map = ({ lat, lng }: { lat: number; lng: number }) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markerInstance, setMarkerInstance] = useState<google.maps.Marker | null>(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ["places"]
  });

  useEffect(() => {
    // Animation for marker drop effect
    if (markerInstance) {
      markerInstance.setAnimation(google.maps.Animation.DROP);
    }
  }, [markerInstance]);

  const onMapLoad = (map: google.maps.Map) => {
    setMapInstance(map);
    
    // Add custom style to make the map prettier
    map.setOptions({
      styles: mapStyles,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true
    });
  };

  const onMarkerLoad = (marker: google.maps.Marker) => {
    setMarkerInstance(marker);
  };

  if (loadError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center text-white">
        <div className="text-center p-6 bg-black/20 backdrop-blur-md rounded-xl max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Map Error</h3>
          <p className="mb-4">Failed to load Google Maps. Please check your API key and try again.</p>
          <div className="text-sm bg-black/20 p-3 rounded-lg">
            Error: {loadError.message}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-l-4 border-r-4 border-pink-500 rounded-full animate-spin absolute top-0 animate-[spin_1.7s_linear_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={{ lat, lng }}
      onLoad={onMapLoad}
      options={{
        styles: mapStyles
      }}
    >
      <Marker 
        position={{ lat, lng }} 
        onLoad={onMarkerLoad}
        icon={{
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%239146ff" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 40)
        }}
      />
    </GoogleMap>
  );
};

export default function InteractiveMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  return (
    <motion.div 
      className="w-full h-full relative rounded-b-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none"></div>
      
      <div className="h-full w-full">
        <Map lat={latitude} lng={longitude} />
      </div>
      
      <div className="absolute bottom-2 left-2 text-xs bg-black/30 backdrop-blur-sm text-white/80 px-2 py-1 rounded-md z-20">
        Lat: {latitude.toFixed(6)} • Long: {longitude.toFixed(6)}
      </div>
    </motion.div>
  );
}