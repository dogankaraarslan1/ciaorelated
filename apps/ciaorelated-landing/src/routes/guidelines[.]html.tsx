import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/site/LegalPageLayout";

export const Route = createFileRoute("/guidelines.html")({
  head: () => ({
    meta: [
      { title: "Community Guidelines — ciaorelated" },
      { name: "description", content: "How we keep ciaorelated kind and useful." },
    ],
  }),
  component: GuidelinesPage,
});

function GuidelinesPage() {
  return (
    <LegalPageLayout
      title="Community Guidelines"
      lastUpdated="2026-01-01"
      related={[
        { href: "/guidelines-de.html", label: "Deutsch" },
        { href: "/terms.html", label: "Terms of Service" },
        { href: "/privacy.html", label: "Privacy Policy" },
      ]}
    >
      <LegalSection heading="The short version">
        <p>ciaorelated is for real groups, real conversations, and real moments. Be the person you'd want in your own group.</p>
      </LegalSection>
      <LegalSection heading="What's allowed">
        <p>Sharing moments, photos, plans, and updates with the people in your spaces. Honest opinions. Friendly disagreement.</p>
      </LegalSection>
      <LegalSection heading="What's not allowed">
        <p>Harassment, hate speech, threats, doxxing.</p>
        <p>Sexual content involving minors, in any form.</p>
        <p>Spam, scams, or coordinated manipulation.</p>
        <p>Sharing private information about other people without their consent.</p>
      </LegalSection>
      <LegalSection heading="Hosting a group">
        <p>If you create a group, you set the tone. Use the moderation tools, be fair, and remove content that breaks these guidelines.</p>
      </LegalSection>
      <LegalSection heading="Reporting">
        <p>Use the in-app report flow on any post, message, or profile. We review reports and act when guidelines are broken.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}