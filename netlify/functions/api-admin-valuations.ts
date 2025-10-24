import type { Handler } from "@netlify/functions";
import { requireAdmin } from "./_auth";
import { getValuationsIndex, removeValuationIndex, getJSON, deleteJSON } from "./_blobs";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, DELETE, POST, OPTIONS",
  "Content-Type": "application/json",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    requireAdmin(event);

    const path = event.path.replace("/api/admin/valuations", "").replace("/.netlify/functions/api-admin-valuations", "");
    const pathParts = path.split("/").filter(Boolean);
    const id = pathParts[0];
    const action = pathParts[1];

    // GET /api/admin/valuations - List with filtering and pagination
    if (event.httpMethod === "GET" && !id) {
      const params = event.queryStringParameters || {};
      const q = params.q?.toLowerCase() || "";
      const stageFilter = params.stage ? parseInt(params.stage) : null;
      const page = parseInt(params.page || "1");
      const limit = parseInt(params.limit || "20");

      let valuations = await getValuationsIndex();

      // Search filter (email, address)
      if (q) {
        valuations = valuations.filter(v => 
          v.email.toLowerCase().includes(q) ||
          v.street?.toLowerCase().includes(q) ||
          v.city?.toLowerCase().includes(q) ||
          v.state?.toLowerCase().includes(q)
        );
      }

      // Stage filter
      if (stageFilter !== null) {
        valuations = valuations.filter(v => v.stage === stageFilter);
      }

      // Sort by updatedAt desc
      valuations.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      // Pagination
      const total = valuations.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedValuations = valuations.slice(startIndex, endIndex);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          data: paginatedValuations,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        }),
      };
    }

    // DELETE /api/admin/valuations/:id - Delete valuation
    if (event.httpMethod === "DELETE" && id) {
      await deleteJSON("valuations", id);
      await removeValuationIndex(id);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true }),
      };
    }

    // POST /api/admin/valuations/:id/resend - Resend email
    if (event.httpMethod === "POST" && id && action === "resend") {
      // Get valuation data
      const valuation = await getJSON<any>("valuations", id);
      
      if (!valuation) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: "Valuation not found" }),
        };
      }

      // Re-use email logic from api-submit
      const sendgrid = await import("@sendgrid/mail");
      sendgrid.default.setApiKey(process.env.SENDGRID_API_KEY || "");

      const fromEmail = process.env.FROM_EMAIL || "reports@sellmypostoffice.com";
      const siteUrl = process.env.SITE_BASE_URL || "https://www.sellmypostoffice.com";

      // Try to get Street View image
      let streetViewUrl = "";
      if (valuation.propertyAddress && process.env.GOOGLE_MAPS_API_KEY) {
        try {
          const fetch = (await import("node-fetch")).default;
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            valuation.propertyAddress
          )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
          
          const geocodeResponse = await fetch(geocodeUrl);
          const geocodeData = await geocodeResponse.json() as any;
          
          if (geocodeData.results && geocodeData.results[0]) {
            const location = geocodeData.results[0].geometry.location;
            streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${location.lat},${location.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
          }
        } catch (err) {
          console.warn("Failed to get Street View:", err);
        }
      }

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #004B87; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .estimates { display: flex; gap: 20px; margin: 30px 0; }
            .estimate-box { flex: 1; padding: 20px; border: 2px solid #e5e5e5; border-radius: 8px; text-align: center; }
            .estimate-box.optimistic { border-color: #14B8A6; }
            .amount { font-size: 32px; font-weight: bold; color: #004B87; margin: 10px 0; }
            .property-image { width: 100%; max-width: 600px; height: auto; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
            th { background: #f8f8f8; font-weight: bold; }
            .footer { background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Post Office Property Valuation</h1>
            </div>
            <div class="content">
              <p>Dear ${valuation.firstName} ${valuation.lastName},</p>
              <p>Thank you for requesting a valuation for your USPS-leased property. Based on the information you provided, here are your estimated property values:</p>
              
              ${streetViewUrl ? `<img src="${streetViewUrl}" alt="Property" class="property-image" />` : ""}
              
              <div class="estimates">
                <div class="estimate-box">
                  <div style="font-size: 14px; color: #666;">Conservative Estimate</div>
                  <div class="amount">$${(valuation.lowEstimatedValue || 0).toLocaleString()}</div>
                  <div style="font-size: 12px; color: #666;">12% cap rate</div>
                </div>
                <div class="estimate-box optimistic">
                  <div style="font-size: 14px; color: #14B8A6;">Optimistic Estimate</div>
                  <div class="amount">$${(valuation.highEstimatedValue || 0).toLocaleString()}</div>
                  <div style="font-size: 12px; color: #666;">8% cap rate</div>
                </div>
              </div>

              <h3>Property Details</h3>
              <table>
                <tr><th>Address</th><td>${valuation.propertyAddress || "N/A"}</td></tr>
                <tr><th>Annual Rent</th><td>$${(valuation.annualRent || 0).toLocaleString()}</td></tr>
                <tr><th>Property Taxes</th><td>$${(valuation.annualPropertyTaxes || 0).toLocaleString()}</td></tr>
                <tr><th>Insurance</th><td>$${(valuation.annualInsurance || 0).toLocaleString()}</td></tr>
                <tr><th>Square Footage</th><td>${(valuation.squareFootage || 0).toLocaleString()} sq ft</td></tr>
              </table>

              <h3>What Happens Next?</h3>
              <ol>
                <li><strong>Review:</strong> Our team will review your property details within 24-48 hours</li>
                <li><strong>Consultation:</strong> We'll schedule a call to discuss your goals and answer questions</li>
                <li><strong>Marketing:</strong> If you decide to sell, we'll connect you with qualified buyers nationwide</li>
                <li><strong>Zero Fees:</strong> Remember, there are no broker commissions when you work with us</li>
              </ol>

              <p>Have questions? Reply to this email or call us at (555) 123-4567.</p>

              <p>Best regards,<br>The Sell My Post Office Team</p>
            </div>
            <div class="footer">
              <p><strong>Disclaimer:</strong> This valuation is an estimate based on the information provided and market assumptions. Actual market value may vary. This is not a formal appraisal.</p>
              <p>&copy; ${new Date().getFullYear()} Sell My Post Office. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendgrid.default.send({
        to: valuation.email,
        from: fromEmail,
        subject: `Your Post Office Property Valuation - $${(valuation.lowEstimatedValue || 0).toLocaleString()} - $${(valuation.highEstimatedValue || 0).toLocaleString()}`,
        html: emailHtml,
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Not found" }),
    };
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    console.error("Admin valuations error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
