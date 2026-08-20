# Change Log

All notable changes to the "Hello Bible" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [1.0.0] - 2026-08-20

### Added

- Daily verse displayed in a collapsible "Hello Bible" section in the Explorer, resolved once per calendar day based on the user's own local timezone.
- Verse text fetched live from the free, public [bible-api.com](https://bible-api.com) API, in Portuguese (João Ferreira de Almeida translation), from a curated pool of around 50 encouraging references spanning both testaments.
- One-click favoriting and unfavoriting of the current verse.
- Dedicated favorites panel in the Activity Bar, listing every favorited verse with its reference, full text, favorited date, and a one-click remove action, with a friendly empty state for first-time use.
- Accent color picker, with 8 curated colors plus a theme-following default, applied live across both the daily verse and favorites screens.
- `Bible: Show Verse` Command Palette command, showing today's verse as a native notification.
- Loading and error states, with retry, for the daily verse card when the Bible API is unreachable.
- Extension icon for the VS Code Marketplace.

[unreleased]: https://github.com/arturbomtempo-dev/hello-bible/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/arturbomtempo-dev/hello-bible/releases/tag/v1.0.0
