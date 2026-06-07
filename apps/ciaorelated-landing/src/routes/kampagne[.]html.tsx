import { createFileRoute } from "@tanstack/react-router";
import { Apple, Smartphone, QrCode } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { CTALink } from "@/components/site/CTAButton";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/kampagne.html")({
  head: () => ({
    meta: [
      { title: "Get ciaorelated — Download" },
      { name: "description", content: "Download the ciaorelated app." },
    ],
  }),
  component: CampaignPage,
});

function CampaignPage() {
  const { t } = useI18n();
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hero-glow opacity-70" aria-hidden />
        <div className="relative mx-auto grid max-w-5xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="gradient-text">{t.campaign.title}</span>
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">{t.campaign.sub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTALink href="#" variant="primary" aria-label="App Store">
                <Apple className="h-4 w-4" /> App Store
              </CTALink>
              <CTALink href="#" variant="secondary" aria-label="Google Play">
                <Smartphone className="h-4 w-4" /> Google Play
              </CTALink>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Coming soon. Real store links will be added once the apps are published.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="glass-card flex aspect-square w-full max-w-xs flex-col items-center justify-center rounded-3xl p-6 text-center">
              <QrCode className="h-32 w-32 text-foreground" />
              <div className="mt-4 text-sm font-medium">ciaorelated.com</div>
              <div className="text-xs text-muted-foreground">Scan with your phone</div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
