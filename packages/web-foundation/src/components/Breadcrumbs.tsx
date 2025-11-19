import type { BreadcrumbsProps } from '../types';
/**
 * Breadcrumbs - A component to display a breadcrumb trail.
 *
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.items - An array of breadcrumb items.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element | null} The rendered breadcrumbs component or null if no items are provided.
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap gap-2 rounded-lg border bg-surface-raised px-4 py-3 text-sm text-text-primary ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={item.path} className="flex items-center gap-2">
            {index > 0 && <span className="text-text-muted">/</span>}
            {isLast ? (
              <span className="font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <a
                href={item.path}
                className="transition-colors underline-offset-4 hover:underline text-text-muted"
              >
                {item.label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
