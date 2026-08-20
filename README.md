# Hello Bible

A minimal Visual Studio Code extension that brings a Bible verse into your editor, one command away.

Hello Bible was built as a hands-on study of the VS Code Extension API, covering command registration, the extension activation lifecycle, and the notification UI, while producing something small, pleasant, and genuinely usable in a daily coding routine.

## Features

- **Show a verse on demand.** Run the `Bible: Show Verse` command from the Command Palette and the verse is displayed in an information notification, without leaving your current file.
- **Zero friction.** No configuration, no account required. The verse text is fetched live from a free, public Bible API — no API key needed.
- **Stays out of your way.** The extension contributes a single command and does nothing until you invoke it.

### Usage

1. Open the Command Palette with `Ctrl+Shift+P` (Windows and Linux) or `Cmd+Shift+P` (macOS).
2. Type **Bible: Show Verse** and press `Enter`.
3. The verse appears as a notification in the lower-right corner of the window.

The current release ships with a single verse, John 3:16, in Brazilian Portuguese.

## Requirements

An internet connection, to fetch the verse text from [bible-api.com](https://bible-api.com) (free, public, no API key). Otherwise, Hello Bible has no runtime dependencies and requires only Visual Studio Code version 1.125.0 or later.

## Extension Settings

This extension does not contribute any settings yet. Configuration options such as choosing a translation or enabling a verse at startup are planned for a future release.

## Known Issues

- The verse is currently hardcoded, so every invocation shows the same passage.
- Only one translation and language (Brazilian Portuguese) is available.
- Long verses may be truncated by the VS Code notification area, which is expected behavior for information messages.

If you run into something else, please open an issue.

## Roadmap

- A rotating or random verse per invocation.
- A daily verse shown automatically on startup, behind an opt-in setting.
- Support for multiple translations and languages.
- Insert the selected verse directly into the active editor.

## Release Notes

### 0.0.1

- Initial release.
- Adds the `Bible: Show Verse` command, which displays John 3:16 in an information notification.

---

## Contributing

Contributions are welcome. To run the extension locally:

```bash
npm install
npm run compile
```

Then press `F5` in VS Code to launch an Extension Development Host with Hello Bible loaded.

Useful scripts:

- `npm run watch`: recompile on every change.
- `npm run lint`: run ESLint over `src`.
- `npm run format`: format the project with Prettier.
- `npm test`: run the extension test suite.

## Following extension guidelines

This extension follows the official Visual Studio Code extension guidelines.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

**Enjoy!**
