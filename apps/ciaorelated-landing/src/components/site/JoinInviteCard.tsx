import { useEffect, useState } from "react";
import { Copy, Download, Smartphone, Check } from "lucide-react";
import { CTAButton, CTALink } from "./CTAButton";
import { useI18n } from "@/lib/i18n";

/**
 * JoinInviteCard
 *
 * Invite / deep-link landing card.
 * Final deep-link routing logic (AppsFlyer, App Store fallback, custom scheme
 * attempts, /.well-known/apple-app-site-association) is intentionally NOT
 * implemented here. See: /public/deep-link.js (loaded by /join page) for the
 * placeholder script slot where the production logic can be wired in later.
 *
 * Required element IDs (do not rename):
 *   - statusText, slugText, openApp, copyBtn, appStoreBtn
 */
export function JoinInviteCard({ slug }: { slug: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://ciaorelated.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const link = slug ? `${origin}/join?slug=${slug}` : `${origin}/join`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="glass-card mx-auto w-full max-w-lg rounded-3xl p-8 text-center">
      <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-hero text-primary-foreground">
        <Smartphone className="h-6 w-6" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">{t.join.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t.join.sub}</p>

      <p id="statusText" className="mt-6 text-sm font-medium text-primary">
        {t.join.status}
      </p>

      <div className="mt-6 rounded-xl border border-border bg-background/60 px-4 py-3 text-left">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {t.join.slugLabel}
        </div>
        <div
          id="slugText"
          className="mt-1 truncate font-mono text-sm text-foreground"
        >
          {slug || "—"}
        </div>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <CTALink id="openApp" href={`#open-app`} variant="primary" data-slug={slug}>
          <Smartphone className="h-4 w-4" />
          {t.join.openApp}
        </CTALink>
        <CTALink id="appStoreBtn" href="/kampagne.html" variant="secondary">
          <Download className="h-4 w-4" />
          {t.join.download}
        </CTALink>
      </div>

      <CTAButton
        id="copyBtn"
        onClick={handleCopy}
        variant="ghost"
        className="mt-3 w-full border border-border"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? t.join.copied : t.join.copy}
      </CTAButton>

      <p className="mt-6 text-xs text-muted-foreground">{t.join.help}</p>
    </div>
  );
}
