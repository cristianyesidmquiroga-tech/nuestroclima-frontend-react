const LAT = 5.9359;
const LON = -73.7307;

export async function getPronostico() {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&past_hours=6&forecast_hours=14&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  const h = j.hourly;
  return h.time.map((t, i) => ({
    hora: t,
    temp: h.temperature_2m[i],
    hum: h.relative_humidity_2m[i],
    viento: h.wind_speed_10m[i],
    code: h.weather_code[i],
  }));
}
