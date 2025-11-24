import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl font-heading font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-3xl font-heading mb-6">Page Not Found</h2>
        <p className="text-xl text-text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-brand-accent text-text-inverse font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
