const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getComparativas() {
  const res = await fetch(`${BASE}/api/stats/comparative`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
