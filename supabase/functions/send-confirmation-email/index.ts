import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Webhook payload received:", JSON.stringify(payload, null, 2));

    // A standard Supabase webhook payload contains the table record in payload.record (or payload.new_record)
    const record = payload.record || payload.new_record || payload;

    // Check if the status is verified
    if (record.status !== "Verified") {
      return new Response(
        JSON.stringify({ message: `Skipping. Status is ${record.status}, not Verified.` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { id, first_name, last_name, email, registered_bib, size, distance_meters } = record;

    if (!email) {
      throw new Error("No recipient email found in the record.");
    }

    // Determine category based on distance_meters
    let category = "5K";
    if (distance_meters === 3000) category = "3K";
    else if (distance_meters === 5000) category = "5K";
    else if (distance_meters === 10000) category = "10K";
    else if (distance_meters === 21000 || distance_meters === 21097) category = "21K";
    else if (distance_meters === 42195) category = "42K";

    const runnerName = `${first_name} ${last_name}`;
    const bibNumber = registered_bib || "Pending";

    // Dynamic public host fallback (e.g., standard production URL or localhost)
    const host = req.headers.get("origin") || "http://localhost:5173";
    const passUrl = `${host}/registration-pass?id=${id}`;

    // Read Resend API Key from Deno environment secret
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY environment secret.");
    }

    const emailSubject = `Registration Confirmed: ${runnerName} (#${bibNumber})`;

    // Beautiful HTML template matching the Runnicle visual style
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Registration Confirmed</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #f4f4f5;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            border: 1px solid #e4e4e7;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: #09090b;
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            color: #ff5722;
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .content {
            padding: 40px 32px;
            text-align: center;
          }
          .success-icon {
            font-size: 48px;
            color: #10b981;
            margin-bottom: 16px;
            line-height: 1;
          }
          h2 {
            color: #09090b;
            font-size: 24px;
            font-weight: 800;
            margin-top: 0;
            margin-bottom: 8px;
          }
          p {
            color: #71717a;
            font-size: 15px;
            line-height: 24px;
            margin: 0 0 24px 0;
          }
          .ticket-card {
            border: 1px solid #e4e4e7;
            border-radius: 12px;
            background-color: #fafafa;
            padding: 24px;
            margin-bottom: 32px;
            text-align: left;
          }
          .ticket-header {
            border-bottom: 2px dashed #e4e4e7;
            padding-bottom: 16px;
            margin-bottom: 16px;
          }
          .ticket-title {
            font-size: 12px;
            font-weight: 700;
            color: #71717a;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .ticket-event {
            font-size: 18px;
            font-weight: 800;
            color: #09090b;
            margin-top: 4px;
          }
          .ticket-grid {
            display: table;
            width: 100%;
          }
          .ticket-row {
            display: table-row;
          }
          .ticket-col {
            display: table-cell;
            width: 50%;
            padding-bottom: 12px;
          }
          .label {
            font-size: 10px;
            font-weight: 700;
            color: #a1a1aa;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .value {
            font-size: 14px;
            font-weight: 700;
            color: #18181b;
            margin-top: 2px;
          }
          .bib-section {
            background-color: #ffebd8;
            border: 1px dashed #ff5722;
            border-radius: 8px;
            padding: 12px;
            text-align: center;
            margin-top: 12px;
          }
          .bib-label {
            font-size: 10px;
            font-weight: 800;
            color: #ff5722;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .bib-value {
            font-size: 24px;
            font-weight: 900;
            color: #ff5722;
            margin-top: 2px;
          }
          .btn-container {
            margin-top: 32px;
          }
          .btn {
            display: inline-block;
            background-color: #ff5722;
            color: #ffffff !important;
            padding: 14px 28px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            box-shadow: 0 4px 6px -1px rgba(255, 87, 34, 0.2);
          }
          .footer {
            background-color: #fafafa;
            border-top: 1px solid #e4e4e7;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #a1a1aa;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RUNNICLE</h1>
          </div>
          <div class="content">
            <div class="success-icon">✓</div>
            <h2>Registration Confirmed!</h2>
            <p>Hi ${first_name}, your payment has been successfully verified! You are officially registered for the event. Below are your pass details:</p>
            
            <div class="ticket-card">
              <div class="ticket-header">
                <div class="ticket-title">Official Timing Pass</div>
                <div class="ticket-event">Runnicle Race Event</div>
              </div>
              <div class="ticket-grid">
                <div class="ticket-row">
                  <div class="ticket-col">
                    <div class="label">Runner Name</div>
                    <div class="value">${runnerName}</div>
                  </div>
                  <div class="ticket-col">
                    <div class="label">Category</div>
                    <div class="value">${category} Run</div>
                  </div>
                </div>
                <div class="ticket-row">
                  <div class="ticket-col">
                    <div class="label">Singlet Size</div>
                    <div class="value">${size || 'M'}</div>
                  </div>
                  <div class="ticket-col">
                    <div class="label">Status</div>
                    <div class="value" style="color: #10b981;">VERIFIED</div>
                  </div>
                </div>
              </div>
              
              <div class="bib-section">
                <div class="bib-label">Official Runner Bib</div>
                <div class="bib-value">#${bibNumber}</div>
              </div>
            </div>

            <div class="btn-container">
              <a href="${passUrl}" class="btn" target="_blank">View / Print Race Pass</a>
            </div>
          </div>
          <div class="footer">
            &copy; 2026 Runnicle. All rights reserved.<br>
            If you did not make this request, please contact support immediately.
          </div>
        </div>
      </body>
      </html>
    `;

    // Send using Resend API
    console.log("Sending email to:", email, "via Resend...");
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Runnicle <onboarding@resend.dev>",
        to: [email],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    const resendResult = await resendRes.json();
    console.log("Resend API response:", JSON.stringify(resendResult));

    if (!resendRes.ok) {
      throw new Error(`Resend API failed: ${JSON.stringify(resendResult)}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", resendId: resendResult.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("Error processing function:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
