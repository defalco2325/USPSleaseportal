import { getStore } from "@netlify/blobs";

const VALUATIONS_INDEX = "vals:index";
const LEADS_INDEX = "leads:index";

export interface ValuationIndexEntry {
  id: string;
  email: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  stage: number;
  conservative?: number;
  optimistic?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeadIndexEntry {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function getJSON<T>(storeName: string, key: string): Promise<T | null> {
  const store = getStore(storeName);
  const data = await store.get(key, { type: "text" });
  
  if (!data) return null;
  
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export async function setJSON(storeName: string, key: string, value: any): Promise<void> {
  const store = getStore(storeName);
  await store.set(key, JSON.stringify(value));
}

export async function deleteJSON(storeName: string, key: string): Promise<void> {
  const store = getStore(storeName);
  await store.delete(key);
}

export async function getValuationsIndex(): Promise<ValuationIndexEntry[]> {
  const index = await getJSON<ValuationIndexEntry[]>("valuations", VALUATIONS_INDEX);
  return index || [];
}

export async function setValuationsIndex(index: ValuationIndexEntry[]): Promise<void> {
  await setJSON("valuations", VALUATIONS_INDEX, index);
}

export async function addOrUpdateValuationIndex(entry: ValuationIndexEntry): Promise<void> {
  const index = await getValuationsIndex();
  const existingIndex = index.findIndex(v => v.id === entry.id);
  
  if (existingIndex >= 0) {
    index[existingIndex] = entry;
  } else {
    index.push(entry);
  }
  
  await setValuationsIndex(index);
}

export async function removeValuationIndex(id: string): Promise<void> {
  const index = await getValuationsIndex();
  const filtered = index.filter(v => v.id !== id);
  await setValuationsIndex(filtered);
}

export async function getLeadsIndex(): Promise<LeadIndexEntry[]> {
  const index = await getJSON<LeadIndexEntry[]>("leads", LEADS_INDEX);
  return index || [];
}

export async function setLeadsIndex(index: LeadIndexEntry[]): Promise<void> {
  await setJSON("leads", LEADS_INDEX, index);
}

export async function addLeadIndex(entry: LeadIndexEntry): Promise<void> {
  const index = await getLeadsIndex();
  index.push(entry);
  await setLeadsIndex(index);
}

export async function removeLeadIndex(id: string): Promise<void> {
  const index = await getLeadsIndex();
  const filtered = index.filter(l => l.id !== id);
  await setLeadsIndex(filtered);
}

export function buildCSV(headers: string[], rows: string[][]): string {
  const csvHeaders = headers.join(",");
  const csvRows = rows.map(row => 
    row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const escaped = String(cell || "").replace(/"/g, '""');
      return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
    }).join(",")
  );
  
  return [csvHeaders, ...csvRows].join("\n");
}
