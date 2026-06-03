import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/site/LegalPageLayout";

export const Route = createFileRoute("/terms-de.html")({
  head: () => ({
    meta: [
      { title: "Nutzungsbedingungen — ciaorelated" },
      { name: "description", content: "Nutzungsbedingungen von ciaorelated." },
    ],
  }),
  component: TermsDePage,
});

function TermsDePage() {
  return (
    <LegalPageLayout
      title="Nutzungsbedingungen"
      lastUpdated="2026-01-01"
      related={[
        { href: "/terms.html", label: "English" },
        { href: "/privacy-de.html", label: "Datenschutzerklärung" },
        { href: "/guidelines-de.html", label: "Community-Richtlinien" },
      ]}
    >
      <LegalSection heading="Geltungsbereich">
        <p>Mit der Erstellung eines Kontos oder der Nutzung von ciaorelated stimmst du diesen Bedingungen zu. Wenn du nicht zustimmst, nutze die App bitte nicht.</p>
      </LegalSection>
      <LegalSection heading="Dein Konto">
        <p>Du bist für dein Konto, deine Geräte und die Inhalte verantwortlich, die du in deinen Gruppen teilst.</p>
      </LegalSection>
      <LegalSection heading="Zulässige Nutzung">
        <p>Halte dich an unsere <a className="text-primary underline" href="/guidelines-de.html">Community-Richtlinien</a>. Keine illegalen Inhalte, kein Hass, kein Spam.</p>
      </LegalSection>
      <LegalSection heading="Deine Inhalte">
        <p>Du behältst die Rechte an deinen Inhalten. Du gewährst uns eine eingeschränkte Lizenz, deine Inhalte den von dir gewählten Personen zuzustellen und anzuzeigen.</p>
      </LegalSection>
      <LegalSection heading="Sperrung und Beendigung">
        <p>Wir können Konten sperren oder beenden, die gegen diese Bedingungen verstoßen oder der Community schaden. Du kannst dein Konto jederzeit löschen.</p>
      </LegalSection>
      <LegalSection heading="Haftungsausschluss">
        <p>Die App wird „wie sie ist" bereitgestellt. Wir garantieren keine ununterbrochene oder fehlerfreie Verfügbarkeit. Die Nutzung erfolgt auf eigenes Risiko.</p>
      </LegalSection>
      <LegalSection heading="Kontakt">
        <p>Fragen? <a className="text-primary underline" href="mailto:legal@your-domain.example">legal@your-domain.example</a></p>
      </LegalSection>
    </LegalPageLayout>
  );
}