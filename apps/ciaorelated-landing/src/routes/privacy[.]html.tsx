import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/site/LegalPageLayout";

export const Route = createFileRoute("/privacy.html")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ciaorelated" },
      { name: "description", content: "How ciaorelated handles your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="2026-01-01"
      related={[
        { href: "/privacy-de.html", label: "Deutsch" },
        { href: "/terms.html", label: "Terms of Service" },
        { href: "/guidelines.html", label: "Community Guidelines" },
      ]}
    >
      <LegalSection heading="Overview">
        <p>
          ciaorelated ("we", "us") provides a social app for real groups, chats, events,
          and shared moments. This Privacy Policy explains what data we collect, how we
          use it, and the choices you have. The current operator and contact address will
          be published at your-domain.example.
        </p>
      </LegalSection>
      <LegalSection heading="Information we collect">
        <p>Account data: display name, email, profile photo, language preference.</p>
        <p>Usage data: groups you create or join, messages you post, events you RSVP to.</p>
        <p>Device data: device type, OS version, app version, crash diagnostics.</p>
      </LegalSection>
      <LegalSection heading="How we use information">
        <p>To operate the app, deliver messages to the groups they're meant for, surface relevant events, and keep the service safe.</p>
        <p>We do not sell your personal data and we do not run third-party advertising inside the app.</p>
      </LegalSection>
      <LegalSection heading="Sharing">
        <p>Content you post is shared with the members of the groups or spaces you choose. Some processors (hosting, analytics, push notifications) operate strictly on our behalf.</p>
      </LegalSection>
      <LegalSection heading="Your rights">
        <p>You can access, export, correct, or delete your account data from inside the app. Reach us at <a className="text-primary underline" href="mailto:privacy@your-domain.example">privacy@your-domain.example</a>.</p>
      </LegalSection>
      <LegalSection heading="Retention">
        <p>We keep account data for as long as your account is active. When you delete your account we remove personal data within a reasonable period, except where retention is required by law.</p>
      </LegalSection>
      <LegalSection heading="Changes">
        <p>We may update this policy. Material changes will be announced in the app and on this page.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}