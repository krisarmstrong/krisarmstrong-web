type AvatarSize = 'sm' | 'md' | 'lg';
type AvatarVariant = 'violet' | 'blue';

interface AvatarProps {
  /** The size of the avatar. */
  size?: AvatarSize;
  /** The source URL of the avatar image. */
  src?: string;
  /** The alt text for the avatar image. */
  alt?: string;
  /** The initials to display if no image is provided. */
  initials?: string;
  /** The color variant of the avatar. */
  variant?: AvatarVariant;
  /** Additional CSS classes. */
  className?: string;
}

const variantClasses: Record<AvatarVariant, string> = {
  violet: 'bg-gradient-to-br from-violet-600 to-indigo-600 ring-violet-500/30',
  blue: 'bg-gradient-to-br from-blue-600 to-cyan-600 ring-blue-500/30',
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

/**
 * Avatar - A component to display a user's avatar.
 *
 * @param {Object} props - The component props.
 * @param {AvatarSize} [props.size='md'] - The size of the avatar.
 * @param {string} [props.src] - The source URL of the avatar image.
 * @param {string} [props.alt='Profile'] - The alt text for the avatar image.
 * @param {string} [props.initials='KA'] - The initials to display if no image is provided.
 * @param {AvatarVariant} [props.variant='violet'] - The color variant of the avatar.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The rendered avatar component.
 */
export function Avatar({
  size = 'md',
  src,
  alt = 'Profile',
  initials = 'KA',
  variant = 'violet',
  className = '',
}: AvatarProps) {
  return (
    <div
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full overflow-hidden flex items-center justify-center font-bold text-white shadow-lg ring-2 ${className}`.trim()}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
