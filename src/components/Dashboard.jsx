import { useEffect, useState } from "react";
import { getActual } from "../api/clima.js";

const EJEMPLO = {
  temp_exterior: 18,
  humedad_exterior: 98,
  velocidad_viento: 2.2,
  lluvia_dia: 0,
  uv_index: 0,
  presion_relativa: 816.2,
  sensacion_termica: 26.7,
  punto_rocio: 18.9,
  radiacion_solar: 0,
  direccion_viento: 180,
  rafaga_viento: 5,
};

function num(v, dec = 0) {
  if (v === null || v === undefined) return "--";
  return Number(v).toFixed(dec);
}

function temp(v, unidad, dec = 0) {
  if (v === null || v === undefined) return "--";
  const val = unidad === "F" ? Number(v) * 9 / 5 + 32 : Number(v);
  return val.toFixed(dec);
}

function cardinal(grados) {
  if (grados === null || grados === undefined) return "--";
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return dirs[Math.round(grados / 45) % 8];
}

function horaTexto(d, fmt24) {
  const m = d.getMinutes().toString().padStart(2, "0");
  if (fmt24) return `${d.getHours().toString().padStart(2, "0")}:${m}`;
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  const h = d.getHours() % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function metricas(d, unidad) {
  return [
    { t: "Rayos UV", v: num(d.uv_index) },
    { t: "Presion Atmosferica", v: `${num(d.presion_relativa, 1)} hPa` },
    { t: "Sensacion Termica", v: `${temp(d.sensacion_termica, unidad, 1)} °${unidad}` },
    { t: "Punto de Rocio", v: `${temp(d.punto_rocio, unidad, 1)} °${unidad}` },
    { t: "Radiacion Solar", v: `${num(d.radiacion_solar)} W/m2` },
    { t: "Direccion del Viento", v: cardinal(d.direccion_viento) },
    { t: "Rafagas de Viento", v: `${num(d.rafaga_viento)} km/h` },
  ];
}

const TABS = [
  { id: "temp", label: "Temperatura" },
  { id: "rain", label: "Humedad" },
  { id: "wind", label: "Viento" },
];

export default function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [unidad, setUnidad] = useState("C");
  const [tab, setTab] = useState("temp");
  const [fmt24, setFmt24] = useState(true);
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    getActual()
      .then((d) => setDatos(d || (import.meta.env.DEV ? EJEMPLO : {})))
      .catch(() => setDatos(import.meta.env.DEV ? EJEMPLO : {}));
    const t = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const d = datos || {};

  return (
    <div className="gw-container sky-rainy">
      <div className="scene-backdrop">
        <img src="/static/img/mapa-estaciones/bg_sunny.png" alt="Finca" className="scene-backdrop-img" />
        <div className="scene-backdrop-fade"></div>
      </div>

      <header className="gw-header">
        <div className="gw-location">
          <span className="gw-location-dot">●</span>
          <span className="gw-location-text">Finca Lagunitas, Guavatá, Santander</span>
        </div>
        <div className="gw-header-right">
          <div className="gw-prefs">
            <div className="gw-toggle-group">
              {["C", "F"].map((u) => (
                <button
                  key={u}
                  className={`gw-toggle-btn${unidad === u ? " active" : ""}`}
                  type="button"
                  onClick={() => setUnidad(u)}
                >
                  °{u}
                </button>
              ))}
            </div>
          </div>
          <span className="gw-status-dot online"></span>
        </div>
      </header>

      <section className="gw-main-weather">
        <div className="gw-main-left">
          <img src="/static/img/mapa-estaciones/icon-rain.svg" alt="Clima" className="gw-huge-icon" />
          <div className="gw-temp-box">
            <span className="gw-temp-value">{temp(d.temp_exterior, unidad)}</span>
            <div className="gw-temp-units">
              <span
                className={`gw-unit${unidad === "C" ? " active" : ""}`}
                onClick={() => setUnidad("C")}
              >
                °C
              </span>
              <span className="gw-unit-div">|</span>
              <span
                className={`gw-unit${unidad === "F" ? " active" : ""}`}
                onClick={() => setUnidad("F")}
              >
                °F
              </span>
            </div>
          </div>
        </div>
        <div className="gw-main-right">
          <div className="gw-weather-title">Clima</div>
          <div className="gw-weather-desc">Lluvia</div>
          <div className="gw-clock-widget" onClick={() => setFmt24((v) => !v)}>
            <span>{horaTexto(ahora, fmt24)}</span>
            <span className="gw-clock-fmt">{fmt24 ? "24h" : "12h"}</span>
          </div>
        </div>
      </section>

      <section className="gw-details">
        <p>Lluvia (Hoy): <span>{num(d.lluvia_dia)}</span> mm</p>
        <p>Humedad: <span>{num(d.humedad_exterior)}</span>%</p>
        <p>Viento: a <span>{num(d.velocidad_viento, 1)}</span> km/h</p>
      </section>

      <nav className="gw-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`gw-tab${tab === t.id ? " active" : ""}`}
            type="button"
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="gw-divider"></div>

      <section className="gw-extra-metrics">
        {metricas(d, unidad).map((m) => (
          <div className="gw-extra-card" key={m.t}>
            <div className="gw-extra-header">
              <div className="gw-extra-title">{m.t}</div>
            </div>
            <div className="gw-extra-val">{m.v}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
