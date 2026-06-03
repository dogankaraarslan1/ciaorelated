# ciaorelated Landing

Static landing and deep-link website for `ciaorelated`.

## Routes

- `/`
- `/join?slug=abc123`
- `/support.html`
- `/privacy.html`
- `/privacy-de.html`
- `/datenschutz.html`
- `/terms.html`
- `/terms-de.html`
- `/guidelines.html`
- `/guidelines-de.html`
- `/kampagne.html`

## Development

```bash
pnpm --dir apps/ciaorelated-landing dev
```

## Build

```bash
pnpm --dir apps/ciaorelated-landing build
```

Static output:

```txt
apps/ciaorelated-landing/.output/public
```

## Deep Links

The mobile app currently generates invite links in this form:

```txt
/join?slug=abc123
```

The join page keeps query parameters intact and exposes these DOM IDs for the production deep-link script:

- `statusText`
- `slugText`
- `openApp`
- `copyBtn`
- `appStoreBtn`

Production deep-link logic belongs in `public/deep-link.js`.

Universal Links can be added later in `public/.well-known/apple-app-site-association` once the real iOS team ID and bundle ID are known.
