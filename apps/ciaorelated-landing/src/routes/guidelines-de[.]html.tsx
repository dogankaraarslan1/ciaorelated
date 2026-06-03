import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/site/LegalPageLayout";

export const Route = createFileRoute("/guidelines-de.html")({
  head: () => ({
    meta: [
      { title: "Community-Richtlinien — ciaorelated" },
      { name: "description", content: "So bleibt ciaorelated freundlich und nützlich." },
    ],
  }),
  component: GuidelinesDePage,
});

function GuidelinesDePage() {
  return (
    <LegalPageLayout
      title="Community-Richtlinien"
      lastUpdated="2026-01-01"
      related={[
        { href: "/guidelines.html", label: "English" },
        { href: "/terms-de.html", label: "Nutzungsbedingungen" },
        { href: "/privacy-de.html", label: "Datenschutzerklärung" },
      ]}
    >
      <LegalSection heading="Kurzfassung">
        <p>ciaorelated ist für echte Gruppen, echte Gespräche und echte Momente. Sei die Person, die du in deiner eigenen Gruppe haben möchtest.</p>
      </LegalSection>
      <LegalSection heading="Was erlaubt ist">
        <p>Momente, Fotos, Pläne und Updates mit den Personen in deinen Räumen teilen. Ehrliche Meinungen. Freundliche Meinungsverschiedenheiten.</p>
      </LegalSection>
      <LegalSection heading="Was nicht erlaubt ist">
        <p>Belästigung, Hassrede, Drohungen, Doxxing.</p>
        <p>Sexuelle Inhalte mit Minderjährigen, in jeder Form.</p>
        <p>Spam, Betrug oder koordinierte Manipulation.</p>
        <p>Verbreitung privater Informationen anderer ohne deren Einverständnis.</p>
      </LegalSection>
      <LegalSection heading="Gruppen leiten">
        <p>Wenn du eine Gruppe gründest, prägst du den Ton. Nutze die Moderationswerkzeuge, sei fair und entferne Inhalte, die gegen diese Richtlinien verstoßen.</p>
      </LegalSection>
      <LegalSection heading="Melden">
        <p>Nutze den In-App-Meldeflow für jeden Beitrag, jede Nachricht oder jedes Profil. Wir prüfen Meldungen und handeln bei Verstößen.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}