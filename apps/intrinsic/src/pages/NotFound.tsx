import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl font-heading font-bold text-primary-dark mb-4">404</h1>
        <h2 className="text-3xl font-heading mb-6">Page Not Found</h2>
        <p className="text-xl text-text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-brand-accent text-primary-dark font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
