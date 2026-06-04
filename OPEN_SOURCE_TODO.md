# Open Source TODO

## Issue List

- **Clean up replaced S3 images for community and group chat avatars**
  - Labels: `backend`, `storage`, `cleanup`, `good first issue`
  - When a community image or group chat image is changed, upload the new image and update the stored key.
  - After the database update succeeds, delete the old S3 object if it is an internal S3 key.
  - Do not delete empty keys, external URLs, or objects still referenced elsewhere.
  - Cover community images (`GroupLink.imageKey`) and group chat images (`Thread.imageKey`).
- **Update the website with current product information and app screenshots**
  - Labels: `website`, `documentation`, `design`, `good first issue`
  - Refresh the landing page with current product positioning.
  - Add matching app screenshots in the right sections.
- **Redesign Explore for richer local discovery**
  - Labels: `mobile`, `explore`, `discovery`, `business`, `design`
  - Make the Explore screen more comprehensive and useful beyond simple profile discovery.
  - Support local business discovery with filter options such as industry, location, and category.
  - Keep the experience consistent with communities, events, and nearby people.
- **Add admin ownership transfer for communities and group chats**
  - Labels: `backend`, `mobile`, `chat`, `community`, `admin`
  - Decide how communities and group chats can be deleted safely.
  - Handle member ownership rules before deletion or when the current admin leaves.
- **Allow admins to add members from the group chat member management screen**
  - Labels: `mobile`, `backend`, `chat`, `admin`, `enhancement`
  - The same area that allows admins to remove members should also allow adding new members.
  - Reuse the existing people search or member picker patterns where possible.
  - Make sure newly added members receive access to the thread immediately.
- **Fix navigation when opening a community chat from the live feed settings flow**
  - Labels: `mobile`, `navigation`, `chat`, `community`, `bug`
  - The settings sheet should close before navigating to chat.
  - Returning from the chat should not require multiple back actions before the tab bar is visible again.
- **Improve the chat creation menu from the chat list plus icon**
  - Labels: `mobile`, `chat`, `ui`, `design`, `enhancement`
  - The plus icon currently opens a default system-style action sheet.
  - Replace it with a more elegant in-app composer/menu that matches the chat UI.
  - Include options for creating a group chat, creating a community, and viewing communities.
- **Fix chat list ordering for newly created group and community chats**
  - Labels: `mobile`, `chat`, `sorting`, `bug`
  - New chats currently appear too low in the list.
  - Newly created or recently opened chats should be ranked near the top even before the first message is sent.
- **Audit long names in chats and live feeds**
  - Labels: `mobile`, `ui`, `accessibility`, `polish`
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
