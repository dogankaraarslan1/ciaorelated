/*
 * deep-link.js — placeholder
 *
 * This file is intentionally a no-op placeholder. The production deep-link
 * logic (AppsFlyer OneLink, custom URL scheme attempts, Universal Links,
 * App Store / Play Store fallback, slug validation against a backend) will
 * be wired in here manually after the static site is deployed.
 *
 * Required DOM contract (do NOT rename in the React markup):
 *   - #statusText    -> text element used to surface the current status
 *   - #slugText      -> element that displays the invitation slug
 *   - #openApp       -> primary "open in app" CTA link
 *   - #copyBtn       -> "copy link" button
 *   - #appStoreBtn   -> store / download CTA link
 *
 * Related TODO:
 *   - Add /.well-known/apple-app-site-association once the real
 *     iOS App ID / team prefix is known. Do NOT commit dummy app IDs.
 */
(function () {
  if (typeof window === "undefined") return;
  // No-op. Real deep-link script will replace the body of this IIFE.
})();