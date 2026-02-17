export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {

    /* ===============================
       READ BODY (JSON + FORM SAFE)
    =============================== */

    let data = {};

    if (req.headers["content-type"]?.includes("application/json")) {
      data = req.body;
    } else {
      let body = "";
      for await (const chunk of req) {
        body += chunk.toString();
      }
      const params = new URLSearchParams(body);
      data = Object.fromEntries(params.entries());
    }

    /* ===============================
       HELPER FUNCTION
    =============================== */

    function row(label, value) {
      if (!value || value === "N/A" || value.trim() === "") return "";
      return `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;"><b>${label}</b></td>
          <td style="padding:8px;border:1px solid #ddd;">${value}</td>
        </tr>
      `;
    }

    /* ===============================
       BUILD PROFESSIONAL EMAIL FORMAT
    =============================== */

    let htmlContent = `
      <div style="font-family:Arial,sans-serif;">
      <h2 style="text-align:center;">New Job Application</h2>
      <hr>

      <h3>Personal Information</h3>
      <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${row("Position", data.position)}
        ${row("Title", data.title)}
        ${row("First Name", data.firstName)}
        ${row("Last Name", data.lastName)}
        ${row("Date of Birth", data.dob)}
        ${row("Phone", data.phone)}
        ${row("Email", data.email)}
        ${row("Street Address", data.streetAddress)}
        ${row("Country", data.country)}
        ${row("Visa Type", data.visaType)}
        ${row("Passport Number", data.passportNumber)}
        ${row("Passport Expiry", data.passportExpiry)}
        ${row("RCNi Membership", data.rcni)}
        ${row("RCNi Membership Number", data.rcniMembershipNumber)}
      </table>

      <br>

      <h3>Academic Qualifications</h3>
      <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        <tr>
          <th style="border:1px solid #ddd;padding:8px;">Institution</th>
          <th style="border:1px solid #ddd;padding:8px;">Course</th>
          <th style="border:1px solid #ddd;padding:8px;">Start</th>
          <th style="border:1px solid #ddd;padding:8px;">End</th>
          <th style="border:1px solid #ddd;padding:8px;">Student ID</th>
        </tr>
    `;

    // Education Row 1
    if (data.education1_institution) {
      htmlContent += `
        <tr>
          <td style="border:1px solid #ddd;padding:8px;">${data.education1_institution}</td>
          <td style="border:1px solid #ddd;padding:8px;">${data.education1_course || ""}</td>
          <td style="border:1px solid #ddd;padding:8px;">${data.education1_start || ""}</td>
          <td style="border:1px solid #ddd;padding:8px;">${data.education1_end || ""}</td>
          <td style="border:1px solid #ddd;padding:8px;">${data.education1_studentId || ""}</td>
        </tr>
      `;
    }

    // Education Row 2
    if (data.education2_institution) {
      htmlContent += `
        <tr>
          <td style="border:1px solid #ddd;padding:8px;">${data.education2_institution}</td>
          <td style="border:1px solid #ddd;padding:8px;">${data.education2_course || ""}</td>
          <td style="border:1px solid #ddd;padding:8px;">${data.education2_start || ""}</td>
          <td style="border:1px solid #ddd;padding:8px;">${data.education2_end || ""}</td>
          <td style="border:1px solid #ddd;padding:8px;">${data.education2_studentId || ""}</td>
        </tr>
      `;
    }

    htmlContent += `
      </table>

      <br>

      <h3>Consent</h3>
      <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${data.gdprConsent ? `
          <tr>
            <td style="border:1px solid #ddd;padding:8px;"><b>GDPR Consent</b></td>
            <td style="border:1px solid #ddd;padding:8px;">Accepted</td>
          </tr>` : ""}

        ${data.auditConsent ? `
          <tr>
            <td style="border:1px solid #ddd;padding:8px;"><b>Audit Consent</b></td>
            <td style="border:1px solid #ddd;padding:8px;">Accepted</td>
          </tr>` : ""}
      </table>

      <br><br>

      <p style="text-align:center;font-size:12px;color:#666;">
        DNA Staffing Solution – Recruitment Management System
      </p>

      </div>
    `;

    /* ===============================
       SEND EMAIL VIA RESEND
    =============================== */

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DNA Global Staffing <onboarding@resend.dev>",
        to: ["dnaglobalstaffing@gmail.com"],
        subject: `New Job Application - ${data.firstName || ""} ${data.lastName || ""}`,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Resend error:", error);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ success: false });
  }
}