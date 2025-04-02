'use client';

import { useEffect, useState } from 'react';
// import Map, { Marker, NavigationControl, Popup } from ;
import Map, {Marker , NavigationControl, Popup} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapDisplayProps {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

export default function MapDisplay({ latitude, longitude, address, name }: MapDisplayProps) {
  const [showPopup, setShowPopup] = useState(false);
  
  return (
    <Map
      initialViewState={{
        latitude,
        longitude,
        zoom: 14
      }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      <NavigationControl position="top-right" />
      
      <Marker
        latitude={latitude}
        longitude={longitude}
        onClick={(e: { originalEvent: { stopPropagation: () => void; }; }) => {
          e.originalEvent.stopPropagation();
          setShowPopup(true);
        }}
      />
      
      {showPopup && (
        <Popup
          latitude={latitude}
          longitude={longitude}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setShowPopup(false)}
          anchor="bottom"
          offset={[0, -10]}
        >
          <div className="p-2">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm">{address}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}