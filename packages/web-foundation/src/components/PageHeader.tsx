import type { LucideIcon } from 'lucide-react';

type PageHeaderVariant = 'violet' | 'blue' | 'sage';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  variant?: PageHeaderVariant;
}

const variantStyles: Record<PageHeaderVariant, { gradient: string; ring: string }> = {
  violet: {
    gradient: 'from-violet-600 to-indigo-600',
    ring: 'ring-violet-500/30',
  },
  blue: {
    gradient: 'from-blue-600 to-cyan-600',
    ring: 'ring-blue-500/30',
  },
  sage: {
    gradient: 'from-green-600 to-emerald-600',
    ring: 'ring-green-500/30',
  },
};

export function PageHeader({
  icon: Icon,
  title,
  description,
  className = '',
  variant = 'violet'
}: PageHeaderProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`mb-8 transition duration-300 ease-out ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-3 bg-gradient-to-br ${styles.gradient} rounded-lg shadow-lg ring-2 ${styles.ring}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-main">
          {title}
        </h1>
      </div>
      {description && (
        <p className="text-sm sm:text-base ml-[60px] text-text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
