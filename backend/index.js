import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(
    cors({
      origin: [
        "http://localhost:5173", // Vite dev
        "https://your-frontend-domain.vercel.app", // replace later
      ],
    })
  );
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);
const PORT = process.env.PORT || 5000;

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getInquiryEmailHtml(name, phone, fromDestination, toDestination, notes) {
  const n = escapeHtml(name);
  const p = escapeHtml(phone);
  const from = escapeHtml(fromDestination);
  const to = escapeHtml(toDestination);
  const notesTrimmed = notes != null ? String(notes).trim() : "";
  const hasNotes = notesTrimmed.length > 0;
  const notesEscaped = escapeHtml(notesTrimmed);
  const notesRow = hasNotes
    ? `
                <tr>
                  <td style="padding: 12px 0; border-top: 1px solid rgba(55, 53, 47, 0.09); vertical-align: top;">
                    <span style="font-size: 12px; font-weight: 500; color: #6b6b6b; text-transform: uppercase; letter-spacing: 0.02em;">Additional instructions / notes</span>
                    <div style="font-size: 15px; color: #37352f; margin-top: 2px; white-space: pre-wrap;">${notesEscaped}</div>
                  </td>
                </tr>`
    : "";
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Car Inquiry</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; line-height: 1.5; color: #37352f; background-color: #f7f6f3;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f6f3; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #ffffff; border-radius: 8px; border: 1px solid rgba(55, 53, 47, 0.16); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); overflow: hidden;">
          <tr>
            <td style="padding: 28px 32px 24px; border-bottom: 1px solid rgba(55, 53, 47, 0.09);">
              <h1 style="margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; color: #37352f;">Car Inquiry</h1>
              <p style="margin: 6px 0 0; font-size: 14px; color: #6b6b6b;">New request from your site</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(55, 53, 47, 0.09); vertical-align: top;">
                    <span style="font-size: 12px; font-weight: 500; color: #6b6b6b; text-transform: uppercase; letter-spacing: 0.02em;">Name</span>
                    <div style="font-size: 15px; color: #37352f; margin-top: 2px;">${n}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(55, 53, 47, 0.09); vertical-align: top;">
                    <span style="font-size: 12px; font-weight: 500; color: #6b6b6b; text-transform: uppercase; letter-spacing: 0.02em;">Phone</span>
                    <div style="font-size: 15px; color: #37352f; margin-top: 2px;">${p}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(55, 53, 47, 0.09); vertical-align: top;">
                    <span style="font-size: 12px; font-weight: 500; color: #6b6b6b; text-transform: uppercase; letter-spacing: 0.02em;">From</span>
                    <div style="font-size: 15px; color: #37352f; margin-top: 2px;">${from}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; vertical-align: top;">
                    <span style="font-size: 12px; font-weight: 500; color: #6b6b6b; text-transform: uppercase; letter-spacing: 0.02em;">To</span>
                    <div style="font-size: 15px; color: #37352f; margin-top: 2px;">${to}</div>
                  </td>
                </tr>${notesRow}
              </table>
            </td>
          </tr>
        </table>
        <p style="margin: 20px 0 0; font-size: 12px; color: #9b9a97;">This email was sent from your Car Inquiry form.</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

app.post("/api/inquiry", async (req, res) => {
  const { name, phone, fromDestination, toDestination, notes } = req.body;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "atulraghuvanshi09@gmail.com",
      subject: "New Car Inquiry",
      html: getInquiryEmailHtml(name, phone, fromDestination, toDestination, notes),
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Email failed" });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });