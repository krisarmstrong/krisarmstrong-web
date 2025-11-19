# Theming Guide

Overview
- This project uses CSS variables to theme components and a shared tokens approach with a per-repo shared-tokens.css.

Tokens and CSS Vars
- CSS vars mirror the tokens in `src/shared-tokens.css` (brand, surface, text, interactive, status).

Overriding tokens
- Override tokens by adding CSS rules after the base tokens, or by loading a per-page theme wrapper class that redefines CSS vars.

Theming API
- Foundation ThemeContext and ThemeProvider expose runtime theming; tokens.ts in web-foundation defines the semantic tokens (layoutTokens, colorTokens, typographyTokens, themeTokens).

Extending the theme
- Add tokens in shared-tokens.css and ensure they’re consumed by ThemeProvider in the app.

Migration notes
- If you plan to consolidate tokens into a shared npm package, ensure imports and overrides stay backwards compatible.
