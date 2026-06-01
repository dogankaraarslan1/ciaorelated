// apps/ciaorelated/src/screens/create/post/utils/media.ts

import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";


/** Sekunden aus (ms|s|undef) normalisieren. */
export function toSeconds(d?: number | null): number | null {
  if (d == null || Number.isNaN(d)) return null;
  // Manche APIs liefern ms, andere s – wir normalisieren.
  return d > 1000 ? Math.round(d / 1000) : Math.round(d);
}

/** mm:ss Formatierung (z. B. für Video-Dauer-Badges). */
export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.max(0, sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Liefert einen abspielbaren Pfad:
 * - iOS: bevorzugt localUri von MediaLibrary, sonst ursprüngliche uri
 * - Android: konvertiert file:// zu content://, wenn möglich (stabiler für Video)
 */
export async function resolvePlayableUri(assetId: string, fallbackUri: string): Promise<string> {
  try {
    const info = await MediaLibrary.getAssetInfoAsync(assetId);
    
    if (info?.localUri) return info.localUri as string;
  } catch {
    // Ignorieren, wir versuchen den Fallback/Android-Workaround
  }

  if (Platform.OS === "android" && fallbackUri.startsWith("file://")) {
    try {
      const contentUri = await FileSystem.getContentUriAsync(fallbackUri);
      if (contentUri) return contentUri;
    } catch {
      // Fallback auf file://
    }
  }

  return fallbackUri;
}

/**
 * Ermittelt sicher die Dateigröße einer URI.
 * 1) expo-file-system getInfoAsync (wenn exists:true & !isDirectory)
 * 2) Fallback: fetch -> blob.size (für content:// u. ä.)
 */
export async function getSize(uri: string): Promise<number | null> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists && !info.isDirectory) {
      // size ist nur im exists:true-Zweig vorhanden
      const s = (info as any).size as number | undefined;
      if (typeof s === "number" && s > 0) return s;
    }
  } catch {
    // weiter zum Fallback
  }

  try {
    const resp = await fetch(uri);
    const blob = await resp.blob();
    if (typeof blob.size === "number" && blob.size > 0) return blob.size;
  } catch {
    // ignorieren
  }

  return null;
}

/** Kleiner Helper: formatiert eine evtl. unbekannte Dauer sicher für Anzeige. */
export function safeDurationLabel(d?: number | null): string {
  const s = toSeconds(d);
  return s == null ? "–:–" : formatDuration(s);
}

export const isPHUri = (u?: string | null) => !!u && u.startsWith("ph://");
export const looksLikeHeic = (u: string) =>
  /\.hei[cf]$/i.test(u) || /[?&]ext=hei[cf]\b/i.test(u); // iOS URIs haben oft ?ext=HEIC
const JPEG_FORMAT: any = (ImageManipulator as any)?.SaveFormat?.JPEG ?? "jpeg";


/**
 * Falls die Quelle HEIC/HEIF ist → in JPEG konvertieren.
 * Gibt immer eine URI zurück, die mit .jpg endet.
 */
export async function ensureJpegUri(uri: string): Promise<string> {
  try {
    if (uri.toLowerCase().endsWith(".heic") || uri.toLowerCase().endsWith(".heif")) {
      const out = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 0.95, format: JPEG_FORMAT }
      );
      return out.uri;
    }
  } catch (e) {
    console.warn("[ensureJpegUri] fallback", e);
  }
  return uri;
}



export async function ensureUploadableImage(uri: string): Promise<{ uri: string; mime: string }> {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".heic") || lower.endsWith(".heif") || lower.endsWith(".webp") || lower.endsWith(".png")) {
    try {
      const out = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 0.95, format: JPEG_FORMAT }
      );
      return { uri: out.uri, mime: "image/jpeg" };
    } catch (e) {
      console.warn("[ensureUploadableImage] convert failed", e);
      return { uri, mime: "image/jpeg" };
    }
  }
  return { uri, mime: "image/jpeg" }; // JPEG ist Standard
}
