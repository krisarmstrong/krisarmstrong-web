# Theming Guide (Web Foundation)

Overview
- The foundation exposes a robust theming system with CSS vars and a TS-based token map.

Tokens and CSS Vars
- CSS vars live in `src/themes/shared-tokens.css` and are consumed by `src/index.css` and components.
- TS tokens are in `src/tokens.ts` and consumed by `ThemeContext`.

Overriding tokens
- Override by redefining CSS vars in a consumer app, loaded after base tokens.

Theming API
- ThemeProvider, defaultDarkTheme, defaultLightTheme, intrinsicTheme, useTheme, useOptionalTheme exported from `src/context/ThemeContext`.
- Tokens: `layoutTokens`, `colorTokens`, `typographyTokens`, `themeTokens` in `src/tokens.ts`.

Extending the theme
- Add new tokens to the shared CSS and TS maps; update ThemeContext if you introduce new color families.

Migration notes
- Consider consolidating tokens into a shared package to reduce drift across consuming apps.
