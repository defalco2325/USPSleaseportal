import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import sgMail from "@sendgrid/mail";
import { z } from "zod";

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "reports@sellmypostoffice.com";
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";
const SITE_BASE_URL = process.env.SITE_BASE_URL || "https://www.sellmypostoffice.com";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Validation schema
const submitSchema = z.object({
  id: z.string().optional(),
  // Fallback if no ID provided
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  propertyAddress: z.string().optional(),
  annualRent: z.number().optional(),
  annualPropertyTaxes: z.number().optional(),
  taxesReimbursed: z.boolean().optional(),
  annualInsurance: z.number().optional(),
  squareFootage: z.number().optional(),
});

interface ValuationData {
  firstName: string;
  lastName: string;
  email: string;
  propertyAddress: string;
  annualRent: number;
  annualPropertyTaxes: number;
  taxesReimbursed: boolean;
  annualInsurance: number;
  squareFootage: number;
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; formattedAddress: string } | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("No Google Maps API key configured");
    return null;
  }

  try {
    const fetch = (await import("node-fetch")).default;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data: any = await response.json();

    if (data.status === "OK" && data.results && data.results[0]) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

function getStreetViewUrl(lat: number, lng: number): string {
  if (!GOOGLE_MAPS_API_KEY) return "";
  
  return `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&return_error_code=true`;
}

function calculateValuation(data: ValuationData): { conservative: number; optimistic: number } {
  const { annualRent, annualPropertyTaxes, taxesReimbursed, annualInsurance, squareFootage } = data;
  
  const maintenanceCost = squareFootage * 1.75;
  const taxesToSubtract = taxesReimbursed ? 0 : annualPropertyTaxes;
  const netOperatingIncome = annualRent - taxesToSubtract - annualInsurance - maintenanceCost;
  
  const conservative = Math.round(Math.max(netOperatingIncome / 0.12, 0));
  const optimistic = Math.round(Math.max(netOperatingIncome / 0.08, 0));
  
  return { conservative, optimistic };
}

function generateEmailHTML(
  data: ValuationData,
  conservative: number,
  optimistic: number,
  streetViewUrl: string | null,
  formattedAddress: string
): string {
  const streetViewImage = streetViewUrl 
    ? `<img src="${streetViewUrl}" alt="Property Street View" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin: 20px 0;" />`
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your USPS Property Valuation Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F8FAFC;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #004B87 0%, #003366 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #FFFFFF; font-size: 32px; margin: 0 0 10px 0; font-weight: 700;">Your Property Valuation Report</h1>
              <p style="color: #E0E7EE; font-size: 16px; margin: 0;">Confidential Analysis for ${data.firstName} ${data.lastName}</p>
            </td>
          </tr>
          
          <!-- Property Address -->
          <tr>
            <td style="padding: 30px; border-bottom: 2px solid #E5E7EB;">
              <h2 style="color: #0D1B2A; font-size: 18px; margin: 0 0 10px 0;">Property Address</h2>
              <p style="color: #64748B; font-size: 16px; margin: 0; line-height: 1.6;">${formattedAddress}</p>
            </td>
          </tr>
          
          <!-- Street View Image -->
          ${streetViewImage ? `
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              ${streetViewImage}
              <p style="color: #94A3B8; font-size: 12px; margin: 5px 0 0 0; font-style: italic;">Imagery © Google. Street View provided for reference only.</p>
            </td>
          </tr>
          ` : ''}
          
          <!-- Valuation Results -->
          <tr>
            <td style="padding: 30px; background-color: #F8FAFC;">
              <h2 style="color: #0D1B2A; font-size: 22px; margin: 0 0 20px 0; text-align: center;">Estimated Property Value</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" style="background-color: #FFFFFF; border: 2px solid #E0E7EE; border-radius: 8px; padding: 20px; text-align: center; vertical-align: top;">
                    <p style="color: #64748B; font-size: 14px; font-weight: 600; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">Conservative Estimate</p>
                    <p style="color: #004B87; font-size: 36px; font-weight: 700; margin: 0 0 5px 0;">$${conservative.toLocaleString()}</p>
                    <p style="color: #94A3B8; font-size: 12px; margin: 0;">12% cap rate</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="background-color: #FFFFFF; border: 2px solid #004B87; border-radius: 8px; padding: 20px; text-align: center; vertical-align: top;">
                    <p style="color: #004B87; font-size: 14px; font-weight: 600; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">Optimistic Estimate</p>
                    <p style="color: #004B87; font-size: 36px; font-weight: 700; margin: 0 0 5px 0;">$${optimistic.toLocaleString()}</p>
                    <p style="color: #94A3B8; font-size: 12px; margin: 0;">8% cap rate</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Property Details -->
          <tr>
            <td style="padding: 30px;">
              <h3 style="color: #0D1B2A; font-size: 18px; margin: 0 0 15px 0;">Valuation Breakdown</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="color: #64748B; font-size: 14px; padding: 10px 0;">Annual Rent</td>
                  <td style="color: #0D1B2A; font-size: 14px; font-weight: 600; text-align: right; padding: 10px 0;">$${data.annualRent.toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="color: #64748B; font-size: 14px; padding: 10px 0;">Property Taxes ${data.taxesReimbursed ? '(Reimbursed)' : ''}</td>
                  <td style="color: #0D1B2A; font-size: 14px; font-weight: 600; text-align: right; padding: 10px 0;">${data.taxesReimbursed ? '$0' : '$' + data.annualPropertyTaxes.toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="color: #64748B; font-size: 14px; padding: 10px 0;">Insurance</td>
                  <td style="color: #0D1B2A; font-size: 14px; font-weight: 600; text-align: right; padding: 10px 0;">$${data.annualInsurance.toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="color: #64748B; font-size: 14px; padding: 10px 0;">Maintenance (${data.squareFootage.toLocaleString()} sq ft × $1.75)</td>
                  <td style="color: #0D1B2A; font-size: 14px; font-weight: 600; text-align: right; padding: 10px 0;">$${(data.squareFootage * 1.75).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="color: #004B87; font-size: 16px; font-weight: 700; padding: 15px 0 10px 0;">Net Operating Income</td>
                  <td style="color: #004B87; font-size: 16px; font-weight: 700; text-align: right; padding: 15px 0 10px 0;">$${(data.annualRent - (data.taxesReimbursed ? 0 : data.annualPropertyTaxes) - data.annualInsurance - (data.squareFootage * 1.75)).toLocaleString()}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Next Steps -->
          <tr>
            <td style="padding: 30px; background-color: #F0F9FF; border-top: 2px solid #E5E7EB;">
              <h3 style="color: #0D1B2A; font-size: 18px; margin: 0 0 15px 0;">What Happens Next?</h3>
              <ul style="color: #475569; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Our team will review your property details within 24-48 hours</li>
                <li>We'll connect you with qualified buyers from our nationwide network</li>
                <li>You'll receive a no-obligation cash offer with <strong>zero broker fees</strong></li>
                <li>Close in as few as 45 days with full transparency throughout</li>
              </ul>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 30px; text-align: center;">
              <a href="${SITE_BASE_URL}/contact" style="display: inline-block; background-color: #004B87; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">Contact Us for More Information</a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #F8FAFC; border-top: 2px solid #E5E7EB; text-align: center;">
              <p style="color: #94A3B8; font-size: 12px; margin: 0 0 10px 0;">This valuation is an estimate only and is not a formal appraisal.</p>
              <p style="color: #94A3B8; font-size: 12px; margin: 0 0 10px 0;">We own multiple post offices and charge zero broker fees.</p>
              <p style="color: #94A3B8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Sell My Post Office. All rights reserved.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { httpMethod, body } = event;
  
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const requestData = JSON.parse(body || "{}");
    const validated = submitSchema.parse(requestData);
    
    let valuationData: ValuationData;

    // If ID provided, load from Blobs
    if (validated.id) {
      const store = getStore("valuations");
      const storedData = await store.get(validated.id);
      
      if (!storedData) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: "Valuation not found" }),
        };
      }
      
      const parsed = JSON.parse(storedData);
      valuationData = {
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        propertyAddress: parsed.propertyAddress,
        annualRent: parsed.annualRent,
        annualPropertyTaxes: parsed.annualPropertyTaxes,
        taxesReimbursed: parsed.taxesReimbursed,
        annualInsurance: parsed.annualInsurance,
        squareFootage: parsed.squareFootage,
      };
    } else {
      // Use provided data directly
      valuationData = {
        firstName: validated.firstName || "",
        lastName: validated.lastName || "",
        email: validated.email || "",
        propertyAddress: validated.propertyAddress || "",
        annualRent: validated.annualRent || 0,
        annualPropertyTaxes: validated.annualPropertyTaxes || 0,
        taxesReimbursed: validated.taxesReimbursed || false,
        annualInsurance: validated.annualInsurance || 0,
        squareFootage: validated.squareFootage || 0,
      };
    }

    // Calculate valuations
    const { conservative, optimistic } = calculateValuation(valuationData);

    // Geocode and get Street View
    let streetViewUrl: string | null = null;
    let formattedAddress = valuationData.propertyAddress;
    
    if (valuationData.propertyAddress && GOOGLE_MAPS_API_KEY) {
      const geocoded = await geocodeAddress(valuationData.propertyAddress);
      if (geocoded) {
        formattedAddress = geocoded.formattedAddress;
        streetViewUrl = getStreetViewUrl(geocoded.lat, geocoded.lng);
      }
    }

    // Send email via SendGrid
    if (SENDGRID_API_KEY && valuationData.email) {
      const emailHTML = generateEmailHTML(
        valuationData,
        conservative,
        optimistic,
        streetViewUrl,
        formattedAddress
      );

      const msg = {
        to: valuationData.email,
        from: FROM_EMAIL,
        subject: `Your USPS Property Valuation Report - $${conservative.toLocaleString()} to $${optimistic.toLocaleString()}`,
        html: emailHTML,
      };

      try {
        await sgMail.send(msg);
        console.log(`Email sent successfully to ${valuationData.email}`);
      } catch (emailError: any) {
        console.error("SendGrid error:", emailError);
        // Don't fail the request if email fails
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        conservative,
        optimistic,
        formattedAddress,
      }),
    };

  } catch (error: any) {
    console.error("Error in api-submit:", error);
    
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Validation failed",
          details: error.flatten(),
        }),
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};
