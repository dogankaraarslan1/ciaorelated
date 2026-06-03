import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  MessagesSquare,
  CalendarHeart,
  Link2,
  ShieldCheck,
  Github,
  Heart,
  Image as ImageIcon,
  MapPin,
  Sparkles,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { CTALink } from "@/components/site/CTAButton";
import { PhoneMockup } from "@/components/site/PhoneMockup";
import { FeatureSection } from "@/components/site/FeatureSection";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ciaorelated — Social moments for real communities" },
      {
        name: "description",
        content:
          "Group chats, shared moments and event feeds in one place. Create spaces for friends, families and local communities.",
      },
      { property: "og:title", content: "ciaorelated" },
      {
        property: "og:description",
        content: "Group chats, shared moments and event feeds in one place.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  return (
    <SiteShell>
      <Hero />
      <SocialProof />
      <div id="features">
        <FeatureSection
          eyebrow="Moments"
          title={t.sections.feedTitle}
          description={t.sections.feedSub}
          media={<FeedMockup />}
        />
      </div>
      <div id="community">
        <FeatureSection
          eyebrow="Groups"
          title={t.sections.groupsTitle}
          description={t.sections.groupsSub}
          media={<ChatMockup />}
          reverse
        />
        <FeatureSection
          eyebrow="Events"
          title={t.sections.eventsTitle}
          description={t.sections.eventsSub}
          media={<EventsMockup />}
        />
      </div>
      <FeatureSection
        eyebrow="Invite"
        title={t.sections.inviteTitle}
        description={t.sections.inviteSub}
        media={<InviteMockup />}
        reverse
      />
      <div id="privacy">
        <TrustBand />
      </div>
      <div id="opensource">
        <OpenSourceBand />
      </div>
      <DownloadCTA />
    </SiteShell>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hero-glow opacity-80" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 md:grid-cols-2 md:gap-8 md:pb-28 md:pt-24">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> {t.hero.eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            <span className="gradient-text">{t.hero.title}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">{t.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTALink href="/kampagne.html" variant="primary">{t.hero.ctaPrimary}</CTALink>
            <CTALink href="#features" variant="secondary">{t.hero.ctaSecondary}</CTALink>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">{t.hero.tag}</p>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 -z-10 hero-glow blur-2xl" aria-hidden />
          <div className="relative flex items-end gap-4">
            <PhoneMockup className="hidden scale-90 sm:block" rotate={-6}>
              <ChatMockupInner />
            </PhoneMockup>
            <PhoneMockup className="scale-100">
              <FeedMockupInner />
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const items = [
    "Real groups",
    "Shared moments",
    "Local events",
    "Family circles",
    "Open source",
  ];
  return (
    <div className="border-y border-border/60 bg-card/30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:px-6">
        {items.map((i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </div>
  );
}

function FeedMockup() {
  return (
    <PhoneMockup className="md:ml-auto">
      <FeedMockupInner />
    </PhoneMockup>
  );
}

function FeedMockupInner() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-background to-secondary">
      <div className="flex items-center justify-between px-4 pb-2 pt-7">
        <span className="text-sm font-semibold">Moments</span>
        <Heart className="h-4 w-4 text-primary" />
      </div>
      <div className="space-y-3 px-3 pb-3">
        {[
          { name: "Lena", text: "Sunset hike with the crew", group: "Weekend Walks" },
          { name: "Marco", text: "First family dinner of the year", group: "Familie" },
          { name: "Aïcha", text: "Block party planning starts now", group: "Neighborhood" },
        ].map((p) => (
          <div key={p.name} className="rounded-2xl border border-border bg-card/80 p-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full gradient-hero" />
              <div className="flex-1">
                <div className="text-xs font-semibold">{p.name}</div>
                <div className="text-[10px] text-muted-foreground">in {p.group}</div>
              </div>
            </div>
            <div className="mt-2 aspect-[5/3] rounded-xl gradient-hero opacity-80" />
            <div className="mt-2 text-xs text-foreground/80">{p.text}</div>
            <div className="mt-2 flex gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> 24</span>
              <span className="flex items-center gap-1"><MessagesSquare className="h-3 w-3" /> 6</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatMockup() {
  return (
    <PhoneMockup>
      <ChatMockupInner />
    </PhoneMockup>
  );
}

function ChatMockupInner() {
  const messages = [
    { from: "them", text: "Are we still on for Saturday?" },
    { from: "me", text: "Yes! I'll bring the speaker." },
    { from: "them", text: "Perfect — sending the pin now." },
    { from: "me", text: "Got it. See you at 6." },
  ];
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-background to-secondary">
      <div className="flex items-center gap-2 border-b border-border px-4 pb-3 pt-7">
        <div className="h-7 w-7 rounded-full gradient-hero" />
        <div>
          <div className="text-xs font-semibold">Sunday Crew</div>
          <div className="text-[10px] text-muted-foreground">8 members</div>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden px-3 py-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[78%] rounded-2xl px-3 py-2 text-xs ${
              m.from === "me"
                ? "ml-auto gradient-hero text-primary-foreground"
                : "border border-border bg-card text-foreground"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="m-3 rounded-full border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground">
        Message Sunday Crew…
      </div>
    </div>
  );
}

function EventsMockup() {
  const events = [
    { title: "Open Air Cinema", where: "Park Mitte", when: "Fri 21:00" },
    { title: "Sunday Run", where: "Riverside", when: "Sun 09:00" },
    { title: "Family Brunch", where: "Marco's place", when: "Sat 11:00" },
  ];
  return (
    <PhoneMockup className="md:ml-auto">
      <div className="flex h-full flex-col bg-gradient-to-b from-background to-secondary">
        <div className="flex items-center justify-between px-4 pb-2 pt-7">
          <span className="text-sm font-semibold">Nearby events</span>
          <CalendarHeart className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-3 px-3 pb-3">
          {events.map((e) => (
            <div key={e.title} className="rounded-2xl border border-border bg-card/80 p-3">
              <div className="aspect-[16/9] rounded-xl gradient-hero opacity-80" />
              <div className="mt-2 text-sm font-semibold">{e.title}</div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.where}</span>
                <span>{e.when}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneMockup>
  );
}

function InviteMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-hero" />
          <div>
            <div className="text-sm font-semibold">Weekend Walks</div>
            <div className="text-xs text-muted-foreground">Lena invited you</div>
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Invitation link</div>
          <div className="mt-1 truncate font-mono text-sm">your-domain.example/join?slug=abc123</div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border bg-card/50 p-3 text-center text-xs">
            <Link2 className="mx-auto h-4 w-4 text-primary" />
            <div className="mt-1 font-medium">Open in app</div>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-3 text-center text-xs">
            <ImageIcon className="mx-auto h-4 w-4 text-primary" />
            <div className="mt-1 font-medium">Share QR</div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -inset-10 -z-10 hero-glow blur-3xl" aria-hidden />
    </div>
  );
}

function TrustBand() {
  const { t } = useI18n();
  const items = [
    { icon: ShieldCheck, title: "Private by default", text: "Spaces are invite-only. You decide who's in." },
    { icon: Users, title: "Real moderation", text: "Clear tools for hosts. Less noise, more signal." },
    { icon: Heart, title: "No engagement traps", text: "No ads, no algorithmic doomscroll." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.sections.trustTitle}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t.sections.trustSub}</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {items.map((i) => (
          <div key={i.title} className="glass-card rounded-2xl p-6">
            <i.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-3 text-base font-semibold">{i.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{i.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OpenSourceBand() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="glass-card flex flex-col items-start gap-6 rounded-3xl p-8 md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <Github className="h-3.5 w-3.5" /> Open source
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{t.sections.ossTitle}</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t.sections.ossSub}</p>
        </div>
        <CTALink href="https://github.com/" target="_blank" rel="noreferrer" variant="primary">
          <Github className="h-4 w-4" />
          {t.sections.ossCta}
        </CTALink>
      </div>
    </section>
  );
}

function DownloadCTA() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hero-glow opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-10 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          <span className="gradient-text">{t.sections.downloadTitle}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t.sections.downloadSub}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CTALink href="/kampagne.html" variant="primary">{t.nav.download}</CTALink>
          <CTALink href="/support.html" variant="secondary">{t.footer.support}</CTALink>
        </div>
      </div>
    </section>
  );
}