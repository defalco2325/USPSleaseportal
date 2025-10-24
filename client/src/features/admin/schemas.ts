import { z } from "zod";

// Lead status types
export const leadStatusSchema = z.enum([
  "New",
  "Qualified",
  "Offer",
  "ClosedWon",
  "ClosedLost",
]);

export type LeadStatus = z.infer<typeof leadStatusSchema>;

// Lead schema
export const leadSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  ownerId: z.string().nullable(),
  status: leadStatusSchema,
  name: z.string(),
  company: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  source: z.string().nullable(),
  tags: z.array(z.string()),
  score: z.number().nullable(),
  revenuePotential: z.number().nullable(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }).nullable(),
  customFields: z.record(z.unknown()).nullable(),
  // Valuation fields (if linked to a valuation)
  valuationId: z.string().nullable(),
  conservativeValue: z.number().nullable(),
  optimisticValue: z.number().nullable(),
});

export type Lead = z.infer<typeof leadSchema>;

export const createLeadSchema = leadSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateLead = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = createLeadSchema.partial();

export type UpdateLead = z.infer<typeof updateLeadSchema>;

// Note schema
export const noteSchema = z.object({
  id: z.string(),
  leadId: z.string(),
  authorId: z.string(),
  body: z.string(),
  createdAt: z.string(),
});

export type Note = z.infer<typeof noteSchema>;

export const createNoteSchema = noteSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateNote = z.infer<typeof createNoteSchema>;

// Task schema
export const taskStatusSchema = z.enum(["Open", "Done"]);
export const taskPrioritySchema = z.enum(["Low", "Med", "High"]);

export const taskSchema = z.object({
  id: z.string(),
  leadId: z.string(),
  assigneeId: z.string().nullable(),
  title: z.string(),
  dueAt: z.string().nullable(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  createdAt: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const createTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateTask = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();

export type UpdateTask = z.infer<typeof updateTaskSchema>;

// User schema (for auth)
export const userRoleSchema = z.enum(["admin", "agent", "viewer"]);

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  avatar: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// List response with pagination
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  });

// Filter params for leads
export const leadFilterSchema = z.object({
  status: leadStatusSchema.optional(),
  ownerId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(50),
});

export type LeadFilter = z.infer<typeof leadFilterSchema>;
