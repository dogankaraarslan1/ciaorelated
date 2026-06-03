import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout, LegalSection } from "@/components/site/LegalPageLayout";

export const Route = createFileRoute("/privacy-de.html")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung — ciaorelated" },
      { name: "description", content: "So geht ciaorelated mit deinen Daten um." },
    ],
  }),
  component: PrivacyDePage,
});

function PrivacyDePage() {
  return (
    <LegalPageLayout
      title="Datenschutzerklärung"
      lastUpdated="2026-01-01"
      related={[
        { href: "/privacy.html", label: "English" },
        { href: "/terms-de.html", label: "Nutzungsbedingungen" },
        { href: "/guidelines-de.html", label: "Community-Richtlinien" },
      ]}
    >
      <LegalSection heading="Überblick">
        <p>
          ciaorelated („wir") betreibt eine Social-App für echte Gruppen, Chats,
          Events und gemeinsame Momente. Diese Datenschutzerklärung erklärt,
          welche Daten wir verarbeiten und welche Rechte du hast.
        </p>
      </LegalSection>
      <LegalSection heading="Welche Daten wir verarbeiten">
        <p>Kontodaten: Anzeigename, E-Mail-Adresse, Profilbild, Spracheinstellung.</p>
        <p>Nutzungsdaten: erstellte oder beigetretene Gruppen, Beiträge, Event-Zusagen.</p>
        <p>Gerätedaten: Gerätetyp, Betriebssystemversion, App-Version, Absturzdiagnose.</p>
      </LegalSection>
      <LegalSection heading="Zwecke der Verarbeitung">
        <p>Bereitstellung der App, Zustellung von Nachrichten an die richtigen Gruppen, Anzeige relevanter Events und Sicherheit des Dienstes.</p>
        <p>Wir verkaufen keine personenbezogenen Daten und schalten keine Drittanbieter-Werbung in der App.</p>
      </LegalSection>
      <LegalSection heading="Weitergabe">
        <p>Inhalte, die du veröffentlichst, werden mit den von dir gewählten Gruppen geteilt. Einzelne Auftragsverarbeiter (Hosting, Analyse, Push-Benachrichtigungen) arbeiten ausschließlich in unserem Auftrag.</p>
      </LegalSection>
      <LegalSection heading="Deine Rechte">
        <p>Du kannst deine Daten in der App einsehen, exportieren, berichtigen oder löschen. Schreib uns an <a className="text-primary underline" href="mailto:privacy@your-domain.example">privacy@your-domain.example</a>.</p>
      </LegalSection>
      <LegalSection heading="Speicherdauer">
        <p>Wir speichern Kontodaten, solange dein Konto aktiv ist. Nach einer Löschung entfernen wir personenbezogene Daten innerhalb eines angemessenen Zeitraums, soweit keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
      </LegalSection>
      <LegalSection heading="Änderungen">
        <p>Wir können diese Erklärung anpassen. Wesentliche Änderungen kommunizieren wir in der App und auf dieser Seite.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}