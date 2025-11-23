const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/krisarmstrong',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .297c-6.6 0-12 5.373-12 12 0 5.303 3.438 9.8 8.207 11.387.6.113.793-.263.793-.577v-2.234c-3.338.725-4.033-1.416-4.033-1.416-.547-1.389-1.334-1.758-1.334-1.758-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.238 1.839 1.238 1.07 1.835 2.809 1.305 3.495.997.108-.775.418-1.306.762-1.607-2.665-.303-5.467-1.334-5.467-5.93 0-1.309.468-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.241 2.873.12 3.176.77.84 1.234 1.912 1.234 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .318.192.694.801.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kris-armstrong-cissp/',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.025-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.939v5.667h-3.554v-11.5h3.414v1.569h.049c.476-.899 1.637-1.849 3.369-1.849 3.602 0 4.268 2.368 4.268 5.452v6.328zM5.337 7.433c-1.144 0-2.068-.926-2.068-2.065 0-1.143.924-2.065 2.068-2.065 1.141 0 2.065.922 2.065 2.065 0 1.139-.924 2.065-2.065 2.065zm1.777 13.019h-3.554v-11.5h3.554v11.5zm15.385-19.014h-17.338c-1.104 0-2 .896-2 2v20.014c0 1.104.896 2 2 2h17.338c1.104 0 2-.896 2-2v-20.014c0-1.104-.896-2-2-2z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/wifivigilante',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@wifivigilante',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const FOOTER_LINKS = {
  legal: [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-of-service' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-raised text-text-muted border-t border-surface-border transition-colors duration-200 mt-32 pt-16 pb-16 px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 text-center">
        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-4">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              rel="noopener noreferrer"
              target="_blank"
              className="text-text-muted transition-colors hover:text-text-primary"
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {FOOTER_LINKS.legal.map((link, index) => (
            <span key={link.path} className="flex items-center gap-4">
              {index > 0 && (
                <span aria-hidden="true" className="text-text-muted">
                  |
                </span>
              )}
              <a
                href={link.path}
                className="text-text-primary transition-colors hover:underline hover:text-text-accent"
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-sm text-text-muted">
          &copy; {currentYear} Wi-Fi Vigilante. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
