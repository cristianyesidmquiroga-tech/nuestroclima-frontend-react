const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getActual() {
  const res = await fetch(`${BASE}/api/actual`);
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
