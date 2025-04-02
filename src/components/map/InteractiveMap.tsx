'use client';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const Map = ({ lat, lng }: { lat: number; lng: number }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      zoom={14}
      center={{ lat, lng }}
      mapContainerClassName="w-full h-full"
    >
      <Marker position={{ lat, lng }} />
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
    <div className="w-full h-full">
      <Map lat={latitude} lng={longitude} />
    </div>
  );
}