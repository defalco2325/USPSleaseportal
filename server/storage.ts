import { type User, type InsertUser, type Valuation, type InsertValuation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  content: {
    intro: string;
    sections: {
      heading: string;
      content: string;
    }[];
    conclusion: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Valuation methods
  createValuation(valuation: InsertValuation): Promise<Valuation>;
  updateValuation(id: string, valuation: Partial<InsertValuation>): Promise<Valuation | undefined>;
  getValuation(id: string): Promise<Valuation | undefined>;
  getAllValuations(): Promise<Valuation[]>;

  // Blog post methods
  createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<Omit<BlogPost, "id" | "createdAt">>): Promise<BlogPost | undefined>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private valuations: Map<string, Valuation>;
  private blogPosts: Map<string, BlogPost>;

  constructor() {
    this.users = new Map();
    this.valuations = new Map();
    this.blogPosts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createValuation(insertValuation: InsertValuation): Promise<Valuation> {
    const id = randomUUID();
    const valuation: Valuation = {
      id,
      firstName: insertValuation.firstName,
      lastName: insertValuation.lastName,
      email: insertValuation.email,
      phone: insertValuation.phone ?? null,
      propertyAddress: insertValuation.propertyAddress ?? null,
      annualRent: insertValuation.annualRent ?? null,
      annualPropertyTaxes: insertValuation.annualPropertyTaxes ?? null,
      taxesReimbursed: insertValuation.taxesReimbursed ?? null,
      annualInsurance: insertValuation.annualInsurance ?? null,
      squareFootage: insertValuation.squareFootage ?? null,
      lowEstimatedValue: insertValuation.lowEstimatedValue ?? null,
      highEstimatedValue: insertValuation.highEstimatedValue ?? null,
      stage1Completed: insertValuation.stage1Completed ?? true,
      stage2Completed: insertValuation.stage2Completed ?? false,
      createdAt: new Date(),
    };
    this.valuations.set(id, valuation);
    return valuation;
  }

  async updateValuation(id: string, updates: Partial<InsertValuation>): Promise<Valuation | undefined> {
    const existing = this.valuations.get(id);
    if (!existing) return undefined;

    // Ensure all fields are properly typed (no undefined values)
    const updated: Valuation = {
      ...existing,
      firstName: updates.firstName !== undefined ? updates.firstName : existing.firstName,
      lastName: updates.lastName !== undefined ? updates.lastName : existing.lastName,
      email: updates.email !== undefined ? updates.email : existing.email,
      phone: updates.phone !== undefined ? updates.phone : existing.phone,
      propertyAddress: updates.propertyAddress !== undefined ? updates.propertyAddress : existing.propertyAddress,
      annualRent: updates.annualRent !== undefined ? updates.annualRent : existing.annualRent,
      annualPropertyTaxes: updates.annualPropertyTaxes !== undefined ? updates.annualPropertyTaxes : existing.annualPropertyTaxes,
      taxesReimbursed: updates.taxesReimbursed !== undefined ? updates.taxesReimbursed : existing.taxesReimbursed,
      annualInsurance: updates.annualInsurance !== undefined ? updates.annualInsurance : existing.annualInsurance,
      squareFootage: updates.squareFootage !== undefined ? updates.squareFootage : existing.squareFootage,
      lowEstimatedValue: updates.lowEstimatedValue !== undefined ? updates.lowEstimatedValue : existing.lowEstimatedValue,
      highEstimatedValue: updates.highEstimatedValue !== undefined ? updates.highEstimatedValue : existing.highEstimatedValue,
      stage1Completed: updates.stage1Completed !== undefined ? updates.stage1Completed : existing.stage1Completed,
      stage2Completed: updates.stage2Completed !== undefined ? updates.stage2Completed : existing.stage2Completed,
    };
    this.valuations.set(id, updated);
    return updated;
  }

  async getValuation(id: string): Promise<Valuation | undefined> {
    return this.valuations.get(id);
  }

  async getAllValuations(): Promise<Valuation[]> {
    return Array.from(this.valuations.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const blogPost: BlogPost = {
      ...post,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: string, updates: Partial<Omit<BlogPost, "id" | "createdAt">>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;

    const updated: BlogPost = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
}

export const storage = new MemStorage();
