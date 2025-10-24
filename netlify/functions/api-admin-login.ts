import type { Handler } from "@netlify/functions";
import { z } from "zod";
import { signToken, createCookie } from "./_auth";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { username, password } = loginSchema.parse(body);

    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    // Fail fast if admin credentials are not configured
    if (!adminUser || !adminPass) {
      console.error("FATAL: ADMIN_USER and ADMIN_PASS environment variables are required");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    if (username !== adminUser || password !== adminPass) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    const token = signToken({ role: "admin", sub: username });
    const cookie = createCookie(token);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Set-Cookie": cookie,
      },
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid request" }),
    };
  }
};
