import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}