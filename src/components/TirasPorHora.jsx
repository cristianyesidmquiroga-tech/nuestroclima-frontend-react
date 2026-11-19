import { useEffect, useRef, useState } from "react";
import { getPronostico } from "../api/pronostico.js";

const IMG = "/static/img/mapa-estaciones";

function horaCorta(iso) {
  return iso.slice(11, 16);
}

function ahoraClave() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(
    n.getDate()
  ).padStart(2, "0")}T${String(n.getHours()).padStart(2, "0")}`;
}

function valorMetrica(p, tab) {
  if (tab === "rain") return `${Math.round(p.hum)}%`;
  if (tab === "wind") return `${Math.round(p.viento)}`;
  return `${Math.round(p.temp)}°`;
}

function iconoClima(code, iso) {
  const h = Number(iso.slice(11, 13));
  const noche = h < 6 || h >= 18;
  if (code >= 51) return `${IMG}/icon-rain.svg`;
  if (code >= 2) return `${IMG}/icon-cloudy.svg`;
  return noche ? `${IMG}/icon-night.svg` : `${IMG}/icon-sun.svg`;
}

function centrarEnAhora(cont) {
  if (!cont) return;
  const hoy = cont.querySelector(".today");
  if (!hoy || !cont.clientWidth) return;
  const prev = cont.style.scrollBehavior;
  cont.style.scrollBehavior = "auto";
  const cR = cont.getBoundingClientRect();
  const hR = hoy.getBoundingClientRect();
  cont.scrollLeft += hR.left - cR.left - (cont.clientWidth - hoy.offsetWidth) / 2;
  cont.style.scrollBehavior = prev;
}

export default function TirasPorHora({ tab }) {
  const [horas, setHoras] = useState([]);
  const metricaRef = useRef(null);
  const pronosticoRef = useRef(null);
  const clave = ahoraClave();

  useEffect(() => {
    getPronostico()
      .then(setHoras)
      .catch(() => setHoras([]));
  }, []);

  useEffect(() => {
    centrarEnAhora(metricaRef.current);
    centrarEnAhora(pronosticoRef.current);
  }, [horas, tab]);

  if (horas.length === 0) return null;

  return (
    <>
      <section className="gw-chart-container">
        <div className="gw-wind-container" ref={metricaRef}>
          {horas.map((p) => {
            const ahora = p.hora.slice(0, 13) === clave;
            return (
              <div className={`gw-wind-col${ahora ? " today" : ""}`} key={p.hora}>
                <div className="gw-wind-speed">{valorMetrica(p, tab)}</div>
                <div className="gw-wind-time">{ahora ? "Ahora" : horaCorta(p.hora)}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="gw-forecast-row" ref={pronosticoRef}>
        {horas.map((p) => {
          const ahora = p.hora.slice(0, 13) === clave;
          return (
            <div className={`gw-day-col${ahora ? " today" : ""}`} key={p.hora}>
              <div className="gw-day-name">{ahora ? "Ahora" : horaCorta(p.hora)}</div>
              <img src={iconoClima(p.code, p.hora)} className="gw-day-icon" alt="Clima" />
              <div className="gw-day-temps">
                <span className="gw-temp-high">{Math.round(p.temp)}°</span>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
