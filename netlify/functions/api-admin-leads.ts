import type { Handler } from "@netlify/functions";
import { z } from "zod";
import { requireAdmin } from "./_auth";
import { getLeadsIndex, removeLeadIndex, addLeadIndex, getJSON, setJSON, deleteJSON } from "./_blobs";

const createLeadSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  page: z.string().optional(),
});

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Content-Type": "application/json",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const path = event.path.replace("/api/admin/leads", "").replace("/.netlify/functions/api-admin-leads", "");
  const pathParts = path.split("/").filter(Boolean);
  const id = pathParts[0];

  // POST /api/admin/leads - Create lead (public or admin)
  if (event.httpMethod === "POST" && !id) {
    try {
      const body = JSON.parse(event.body || "{}");
      const validated = createLeadSchema.parse(body);

      const leadId = `lead:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date().toISOString();

      const lead = {
        id: leadId,
        ...validated,
        createdAt,
      };

      await setJSON("leads", leadId, lead);
      await addLeadIndex({
        id: leadId,
        name: validated.name,
        email: validated.email,
        createdAt,
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(lead),
      };
    } catch (error) {
      console.error("Create lead error:", error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid request" }),
      };
    }
  }

  // All other routes require admin auth
  try {
    requireAdmin(event);

    // GET /api/admin/leads - List with search and pagination
    if (event.httpMethod === "GET" && !id) {
      const params = event.queryStringParameters || {};
      const q = params.q?.toLowerCase() || "";
      const page = parseInt(params.page || "1");
      const limit = parseInt(params.limit || "20");

      let leadsIndex = await getLeadsIndex();

      // Fetch full lead details
      const leadsPromises = leadsIndex.map(async (indexEntry) => {
        const lead = await getJSON<any>("leads", indexEntry.id);
        return lead || indexEntry;
      });
      let leads = await Promise.all(leadsPromises);

      // Search filter (name, email)
      if (q) {
        leads = leads.filter(l => 
          l.name?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q)
        );
      }

      // Sort by createdAt desc
      leads.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Pagination
      const total = leads.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedLeads = leads.slice(startIndex, endIndex);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          data: paginatedLeads,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        }),
      };
    }

    // DELETE /api/admin/leads/:id - Delete lead
    if (event.httpMethod === "DELETE" && id) {
      await deleteJSON("leads", id);
      await removeLeadIndex(id);

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

    console.error("Admin leads error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
