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

function cardinal(grados) {
  if (grados === null || grados === undefined) return "--";
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return dirs[Math.round(grados / 45) % 8];
}

function metricas(d) {
  return [
    { t: "Rayos UV", v: num(d.uv_index), info: "Rayos ultravioleta del sol. Entre mas alto, mas dañino para la piel.", esc: "0-2 Bajo | 3-5 Moderado | 6+ Alto" },
    { t: "Presion Atmosferica", v: `${num(d.presion_relativa, 1)} hPa`, info: "El peso del aire sobre nosotros. Normal cerca de 1013 hPa.", esc: "Sube: buen tiempo | Baja: lluvia o tormenta" },
    { t: "Sensacion Termica", v: `${num(d.sensacion_termica, 1)} °C`, info: "Como se siente el clima en el cuerpo: el sol, el viento y la humedad lo cambian.", esc: "Puede sentirse hasta 5 °C mas de lo real" },
    { t: "Punto de Rocio", v: `${num(d.punto_rocio, 1)} °C`, info: "Temperatura donde el aire forma goticas de agua. Mide que tan humedo se siente.", esc: "<10 °C seco | 15-20 humedo | >20 pesado" },
    { t: "Radiacion Solar", v: `${num(d.radiacion_solar)} W/m2`, info: "La energia del sol que llega al suelo.", esc: "0 noche | 500-800 normal | 1000+ medio dia" },
    { t: "Direccion del Viento", v: cardinal(d.direccion_viento), info: "De donde viene el viento.", esc: "N Norte, S Sur, E Este, O Oeste" },
    { t: "Rafagas de Viento", v: `${num(d.rafaga_viento)} km/h`, info: "La rafaga mas fuerte en los ultimos minutos.", esc: "0-15 brisa | 15-30 normal | 30-50 ventarron | 50+ fuerte" },
  ];
}

export default function Dashboard() {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    getActual()
      .then((d) => setDatos(d || (import.meta.env.DEV ? EJEMPLO : {})))
      .catch(() => setDatos(import.meta.env.DEV ? EJEMPLO : {}));
  }, []);

  const d = datos || {};

  return (
    <div className="gw-container sky-rainy">
      <div className="scene-backdrop">
        <img
          src="/static/img/mapa-estaciones/bg_sunny.png"
          alt="Finca"
          className="scene-backdrop-img"
        />
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
              <button className="gw-toggle-btn active" type="button">°C</button>
              <button className="gw-toggle-btn" type="button">°F</button>
            </div>
          </div>
          <span className="gw-status-dot online"></span>
        </div>
      </header>

      <section className="gw-main-weather">
        <div className="gw-main-left">
          <img
            src="/static/img/mapa-estaciones/icon-rain.svg"
            alt="Clima"
            className="gw-huge-icon"
          />
          <div className="gw-temp-box">
            <span className="gw-temp-value">{num(d.temp_exterior)}</span>
            <div className="gw-temp-units">
              <span className="gw-unit active">°C</span>
              <span className="gw-unit-div">|</span>
              <span className="gw-unit">°F</span>
            </div>
          </div>
        </div>
        <div className="gw-main-right">
          <div className="gw-weather-title">Clima</div>
          <div className="gw-weather-desc">Lluvia</div>
        </div>
      </section>

      <section className="gw-details">
        <p>Lluvia (Hoy): <span>{num(d.lluvia_dia)}</span> mm</p>
        <p>Humedad: <span>{num(d.humedad_exterior)}</span>%</p>
        <p>Viento: a <span>{num(d.velocidad_viento, 1)}</span> km/h</p>
      </section>

      <nav className="gw-tabs">
        <button className="gw-tab active" type="button">Temperatura</button>
        <button className="gw-tab" type="button">Humedad</button>
        <button className="gw-tab" type="button">Viento</button>
      </nav>

      <div className="gw-divider"></div>

      <section className="gw-extra-metrics">
        {metricas(d).map((m) => (
          <div className="gw-extra-card" key={m.t}>
            <div className="gw-extra-header">
              <div className="gw-extra-title">{m.t}</div>
            </div>
            <div className="gw-extra-val">{m.v}</div>
            <div className="gw-info-popover">
              <strong>{m.info}</strong>
              <div className="gw-info-scale">{m.esc}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
