export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    /* ===============================
       READ FORM DATA (HTML FORM SAFE)
    =============================== */
    let body = "";
    for await (const chunk of req) {
      body += chunk.toString();
    }

    const params = new URLSearchParams(body);

    const name = params.get("name")?.trim();
    const email = params.get("email")?.trim(); // optional (if you add field)
    const phone = params.get("phone")?.trim();
    const service = params.get("service")?.trim();
    const location = params.get("location")?.trim();
    const message = params.get("message")?.trim() || "N/A";

    /* ===============================
       VALIDATIONS
    =============================== */

    // Name
    if (!name || name.length < 2) {
      return res.status(400).send("Invalid name");
    }

    // Phone (country code required, digits only, 8–15 digits)
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).send(
        "Invalid phone number. Use country code, e.g. +447438821200"
      );
    }

    // Email (optional but validated if present)
    if (email) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).send("Invalid email address");
      }
    }

    /* ===============================
       SEND EMAIL (RESEND API)
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
        subject: "New Service Request - DNA Global Staffing",
        html: `
          <h2>New Healthcare Service Request</h2>
          <p><b>Name:</b> ${name}</p>
          ${email ? `<p><b>Email:</b> ${email}</p>` : ""}
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Service:</b> ${service}</p>
          <p><b>Location:</b> ${location}</p>
          <p><b>Message:</b> ${message}</p>
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend error:", result);
      return res.status(500).send("Email service failed");
    }

    /* ===============================
       SUCCESS RESPONSE (USER FRIENDLY)
    =============================== */
    res.status(200).send(`
      <html>
        <head>
          <title>Request Submitted</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f5f7fa;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
            .box {
              background: #ffffff;
              padding: 40px;
              max-width: 420px;
              text-align: center;
              border-radius: 10px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            h2 {
              color: #2bb0ed;
              margin-bottom: 10px;
            }
            p {
              color: #444;
              margin-bottom: 20px;
            }
            a {
              display: inline-block;
              text-decoration: none;
              background: #2bb0ed;
              color: #fff;
              padding: 12px 20px;
              border-radius: 6px;
            }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>Thank You!</h2>
            <p>Your service request has been successfully submitted.<br>
            Our team will contact you shortly.</p>
            <a href="/contact.html">Back to Contact Page</a>
          </div>
        </body>
      </html>
    `);

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
}