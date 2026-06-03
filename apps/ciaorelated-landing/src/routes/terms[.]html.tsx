import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/site/LegalPageLayout";

export const Route = createFileRoute("/terms.html")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ciaorelated" },
      { name: "description", content: "Terms for using ciaorelated." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      lastUpdated="2026-01-01"
      related={[
        { href: "/terms-de.html", label: "Deutsch" },
        { href: "/privacy.html", label: "Privacy Policy" },
        { href: "/guidelines.html", label: "Community Guidelines" },
      ]}
    >
      <LegalSection heading="Acceptance">
        <p>By creating an account or using ciaorelated you agree to these Terms. If you don't agree, please don't use the app.</p>
      </LegalSection>
      <LegalSection heading="Your account">
        <p>You're responsible for your account, your devices, and the content you share with your groups.</p>
      </LegalSection>
      <LegalSection heading="Acceptable use">
        <p>Follow our <a className="text-primary underline" href="/guidelines.html">Community Guidelines</a>. No illegal content, harassment, or spam.</p>
      </LegalSection>
      <LegalSection heading="Your content">
        <p>You keep ownership of what you post. You give us a limited license to deliver and display it to the people you share it with.</p>
      </LegalSection>
      <LegalSection heading="Suspension and termination">
        <p>We can suspend or end accounts that break these Terms or harm the community. You can delete your account at any time.</p>
      </LegalSection>
      <LegalSection heading="Disclaimer">
        <p>The app is provided "as is". We do not promise it is uninterrupted or error-free. Use of the app is at your own risk.</p>
      </LegalSection>
      <LegalSection heading="Contact">
        <p>Questions about these Terms? <a className="text-primary underline" href="mailto:legal@your-domain.example">legal@your-domain.example</a></p>
      </LegalSection>
    </LegalPageLayout>
  );
}