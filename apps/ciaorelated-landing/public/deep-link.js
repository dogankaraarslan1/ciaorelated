/*
 * deep-link.js
 *
 * Production invite handoff for static /join pages.
 * Supports:
 *   - /join?slug=GROUP_SLUG
 *   - /join/GROUP_SLUG
 *   - AppsFlyer-style ?deep_link_sub1=GROUP_SLUG
 *   - Custom scheme fallback: ciaorelated://join/GROUP_SLUG
 */
(function () {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  var statusText = document.getElementById("statusText");
  var slugText = document.getElementById("slugText");
  var openApp = document.getElementById("openApp");
  var storeBtn = document.getElementById("appStoreBtn");

  function first(value) {
    return value ? String(value).trim() : "";
  }

  function detectPlatform() {
    var ua = navigator.userAgent || "";
    if (/android/i.test(ua)) return "android";
    if (/iphone|ipad|ipod/i.test(ua)) return "ios";
    return "desktop";
  }

  function slugFromLocation() {
    var params = new URLSearchParams(window.location.search);
    var querySlug =
      first(params.get("slug")) ||
      first(params.get("deep_link_sub1")) ||
      first(params.get("af_sub1")) ||
      first(params.get("sub1"));

    if (querySlug) return querySlug;

    var parts = window.location.pathname.split("/").filter(Boolean);
    var joinIndex = parts.indexOf("join");
    if (joinIndex >= 0 && parts[joinIndex + 1]) return decodeURIComponent(parts[joinIndex + 1]);

    return "";
  }

  function buildSchemeUrl(scheme, slug) {
    if (!slug) return scheme + "://";
    return scheme + "://join/" + encodeURIComponent(slug);
  }

  function appendInviteParams(baseUrl, slug) {
    if (!baseUrl || !slug) return baseUrl || "";
    try {
      var url = new URL(baseUrl, window.location.origin);
      if (!url.searchParams.get("deep_link_value")) url.searchParams.set("deep_link_value", "join");
      if (!url.searchParams.get("deep_link_sub1")) url.searchParams.set("deep_link_sub1", slug);
      return url.toString();
    } catch {
      return baseUrl;
    }
  }

  function chooseStoreUrl(platform) {
    var iosStore = openApp?.dataset?.iosStoreUrl || "";
    var androidStore = openApp?.dataset?.androidStoreUrl || "";
    if (platform === "ios" && iosStore) return iosStore;
    if (platform === "android" && androidStore) return androidStore;
    return iosStore || androidStore || "/kampagne.html";
  }

  var platform = detectPlatform();
  var slug = slugFromLocation() || openApp?.dataset?.slug || "";
  var appScheme = openApp?.dataset?.appScheme || "ciaorelated";
  var oneLinkUrl = appendInviteParams(openApp?.dataset?.onelinkUrl || "", slug);
  var appUrl = oneLinkUrl || buildSchemeUrl(appScheme, slug);
  var storeUrl = chooseStoreUrl(platform);

  if (slugText && slug) slugText.textContent = slug;
  if (openApp) openApp.setAttribute("href", appUrl);
  if (storeBtn) storeBtn.setAttribute("href", storeUrl);
  if (statusText) {
    statusText.textContent = slug ? "Invitation ready" : "Invitation link is missing a code";
  }

  if (!openApp) return;

  openApp.addEventListener("click", function (event) {
    if (!slug) return;
    if (platform === "desktop") return;

    event.preventDefault();
    var openedAt = Date.now();
    window.location.href = appUrl;

    window.setTimeout(function () {
      if (document.hidden) return;
      if (Date.now() - openedAt < 900) return;
      window.location.href = storeUrl;
    }, 1300);
  });
})();
