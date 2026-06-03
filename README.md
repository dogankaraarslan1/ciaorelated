# ciaorelated

Open-source Instagram-style social media app for groups, events, local communities, and shared moments.

`ciaorelated` is a full-stack social media starter built with React Native, Expo, Node.js, GraphQL, Prisma, and PostgreSQL. It combines familiar social app patterns like feeds, profiles, posts, stories/moments, follows, likes, comments, and chat with a stronger focus on real-world communities, group links, local discovery, and event-based social interaction.

> Goal: build a social media app that helps people connect through real groups, real events, and real moments.

## Screenshots

| Feed | Create |
| --- | --- |
| <img src="./docs/screenshots/feed.PNG" alt="ciaorelated feed screen" width="280" /> | <img src="./docs/screenshots/create.PNG" alt="ciaorelated create screen" width="280" /> |

| Profile | Activity |
| --- | --- |
| <img src="./docs/screenshots/profile.PNG" alt="ciaorelated profile screen" width="280" /> | <img src="./docs/screenshots/activity.PNG" alt="ciaorelated activity screen" width="280" /> |

## Features

- Instagram-style home feed
- User profiles with avatars, bio, grid, posts, reels/moments, and counters
- Image and video posts
- Stories / moments style content
- Likes, comments, tagged users, and post detail views
- Follow and private profile flows
- Group/community links with invite and join flow
- QR/share-oriented group invite patterns
- Chat and messaging foundation
- Explore/search screen for discovering people and content
- Context-based discovery foundations
- Local city/profile onboarding
- Phone login and registration with SMS verification support
- Email login, email verification, and password reset support
- Push notification registration foundation
- Media uploads through S3-compatible object storage
- Prisma/PostgreSQL backend
- GraphQL API with Apollo Server
- React Native / Expo mobile app
- Light/dark theming foundations
- i18n foundation with German and English strings

## Why This Exists

Most social apps are optimized for endless global feeds. `ciaorelated` is being shaped around a different idea:

- real groups
- local communities
- families and friends
- events and venues
- people nearby
- shared moments that have context

The project can be used as a learning resource, a social media app starter, or a foundation for building an event/community-oriented social network.

## Tech Stack

### Mobile App

- React Native
- Expo
- TypeScript
- Apollo Client
- React Navigation
- Expo Image / Media / Notifications
- i18next

### Backend

- Node.js
- TypeScript
- Apollo Server
- GraphQL
- Prisma
- PostgreSQL
- JWT authentication
- SendGrid-compatible email integration
- Twilio Verify-compatible phone verification
- S3-compatible media storage

### Monorepo

- pnpm workspace
- `apps/ciaorelated` mobile app
- `apps/ciaorelated-landing` static landing/deep-link website
- `apps/server` GraphQL backend
- `packages/shared` shared package placeholder/foundation

## Project Structure

```txt
.
├── apps
│   ├── ciaorelated        # React Native / Expo mobile app
│   ├── ciaorelated-landing # Static landing/deep-link website
│   └── server             # Node.js GraphQL API
├── packages
│   └── shared             # Shared package workspace
├── .github
│   └── workflows          # Optional deploy workflow
├── pnpm-workspace.yaml
└── README.md
```

## Getting Started

### Requirements

- Node.js 22.x for the workspace/backend
- pnpm 10.x
- PostgreSQL
- Expo tooling
- iOS Simulator, Android Emulator, Expo Go, or an Expo development build

Recommended:

```bash
node -v
pnpm -v
```

Install dependencies:

```bash
pnpm install
```

## Environment Variables

This project intentionally does not commit real `.env` files.

Copy the examples:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/ciaorelated/.env.example apps/ciaorelated/.env
```

### Server Env

`apps/server/.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ciaorelated?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
HOST="0.0.0.0"
PORT="4000"
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
CLIENT_ORIGIN="http://localhost:3000"
CURRENT_TERMS_VERSION="1"
NOMINATIM_EMAIL=""

SENDGRID_API_KEY=""
EMAIL_FROM="ciaorelated <noreply@example.com>"

SMS_PROVIDER="console"
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_VERIFY_SERVICE_SID=""

S3_BUCKET=""
S3_REGION="eu-north-1"
S3_ENDPOINT=""
S3_FORCE_PATH_STYLE="false"
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_PUBLIC_BASE=""
SIGNED_URL_TTL_SECONDS="900"

AWS_REGION="eu-north-1"
AWS_S3_BUCKET=""

MAX_AVATAR_BYTES="5242880"
MAX_UPLOAD_BYTES="104857600"
MAX_POST_IMAGE_BYTES="10485760"
MAX_POST_VIDEO_BYTES="104857600"
MAX_STORY_UPLOAD_BYTES="83886080"

ENABLE_VIDEO_WORKER="false"
ENABLE_IMAGE_WORKER="false"
ENABLE_STORY_WORKER="false"
ENABLE_AVATAR_WORKER="false"
ENABLE_VLOG_COVER_WORKER="false"
ENABLE_DAILY_DIGEST="false"

TMPDIR=""
FFMPEG_PATH="/usr/local/bin/ffmpeg"
FFPROBE_PATH="/usr/local/bin/ffprobe"
```

Phone login works in development without Twilio by logging verification codes to the server console. To send real SMS messages, configure Twilio Verify.

Server variables at a glance:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `JWT_SECRET` | Yes | Secret used to sign authentication tokens. Use a long random value in production. |
| `HOST` | No | Bind host for the HTTP server. Defaults to `0.0.0.0`. |
| `PORT` | No | API port. Defaults to `4000`. |
| `CORS_ORIGINS` | Recommended | Comma-separated list of allowed web origins. Localhost and LAN origins are allowed by default patterns. |
| `CLIENT_ORIGIN` | Optional | Legacy/client origin value for deployments that expect it. |
| `CURRENT_TERMS_VERSION` | Optional | Current terms version shown by the terms gate. Defaults to `1`. |
| `NOMINATIM_EMAIL` | Recommended | Contact email for Nominatim/OpenStreetMap geocoding requests. |
| `SENDGRID_API_KEY` | Optional | Enables email verification/password reset emails. |
| `EMAIL_FROM` | Optional | From address for outgoing emails. |
| `SMS_PROVIDER` | Optional | Set to `console` for local code logging. |
| `TWILIO_ACCOUNT_SID` | Optional | Required for real SMS via Twilio Verify. |
| `TWILIO_AUTH_TOKEN` | Optional | Required for real SMS via Twilio Verify. |
| `TWILIO_VERIFY_SERVICE_SID` | Optional | Required for real SMS via Twilio Verify. |
| `S3_BUCKET` | Required for uploads | Bucket/container name for media storage. |
| `S3_REGION` | Required for uploads | S3-compatible storage region. |
| `S3_ENDPOINT` | Required for non-AWS S3 | Endpoint for providers like DigitalOcean Spaces, Cloudflare R2, or MinIO. |
| `S3_FORCE_PATH_STYLE` | Provider-dependent | Use `true` for MinIO/some S3-compatible providers. |
| `S3_ACCESS_KEY_ID` | Required for uploads | Access key for object storage. |
| `S3_SECRET_ACCESS_KEY` | Required for uploads | Secret key for object storage. |
| `S3_PUBLIC_BASE` | Recommended | Public base URL for uploaded chat/media files. |
| `SIGNED_URL_TTL_SECONDS` | Optional | Expiration time for signed upload URLs. |
| `AWS_REGION` | Compatibility | Legacy AWS-style region used by some helpers. |
| `AWS_S3_BUCKET` | Compatibility | Legacy AWS-style bucket used by some helpers. |
| `MAX_*_BYTES` | Optional | Upload size limits. |
| `ENABLE_*_WORKER` | Optional | Enables background workers for thumbnails, video, digest jobs. |
| `TMPDIR` | Optional | Temporary directory for workers. |
| `FFMPEG_PATH` / `FFPROBE_PATH` | Optional | Paths used by the video worker. |

### Mobile Env

`apps/ciaorelated/.env`

```env
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:4000/graphql
EXPO_PUBLIC_WEBSITE_URL=https://your-domain.example
EXPO_PUBLIC_ONELINK_URL=
EXPO_PUBLIC_APP_SCHEME=ciaorelated
EXPO_PUBLIC_ASSOCIATED_DOMAINS=
EXPO_PUBLIC_IOS_APP_STORE_ID=
EXPO_PUBLIC_APPSFLYER_DEV_KEY=
EXPO_PUBLIC_APPSFLYER_ENABLED=false
EXPO_OWNER=
EXPO_IOS_BUNDLE_IDENTIFIER=com.example.ciaorelated
EXPO_ANDROID_PACKAGE=com.example.ciaorelated
EAS_PROJECT_ID=
```

For a real phone on the same Wi-Fi, use your computer's LAN IP, not `localhost`.

Example:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.50:4000/graphql
```

For iOS Simulator, `localhost` may work. For a physical device, `localhost` points to the device itself.

Mobile variables at a glance:

| Variable | Required | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | Yes | GraphQL API URL used by the mobile app. |
| `EXPO_PUBLIC_WEBSITE_URL` | Recommended | Public website base URL used for invite links, legal pages, and Universal Link prefixes. |
| `EXPO_PUBLIC_ONELINK_URL` | Optional | AppsFlyer OneLink base URL accepted as a trusted incoming link source. |
| `EXPO_PUBLIC_APP_SCHEME` | Optional | Custom app URL scheme. Defaults to `ciaorelated`. |
| `EXPO_PUBLIC_ASSOCIATED_DOMAINS` | Optional | Comma-separated Universal Link domains, e.g. `example.com,www.example.com`. |
| `EXPO_PUBLIC_IOS_APP_STORE_ID` | Optional | iOS App Store ID used by update/deep-link helpers. |
| `EXPO_PUBLIC_APPSFLYER_DEV_KEY` | Optional | AppsFlyer key if you use AppsFlyer deep links. |
| `EXPO_PUBLIC_APPSFLYER_ENABLED` | Optional | Set to `true` only in builds where AppsFlyer should initialize. Defaults to `false`. |
| `EXPO_OWNER` | Optional | Expo account/organization owner. |
| `EXPO_IOS_BUNDLE_IDENTIFIER` | Recommended for builds | iOS bundle identifier. |
| `EXPO_ANDROID_PACKAGE` | Recommended for builds | Android package name. |
| `EAS_PROJECT_ID` | Optional | Needed for Expo push tokens and EAS-linked builds. Forks should create their own via EAS. |

## Where To Get Provider Values

### PostgreSQL

For local development, install PostgreSQL and create a database:

```bash
createdb ciaorelated
```

Then set:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/ciaorelated?schema=public"
```

For production, use a managed PostgreSQL database from your host or a provider such as DigitalOcean, Neon, Supabase, Railway, Render, or AWS RDS.

### Twilio Verify

Twilio is only needed for real SMS codes. Local development can use `SMS_PROVIDER="console"`.

To send real SMS:

1. Create a Twilio account.
2. Create a Verify Service.
3. Copy:
   - Account SID to `TWILIO_ACCOUNT_SID`
   - Auth Token to `TWILIO_AUTH_TOKEN`
   - Verify Service SID to `TWILIO_VERIFY_SERVICE_SID`

### SendGrid

SendGrid is used for email verification and password reset emails.

1. Create a SendGrid API key.
2. Verify a sender/domain.
3. Set:
   - `SENDGRID_API_KEY`
   - `EMAIL_FROM`

### S3-Compatible Storage

Media uploads require S3-compatible object storage.

Common providers:

- AWS S3
- DigitalOcean Spaces
- Cloudflare R2
- MinIO

Set the bucket, region, endpoint, access key, secret key, and public base URL in the `S3_*` variables.

### Expo / EAS

Push notifications and EAS builds need an Expo/EAS project.

Create one with:

```bash
eas init
```

Then set the generated project ID:

```env
EAS_PROJECT_ID=your-eas-project-id
```

Forks should use their own EAS project ID, not one from another deployment.

## Database Setup

Create a PostgreSQL database:

```bash
createdb ciaorelated
```

Then apply Prisma migrations:

```bash
pnpm --dir apps/server exec prisma migrate deploy
```

`migrate deploy` is non-interactive and applies the committed migrations. This is the recommended setup command for a fresh clone.

If you are actively developing Prisma schema changes and want Prisma to create a new migration, use:

```bash
pnpm --dir apps/server exec prisma migrate dev
```

Generate Prisma Client:

```bash
pnpm --dir apps/server exec prisma generate
```

## Run The Backend

```bash
pnpm --dir apps/server dev
```

The GraphQL API runs by default at:

```txt
http://localhost:4000/graphql
```

For a physical phone, the app should point to:

```txt
http://YOUR_LAN_IP:4000/graphql
```

## Run The Mobile App

For iOS Simulator or Android Emulator on the same machine:

```bash
pnpm --dir apps/ciaorelated start:local
```

For a physical phone on the same Wi-Fi:

```bash
pnpm --dir apps/ciaorelated start:device
```

Or, from the app folder:

```bash
cd apps/ciaorelated
npx expo start -c
```

If you are testing on a physical phone, make sure `EXPO_PUBLIC_API_URL` uses your LAN IP.

If the app logs `Network request failed`, verify that the backend is running and that `EXPO_PUBLIC_API_URL` points to a reachable GraphQL endpoint:

```bash
curl -H "content-type: application/json" \
  --data '{"query":"query { __typename }"}' \
  http://YOUR_LAN_IP:4000/graphql
```

## Phone Auth

The app supports phone login/registration with verification codes.

Development behavior:

- If Twilio env vars are missing, codes are printed in the server console.
- If Twilio env vars are set, the server uses Twilio Verify.

Required Twilio variables:

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=
```

## Email Auth

Email-related flows can use SendGrid-compatible configuration:

```env
SENDGRID_API_KEY=
EMAIL_FROM=
```

In local development, if SendGrid is not configured or the key is invalid, verification and password reset codes are printed to the server console.

Expected development log format:

```txt
[email][DEV] VERIFY CODE to user@example.com code: 123456
```

## Media Uploads

The backend is designed for S3-compatible object storage.

Typical variables:

```env
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_BASE=
```

Use a provider such as AWS S3, DigitalOcean Spaces, Cloudflare R2, MinIO, or another S3-compatible storage service.

## Development Checks

Useful checks after installation:

```bash
pnpm --filter "{./apps/server}" build
```

The backend build should pass after dependencies and environment variables are configured.

The mobile TypeScript check is still being cleaned up for open-source contributor workflows. Known current issues include a missing `react-native-fs` type/module reference and a small set of existing React Native style/type mismatches.

## App Store Review Notes

A reusable App Store review notes template is available at:

[`docs/app-store-review-notes.md`](./docs/app-store-review-notes.md)

It documents user-generated content moderation, reporting/blocking flows, privacy permissions, account deletion, and reviewer test account placeholders.

## Deployment

This repository includes an example GitHub Actions deploy workflow in:

```txt
.github/workflows/deploy.yml
```

It expects these GitHub repository secrets:

```txt
SERVER_SSH_KEY
SERVER_USER
SERVER_HOST
SERVER_PATH
```

The target server should already have:

- Node.js / pnpm support
- PM2 or access to `npx pm2`
- a production `.env` or `.env.production`
- a reachable PostgreSQL database
- required production env vars

The workflow is intended as a starting point. Forks should adapt it to their own hosting setup.

## Open Source Notes

This repository is intentionally neutral:

- no committed production `.env`
- no committed local database
- no committed `node_modules`
- no hardcoded EAS project ID
- no hardcoded production secrets
- no hardcoded production website domain

Each fork should configure its own:

- app identifiers
- EAS project
- push notification setup
- backend URL
- database
- SMS provider
- email provider
- object storage provider

## Roadmap Ideas

- stronger event/community feeds
- organization and venue profiles
- better local discovery filters
- event-based people discovery
- improved group chat/community relationship
- richer moderation tools
- contact discovery with privacy-preserving matching
- production-ready screenshot and demo data
- web landing page and deep-link pages
- production Universal Links / App Links configuration

## Keywords

React Native social media app, Expo social app, Instagram clone, Instagram-style app, GraphQL social network, Prisma PostgreSQL app, group chat app, event community app, local discovery app, open-source social network, mobile social media starter, full-stack React Native app.

## Follow

Follow the project on social media:

- Instagram: [@ciaorelated](https://instagram.com/ciaorelated)
- TikTok: [@ciaorelated](https://www.tiktok.com/@ciaorelated)
- LinkedIn: [ciaorelated](https://www.linkedin.com/company/ciaorelated)

## License

MIT
