import Image from 'next/image';

export default function StaticMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const apiKey = process.env.GOOGLE_MAPS_STATIC_API_KEY;
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${apiKey}`;

  return (
    <div className="w-full h-full relative">
      <Image
        src={mapUrl}
        alt="Location map"
        fill
        className="object-cover"
        unoptimized // Static maps don't need Next.js image optimization
      />
    </div>
  );
}