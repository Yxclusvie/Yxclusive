type NewSubmissionAlert = {
  itemName: string;
  designer: string;
  category: string;
  details: string;
  memberEmail: string;
  photoCount: number;
  reviewUrl: string;
};

// Emails the admin when a member submits a piece. Needs RESEND_API_KEY; without
// it this is a no-op, and it never throws, so a mail problem can't fail a submission.
export async function sendNewSubmissionAlert(alert: NewSubmissionAlert) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = process.env.ADMIN_ALERT_EMAIL ?? "team@yxclusive.com";
  const from = process.env.ALERT_FROM_EMAIL ?? "Yxclusive <onboarding@resend.dev>";

  const lines = [
    `${alert.memberEmail} just submitted a piece to sell.`,
    "",
    `Item: ${alert.itemName}`,
    `Designer: ${alert.designer}`,
    `Category: ${alert.category}`,
    `Photos: ${alert.photoCount}`,
    alert.details ? `\nDetails:\n${alert.details}` : "",
    "",
    `Review it: ${alert.reviewUrl}`,
  ];

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: alert.memberEmail,
        subject: `New submission: ${alert.itemName} (${alert.designer})`,
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error("Submission alert email failed:", response.status, await response.text());
    }
  } catch (error) {
    console.error("Submission alert email failed:", error);
  }
}
