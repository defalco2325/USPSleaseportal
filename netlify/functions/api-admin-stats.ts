import type { Handler } from "@netlify/functions";
import { requireAdmin } from "./_auth";
import { getValuationsIndex, getLeadsIndex } from "./_blobs";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    requireAdmin(event);

    const valuations = await getValuationsIndex();
    const leads = await getLeadsIndex();

    const totalValuations = valuations.length;
    const completedReports = valuations.filter(
      v => v.stage === 3 || (v.conservative && v.optimistic)
    ).length;
    const leadsTotal = leads.length;
    const conversionRate = totalValuations > 0 
      ? Math.round((completedReports / totalValuations) * 100) 
      : 0;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        totalValuations,
        completedReports,
        leadsTotal,
        conversionRate,
      }),
    };
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    if (error.message === "FORBIDDEN") {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: "Forbidden" }),
      };
    }

    console.error("Stats error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
