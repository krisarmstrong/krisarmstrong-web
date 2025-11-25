import React from 'react';

export type StatCardSize = 'sm' | 'md' | 'lg';
export type StatCardColorScheme = 'blue' | 'teal' | 'violet' | 'emerald' | 'amber';

export interface StatCardProps {
  /** Icon to display */
  icon: React.ReactNode;
  /** Primary value to display */
  value: string | number;
  /** Label describing the stat */
  label: string;
  /** Color scheme for the icon */
  colorScheme?: StatCardColorScheme;
  /** Size variant */
  size?: StatCardSize;
  /** Additional CSS classes */
  className?: string;
}

const sizeClasses: Record<
  StatCardSize,
  { padding: string; icon: string; value: string; label: string }
> = {
  sm: {
    padding: 'p-4',
    icon: 'mb-2',
    value: 'text-xl font-bold',
    label: 'text-xs',
  },
  md: {
    padding: 'p-6',
    icon: 'mb-3',
    value: 'text-2xl font-bold',
    label: 'text-sm',
  },
  lg: {
    padding: 'p-8',
    icon: 'mb-3',
    value: 'text-3xl font-bold',
    label: 'text-sm',
  },
};

const colorClasses: Record<StatCardColorScheme, string> = {
  blue: 'text-blue-500 dark:text-blue-400',
  teal: 'text-teal-500 dark:text-teal-400',
  violet: 'text-violet-500 dark:text-violet-400',
  emerald: 'text-emerald-500 dark:text-emerald-400',
  amber: 'text-amber-500 dark:text-amber-400',
};

/**
 * StatCard - A reusable statistics display card
 *
 * @example
 * ```tsx
 * <StatCard
 *   icon={<FileText size={32} />}
 *   value="200+"
 *   label="Real-World Cases"
 *   colorScheme="blue"
 *   size="lg"
 * />
 * ```
 */
export function StatCard({
  icon,
  value,
  label,
  colorScheme = 'blue',
  size = 'md',
  className = '',
}: StatCardProps): React.ReactElement {
  const sizes = sizeClasses[size];
  const iconColor = colorClasses[colorScheme];

  return (
    <div
      className={`bg-surface-raised border border-surface-border ${sizes.padding} rounded-lg text-center shadow-lg dark:shadow-black/30 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all ${className}`}
    >
      <div className={`flex justify-center ${sizes.icon} ${iconColor}`}>{icon}</div>
      <p className={`${sizes.value} text-text-primary mb-1`}>{value}</p>
      <p className={`${sizes.label} text-text-muted`}>{label}</p>
    </div>
  );
}

export default StatCard;
