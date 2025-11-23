/**
 * Tailwind v4 Safelist Component
 * Forces generation of responsive utilities needed by web-foundation components.
 * This component is never actually rendered - it just exists to ensure Tailwind
 * detects these classes during the build.
 */

export function TailwindSafelist() {
  return (
    <div className="hidden">
      <div className="hidden md:flex" />
      <div className="flex md:hidden" />
      <div className="sm:w-64 md:w-80" />
    </div>
  );
}
