# Tweak Header

Tweak Header is a Manifest V3 Chrome extension for setting and removing HTTP request headers. All configuration stays in `chrome.storage.local`; the extension has no server, analytics, or remotely hosted code.

## Development

Requirements: Node.js 20.19 or newer.

```sh
npm install
npm test
npm run build
```

Load the generated `dist` directory from `chrome://extensions` with Developer mode enabled. Clicking the toolbar icon opens the configuration page.

## Release

```sh
npm run release
```

This produces `release.zip`, with `manifest.json` at the archive root, ready to upload to the Chrome Web Store Developer Dashboard. Before submission:

1. Test set/remove behavior on HTTP and HTTPS pages using the unpacked build.
2. Update the store listing, screenshots, privacy disclosures, and permission justification.
3. Host [PRIVACY.md](PRIVACY.md) at a stable public URL if the Developer Dashboard requires a privacy-policy URL.
4. Increment both `package.json` and `public/manifest.json` for each upload.

The `<all_urls>` host permission is necessary because the extension's single purpose is to apply user-configured request headers to arbitrary HTTP(S) destinations. Manifest V3 applies these changes using `declarativeNetRequest`; the extension does not inspect request contents.

## Privacy

See [PRIVACY.md](PRIVACY.md).

## License

[MIT](LICENSE)
