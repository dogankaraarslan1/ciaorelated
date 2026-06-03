import { useEffect, useMemo, useState, type ReactNode } from "react";
import { I18nContext, translations, type Lang } from "@/lib/i18n";
import { ThemeContext, type Theme } from "@/lib/theme";

export function AppProviders({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = (typeof window !== "undefined" && localStorage.getItem("cr-theme")) as Theme | null;
    const storedLang = (typeof window !== "undefined" && localStorage.getItem("cr-lang")) as Lang | null;
    const systemDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: Theme = storedTheme ?? (systemDark ? "dark" : "light");
    const browserLang = typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("de") ? "de" : "en";
    const initialLang: Lang = storedLang ?? browserLang;
    setThemeState(initialTheme);
    setLangState(initialLang);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("cr-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    localStorage.setItem("cr-lang", lang);
  }, [lang, mounted]);

  const themeValue = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
      toggle: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  const i18nValue = useMemo(
    () => ({ lang, setLang: setLangState, t: translations[lang] }),
    [lang],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <I18nContext.Provider value={i18nValue}>{children}</I18nContext.Provider>
    </ThemeContext.Provider>
  );
}