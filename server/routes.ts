import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertValuationSchema } from "@shared/schema";
import { z } from "zod";

// Schema for validating PATCH updates
const updateValuationSchema = insertValuationSchema.partial().extend({
  // Coerce numeric fields to ensure type safety
  annualRent: z.coerce.number().optional().nullable(),
  annualPropertyTaxes: z.coerce.number().optional().nullable(),
  annualInsurance: z.coerce.number().optional().nullable(),
  squareFootage: z.coerce.number().optional().nullable(),
  lowEstimatedValue: z.coerce.number().optional().nullable(),
  highEstimatedValue: z.coerce.number().optional().nullable(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Valuation endpoints
  app.post("/api/valuations", async (req, res) => {
    try {
      const validatedData = insertValuationSchema.parse(req.body);
      const valuation = await storage.createValuation(validatedData);
      res.json(valuation);
    } catch (error) {
      console.error("Error creating valuation:", error);
      res.status(400).json({ error: "Invalid valuation data" });
    }
  });

  app.patch("/api/valuations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate and coerce the update payload
      const validatedUpdates = updateValuationSchema.parse(req.body);
      
      // Normalize undefined to null for nullable fields
      const normalizedUpdates = {
        ...validatedUpdates,
        phone: validatedUpdates.phone ?? null,
        propertyAddress: validatedUpdates.propertyAddress ?? null,
        annualRent: validatedUpdates.annualRent ?? null,
        annualPropertyTaxes: validatedUpdates.annualPropertyTaxes ?? null,
        taxesReimbursed: validatedUpdates.taxesReimbursed ?? null,
        annualInsurance: validatedUpdates.annualInsurance ?? null,
        squareFootage: validatedUpdates.squareFootage ?? null,
        lowEstimatedValue: validatedUpdates.lowEstimatedValue ?? null,
        highEstimatedValue: validatedUpdates.highEstimatedValue ?? null,
      };
      
      const valuation = await storage.updateValuation(id, normalizedUpdates);
      
      if (!valuation) {
        res.status(404).json({ error: "Valuation not found" });
        return;
      }
      
      res.json(valuation);
    } catch (error) {
      console.error("Error updating valuation:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        res.status(400).json({ error: "Invalid update data" });
      }
    }
  });

  app.get("/api/valuations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const valuation = await storage.getValuation(id);
      
      if (!valuation) {
        res.status(404).json({ error: "Valuation not found" });
        return;
      }
      
      res.json(valuation);
    } catch (error) {
      console.error("Error fetching valuation:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/valuations", async (req, res) => {
    try {
      const valuations = await storage.getAllValuations();
      res.json(valuations);
    } catch (error) {
      console.error("Error fetching valuations:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
