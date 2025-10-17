// src/lib/api.ts
export const API_BASE_URL = "http://localhost:8000";

export async function fetchDeceasedRecords() {
  const res = await fetch(`${API_BASE_URL}/deceased`);
  if (!res.ok) throw new Error("Failed to fetch records");
  return res.json();
}

export async function addDeceasedRecord(payload: any) {
  const res = await fetch(`${API_BASE_URL}/deceased`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add record");
  return res.json();
}

/* --- Storage APIs --- */
export async function fetchStorageUnits() {
  const res = await fetch(`${API_BASE_URL}/storage`);
  if (!res.ok) throw new Error("Failed to fetch storage");
  return res.json();
}

export async function createStorageUnit(payload: any) {
  const res = await fetch(`${API_BASE_URL}/storage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create unit");
  return res.json();
}

export async function assignToUnit(unitId: number, deceasedId: number, deadline?: string) {
  const url = new URL(`${API_BASE_URL}/storage/${unitId}/assign`);
  if (deadline) url.searchParams.append("deadline", deadline);
  // assign via POST with deceased_id as form param for simplicity:
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deceased_id: deceasedId }),
  });
  if (!res.ok) throw new Error("Failed to assign");
  return res.json();
}

export async function releaseUnit(unitId: number) {
  const res = await fetch(`${API_BASE_URL}/storage/${unitId}/release`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to release");
  return res.json();
}

export async function setMaintenance(unitId: number, maintenance = true) {
  const res = await fetch(`${API_BASE_URL}/storage/${unitId}/maintenance?maintenance=${maintenance}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to update maintenance");
  return res.json();
}
