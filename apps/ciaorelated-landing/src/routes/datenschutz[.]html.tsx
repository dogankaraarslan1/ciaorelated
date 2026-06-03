import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/datenschutz.html")({
  head: () => ({
    meta: [
      { title: "Datenschutz — ciaorelated" },
      { name: "description", content: "Datenschutzerklärung — ciaorelated." },
    ],
  }),
  component: DatenschutzPage,
});

// Legacy German privacy route — kept for backwards-compatible links.
// Redirects to the current /privacy-de.html page on the client.
function DatenschutzPage() {
  return <Navigate to="/privacy-de.html" replace />;
}