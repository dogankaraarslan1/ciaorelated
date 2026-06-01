import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY, EMAIL_FROM } from "../config";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function sendVerifyCode(email: string, code: string) {
  // Dev / fehlende ENV → leise abbrechen
  if (!SENDGRID_API_KEY || !EMAIL_FROM) return;

  await sgMail.send({
    to: email,
    from: EMAIL_FROM,
    subject: "Your verification code",
    text: `Dein Bestätigungscode: ${code}\n\nDer Code ist nur kurz gültig.`,
  });
}
