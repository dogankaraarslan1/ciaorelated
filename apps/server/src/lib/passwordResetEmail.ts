import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY, EMAIL_FROM } from "../config";

if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY);

export async function sendPasswordResetCode(email: string, code: string) {
  if (!SENDGRID_API_KEY || !EMAIL_FROM) {
    console.log("[email][DEV] RESET CODE to", email, "code:", code);
    return;
  }

  await sgMail.send({
    to: email,
    from: EMAIL_FROM,
    subject: "Dein Passwort-Reset Code",
    text: `Dein Code zum Zurücksetzen: ${code}\n\nDer Code ist nur kurz gültig.`,
  });
}
