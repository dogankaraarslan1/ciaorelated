# Open Source TODO

## Issue List

- Clean up replaced S3 images for community and group chat avatars.
  - When a community image or group chat image is changed, upload the new image and update the stored key.
  - After the database update succeeds, delete the old S3 object if it is an internal S3 key.
  - Do not delete empty keys, external URLs, or objects still referenced elsewhere.
  - Cover community images (`GroupLink.imageKey`) and group chat images (`Thread.imageKey`).
- Update the website with current product information and matching app screenshots.
- Add admin ownership transfer for communities and group chats.
  - Decide how communities and group chats can be deleted safely.
  - Handle member ownership rules before deletion or when the current admin leaves.
- Fix navigation when opening a community chat from the live feed settings flow.
  - The settings sheet should close before navigating to chat.
  - Returning from the chat should not require multiple back actions before the tab bar is visible again.
- Audit long names in chats and live feeds.
  - Long community, group, profile, and chat names should truncate cleanly with an ellipsis where space is limited.

## i18n cleanup

- Scan mobile code for hardcoded German and English UI strings.
- Move user-facing strings into locale files.
- Keep developer logs, GraphQL operation names, and internal constants out of i18n unless they are displayed.
- Re-check auth, onboarding, settings, community, chat, post creation, and empty states first.

## Web

- Reintroduce a clean web app later.
- Keep it focused on landing, legal pages, and deep-link join pages.
- Avoid carrying over old product-specific routes.
