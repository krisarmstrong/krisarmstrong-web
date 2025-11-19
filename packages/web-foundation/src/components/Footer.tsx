import type { FooterProps } from '../types';
import { themeTokens } from '../tokens';
import { useOptionalTheme } from '../context/ThemeContext';

const defaultSocial = [
  {
    label: 'GitHub',
    href: 'https://github.com/krisarmstrong',
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .297c-6.6 0-12 5.373-12 12 0 5.303 3.438 9.8 8.207 11.387.6.113.793-.263.793-.577v-2.234c-3.338.725-4.033-1.416-4.033-1.416-.547-1.389-1.334-1.758-1.334-1.758-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.238 1.839 1.238 1.07 1.835 2.809 1.305 3.495.997.108-.775.418-1.306.762-1.607-2.665-.303-5.467-1.334-5.467-5.93 0-1.309.468-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.241 2.873.12 3.176.77.84 1.234 1.912 1.234 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .318.192.694.801.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

export function Footer({
  social = defaultSocial,
  legalLinks,
  copyright,
  theme = 'dark',
}: FooterProps) {
  // Use theme context if available, otherwise fall back to theme prop
  const themeContext = useOptionalTheme();
  const contextTheme = themeContext?.theme;

  // If ThemeProvider is available, use its colors; otherwise use themeTokens
  const palette = contextTheme
    ? {
        surfaceRaised: contextTheme.surface?.raised || themeTokens[theme].surfaceRaised,
        textPrimary: contextTheme.text?.primary || themeTokens[theme].textPrimary,
        textMuted: contextTheme.text?.muted || themeTokens[theme].textMuted,
        border: contextTheme.surface?.border || themeTokens[theme].border,
      }
    : themeTokens[theme] || themeTokens.dark;

  return (
    <footer
      className="transition-colors duration-200"
      style={{
        backgroundColor: palette.surfaceRaised,
        color: palette.textMuted,
        borderTop: `1px solid ${palette.border}`,
        marginTop: '8rem',
        paddingTop: '4rem',
        paddingBottom: '4rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 text-center">
        {social.length > 0 && (
          <div className="flex justify-center gap-6">
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                rel="noopener noreferrer"
                target="_blank"
                className="transition-colors"
                style={{ color: palette.textMuted }}
              >
                {item.icon}
              </a>
            ))}
          </div>
        )}

        {legalLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {legalLinks.map((link, index) => (
              <span key={link.path} className="flex items-center gap-4">
                {index > 0 && (
                  <span aria-hidden="true" style={{ color: palette.textMuted }}>
                    |
                  </span>
                )}
                <a
                  href={link.path}
                  className="transition-colors hover:underline"
                  style={{ color: palette.textPrimary }}
                >
                  {link.label}
                </a>
              </span>
            ))}
          </div>
        )}

        <div className="text-sm" style={{ color: palette.textMuted }}>
          {copyright}
        </div>
      </div>
    </footer>
  );
}
