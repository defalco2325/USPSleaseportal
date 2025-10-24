import type { Handler } from "@netlify/functions";
import { requireAdmin } from "./_auth";

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
    const payload = requireAdmin(event);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        role: payload.role,
        user: {
          email: payload.sub,
        },
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

    console.error("Auth check error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
