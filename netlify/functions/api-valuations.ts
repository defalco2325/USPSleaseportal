import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { z } from "zod";

// Validation schemas
const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  stage1Completed: z.boolean().default(true),
  stage2Completed: z.boolean().default(false),
});

const propertySchema = z.object({
  propertyAddress: z.string().min(1, "Property address is required"),
  annualRent: z.coerce.number().min(0, "Annual rent must be positive"),
  annualPropertyTaxes: z.coerce.number().min(0, "Property taxes must be positive"),
  taxesReimbursed: z.boolean().default(false),
  annualInsurance: z.coerce.number().min(0, "Insurance cost must be positive"),
  squareFootage: z.coerce.number().min(1, "Square footage must be positive"),
  lowEstimatedValue: z.coerce.number().optional().nullable(),
  highEstimatedValue: z.coerce.number().optional().nullable(),
  stage2Completed: z.boolean().default(true),
});

const updateSchema = contactSchema.partial().merge(propertySchema.partial());

interface Valuation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  propertyAddress: string | null;
  annualRent: number | null;
  annualPropertyTaxes: number | null;
  taxesReimbursed: boolean | null;
  annualInsurance: number | null;
  squareFootage: number | null;
  lowEstimatedValue: number | null;
  highEstimatedValue: number | null;
  stage1Completed: boolean;
  stage2Completed: boolean;
  createdAt: string;
  updatedAt: string;
}

function generateId(): string {
  return `val_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { httpMethod, path, body } = event;
  
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Content-Type": "application/json",
  };

  if (httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    const store = getStore("valuations");
    
    // Extract ID from path if present (e.g., /api/valuations/val_123)
    const pathParts = path.split("/");
    const id = pathParts[pathParts.length - 1];
    const hasId = id && id.startsWith("val_");

    // POST /api/valuations - Create new valuation (Stage 1)
    if (httpMethod === "POST" && !hasId) {
      const data = JSON.parse(body || "{}");
      const validatedData = contactSchema.parse(data);
      
      const valuationId = generateId();
      const now = new Date().toISOString();
      
      const valuation: Valuation = {
        id: valuationId,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        propertyAddress: null,
        annualRent: null,
        annualPropertyTaxes: null,
        taxesReimbursed: null,
        annualInsurance: null,
        squareFootage: null,
        lowEstimatedValue: null,
        highEstimatedValue: null,
        stage1Completed: validatedData.stage1Completed,
        stage2Completed: validatedData.stage2Completed,
        createdAt: now,
        updatedAt: now,
      };
      
      await store.set(valuationId, JSON.stringify(valuation));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(valuation),
      };
    }

    // GET /api/valuations/:id - Retrieve valuation
    if (httpMethod === "GET" && hasId) {
      const data = await store.get(id);
      
      if (!data) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: "Valuation not found" }),
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: data,
      };
    }

    // PATCH /api/valuations/:id - Update valuation (Stage 2)
    if (httpMethod === "PATCH" && hasId) {
      const existingData = await store.get(id);
      
      if (!existingData) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: "Valuation not found" }),
        };
      }
      
      const existing: Valuation = JSON.parse(existingData);
      const updates = JSON.parse(body || "{}");
      const validatedUpdates = updateSchema.parse(updates);
      
      // Merge updates with existing data
      const updated: Valuation = {
        ...existing,
        firstName: validatedUpdates.firstName !== undefined ? validatedUpdates.firstName : existing.firstName,
        lastName: validatedUpdates.lastName !== undefined ? validatedUpdates.lastName : existing.lastName,
        email: validatedUpdates.email !== undefined ? validatedUpdates.email : existing.email,
        phone: validatedUpdates.phone !== undefined ? validatedUpdates.phone || null : existing.phone,
        propertyAddress: validatedUpdates.propertyAddress !== undefined ? validatedUpdates.propertyAddress || null : existing.propertyAddress,
        annualRent: validatedUpdates.annualRent !== undefined ? validatedUpdates.annualRent || null : existing.annualRent,
        annualPropertyTaxes: validatedUpdates.annualPropertyTaxes !== undefined ? validatedUpdates.annualPropertyTaxes || null : existing.annualPropertyTaxes,
        taxesReimbursed: validatedUpdates.taxesReimbursed !== undefined ? validatedUpdates.taxesReimbursed || null : existing.taxesReimbursed,
        annualInsurance: validatedUpdates.annualInsurance !== undefined ? validatedUpdates.annualInsurance || null : existing.annualInsurance,
        squareFootage: validatedUpdates.squareFootage !== undefined ? validatedUpdates.squareFootage || null : existing.squareFootage,
        lowEstimatedValue: validatedUpdates.lowEstimatedValue !== undefined ? validatedUpdates.lowEstimatedValue || null : existing.lowEstimatedValue,
        highEstimatedValue: validatedUpdates.highEstimatedValue !== undefined ? validatedUpdates.highEstimatedValue || null : existing.highEstimatedValue,
        stage1Completed: validatedUpdates.stage1Completed !== undefined ? validatedUpdates.stage1Completed : existing.stage1Completed,
        stage2Completed: validatedUpdates.stage2Completed !== undefined ? validatedUpdates.stage2Completed : existing.stage2Completed,
        updatedAt: new Date().toISOString(),
      };
      
      await store.set(id, JSON.stringify(updated));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updated),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };

  } catch (error: any) {
    console.error("Error in api-valuations:", error);
    
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
