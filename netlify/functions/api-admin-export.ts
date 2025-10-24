import type { Handler } from "@netlify/functions";
import { requireAdmin } from "./_auth";
import { getValuationsIndex, getLeadsIndex, getJSON, buildCSV } from "./_blobs";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    requireAdmin(event);

    const params = event.queryStringParameters || {};
    const type = params.type || "valuations";

    if (type === "valuations") {
      const valuationsIndex = await getValuationsIndex();
      
      // Fetch full details for each valuation
      const valuationsPromises = valuationsIndex.map(async (indexEntry) => {
        const valuation = await getJSON<any>("valuations", indexEntry.id);
        return valuation || indexEntry;
      });
      const valuations = await Promise.all(valuationsPromises);

      const csvHeaders = [
        "ID",
        "Email",
        "First Name",
        "Last Name",
        "Phone",
        "Address",
        "City",
        "State",
        "ZIP",
        "Annual Rent",
        "Property Taxes",
        "Insurance",
        "Square Footage",
        "Taxes Reimbursed",
        "Stage",
        "Conservative Estimate",
        "Optimistic Estimate",
        "Created At",
        "Updated At",
      ];

      const csvRows = valuations.map(v => [
        v.id || "",
        v.email || "",
        v.firstName || "",
        v.lastName || "",
        v.phone || "",
        v.propertyAddress || v.street || "",
        v.city || "",
        v.state || "",
        v.zip || "",
        v.annualRent || "",
        v.annualPropertyTaxes || "",
        v.annualInsurance || "",
        v.squareFootage || "",
        v.taxesReimbursed ? "Yes" : "No",
        v.stage || "",
        v.lowEstimatedValue || v.conservative || "",
        v.highEstimatedValue || v.optimistic || "",
        v.createdAt || "",
        v.updatedAt || "",
      ]);

      const csv = buildCSV(csvHeaders, csvRows);

      return {
        statusCode: 200,
        headers: {
          ...headers,
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="valuations-${new Date().toISOString().split('T')[0]}.csv"`,
        },
        body: csv,
      };
    }

    if (type === "leads") {
      const leadsIndex = await getLeadsIndex();
      
      // Fetch full details for each lead
      const leadsPromises = leadsIndex.map(async (indexEntry) => {
        const lead = await getJSON<any>("leads", indexEntry.id);
        return lead || indexEntry;
      });
      const leads = await Promise.all(leadsPromises);

      const csvHeaders = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Message",
        "Page",
        "Created At",
      ];

      const csvRows = leads.map(l => [
        l.id || "",
        l.name || "",
        l.email || "",
        l.phone || "",
        l.message || "",
        l.page || "",
        l.createdAt || "",
      ]);

      const csv = buildCSV(csvHeaders, csvRows);

      return {
        statusCode: 200,
        headers: {
          ...headers,
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
        },
        body: csv,
      };
    }

    return {
      statusCode: 400,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid type parameter" }),
    };
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return {
        statusCode: 401,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    console.error("Export error:", error);
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
