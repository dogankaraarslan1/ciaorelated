// apps/ciaorelated/src/lib/appUpdate.ts
import { Alert, Platform, Linking } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "../i18n";

type UpdateOptions = {
  force?: boolean;
};

export type AppUpdateInfo = {
  currentVersion: string;
  storeVersion: string;
  storeUrl: string;
};

const LAST_PROMPTED_KEY = "app_update:last_prompted_store_version";

/* ---------- Version helpers ---------- */

function normalizeVersion(v: string): number[] {
  return v
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((n) => Number(n))
    .map((n) => (Number.isFinite(n) ? n : 0));
}

function compareVersions(a: string, b: string): number {
  const av = normalizeVersion(a);
  const bv = normalizeVersion(b);
  const len = Math.max(av.length, bv.length);

  for (let i = 0; i < len; i++) {
    const x = av[i] ?? 0;
    const y = bv[i] ?? 0;
    if (x < y) return -1;
    if (x > y) return 1;
  }
  return 0;
}

/* ---------- App Store lookup ---------- */

function getPreferredCountry(): string {
  // expo-localization v17+ → getLocales()
  const region =
    Localization.getLocales?.()?.[0]?.regionCode ??
    Localization.getLocales?.()?.[0]?.languageTag?.split("-")?.[1];

  return typeof region === "string" ? region.toUpperCase() : "US";
}

async function fetchIosAppStoreInfo(appId: string): Promise<{
  storeVersion: string | null;
  storeUrl: string | null;
}> {
  const primaryCountry = getPreferredCountry();

  // robuste Fallback-Reihenfolge
  const countries = Array.from(
    new Set([primaryCountry, "AT", "DE", "US"])
  );

  for (const country of countries) {
    try {
      const url = `https://itunes.apple.com/lookup?id=${encodeURIComponent(
        appId
      )}&country=${country}`;

      const res = await fetch(url);
      const json = await res.json();
      const first = json?.results?.[0];

      if (first?.version && first?.trackViewUrl) {
        return {
          storeVersion: String(first.version),
          storeUrl: String(first.trackViewUrl),
        };
      }
    } catch {
      // try next country
    }
  }

  return { storeVersion: null, storeUrl: null };
}

/* ---------- Public API ---------- */

export async function checkAndPromptForUpdateIos(
  appId: string,
  options: UpdateOptions = {}
): Promise<void> {
  const info = await getRequiredIosUpdateInfo(appId);
  if (!info) return;

  const lastPrompted = await AsyncStorage.getItem(LAST_PROMPTED_KEY);
  if (!options.force && lastPrompted === info.storeVersion) return;

  await AsyncStorage.setItem(LAST_PROMPTED_KEY, info.storeVersion);

  const force = !!options.force;

  Alert.alert(
    i18n.t("appUpdate.availableTitle"),
    i18n.t("appUpdate.availableBody", { version: info.storeVersion }),
    force
      ? [
          {
            text: i18n.t("appUpdate.updateNow"),
            onPress: () => Linking.openURL(info.storeUrl),
          },
        ]
      : [
          { text: i18n.t("appUpdate.later"), style: "cancel" },
          {
            text: i18n.t("appUpdate.updateNow"),
            onPress: () => Linking.openURL(info.storeUrl),
          },
        ],
    { cancelable: !force }
  );
}

export async function getRequiredIosUpdateInfo(appId: string): Promise<AppUpdateInfo | null> {
  if (Platform.OS !== "ios") return null;
  if (!appId.trim()) return null;

  const { storeVersion, storeUrl } = await fetchIosAppStoreInfo(appId);
  if (!storeVersion || !storeUrl) return null;

  const currentVersion =
    Constants.nativeApplicationVersion ||
    (Constants.expoConfig?.version as string | undefined) ||
    "0.0.0";

  if (compareVersions(storeVersion, currentVersion) <= 0) return null;

  return {
    currentVersion,
    storeVersion,
    storeUrl,
  };
}

export function openAppStoreUpdate(info: Pick<AppUpdateInfo, "storeUrl">) {
  return Linking.openURL(info.storeUrl);
}
