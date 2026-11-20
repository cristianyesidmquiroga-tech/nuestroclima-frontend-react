import { useEffect, useMemo, useState } from "react";
import { getComparativas } from "../api/historial.js";

const EJEMPLO = {
  semanal: [
    { semana: "2026-47", temp_max: 24, temp_min: 15, lluvia_max_diaria: 30 },
    { semana: "2026-46", temp_max: 28, temp_min: 14, lluvia_max_diaria: 15 },
    { semana: "2026-45", temp_max: 25, temp_min: 16, lluvia_max_diaria: 8 },
    { semana: "2026-44", temp_max: 29, temp_min: 13, lluvia_max_diaria: 22 },
    { semana: "2026-43", temp_max: 26, temp_min: 15, lluvia_max_diaria: 4 },
    { semana: "2026-42", temp_max: 27, temp_min: 14, lluvia_max_diaria: 12 },
  ],
  mensual: [
    { mes: "2026-11", temp_max: 25, temp_min: 16, lluvia_max_diaria: 35 },
    { mes: "2026-10", temp_max: 28, temp_min: 14, lluvia_max_diaria: 28 },
    { mes: "2026-09", temp_max: 26, temp_min: 15, lluvia_max_diaria: 32 },
    { mes: "2026-08", temp_max: 29, temp_min: 13, lluvia_max_diaria: 20 },
    { mes: "2026-07", temp_max: 27, temp_min: 14, lluvia_max_diaria: 18 },
    { mes: "2026-06", temp_max: 28, temp_min: 13, lluvia_max_diaria: 25 },
  ],
};

const TIPOS = [
  { id: "semanal", label: "Semanas" },
  { id: "mensual", label: "Meses" },
];

function etiqueta(d, tipo) {
  if (tipo === "mensual") {
    const [, m] = d.mes.split("-");
    return ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][Number(m) - 1] || d.mes;
  }
  return "S" + d.semana.split("-")[1];
}

function escalaTemp(serie) {
  const vals = serie.flatMap((d) => [d.temp_max, d.temp_min]).filter((v) => v != null);
  if (!vals.length) return { lo: 0, alto: 1 };
  const lo = Math.min(...vals) - 1;
  const alto = Math.max(...vals) + 1;
  return { lo, alto: alto === lo ? lo + 1 : alto };
}

function puntos(serie, campo, esc) {
  const n = serie.length;
  return serie
    .map((d, i) => {
      if (d[campo] == null) return null;
      const x = n === 1 ? 50 : (i / (n - 1)) * 100;
      const y = 100 - ((d[campo] - esc.lo) / (esc.alto - esc.lo)) * 100;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .filter(Boolean)
    .join(" ");
}

export default function HistorialPanel() {
  const [tipo, setTipo] = useState("semanal");
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    getComparativas()
      .then((d) => setDatos(d && (d.semanal?.length || d.mensual?.length) ? d : (import.meta.env.DEV ? EJEMPLO : {})))
      .catch(() => setDatos(import.meta.env.DEV ? EJEMPLO : {}));
  }, []);

  const serie = useMemo(() => {
    const arr = (datos && datos[tipo]) || [];
    return [...arr].reverse();
  }, [datos, tipo]);

  if (!datos) return null;
  if (serie.length === 0) return null;

  const esc = escalaTemp(serie);
  const lluviaMax = Math.max(1, ...serie.map((d) => d.lluvia_max_diaria || 0));
  const ancho = 100 / serie.length;
  const temps = serie.flatMap((d) => [d.temp_max, d.temp_min]).filter((v) => v != null);
  const tMax = temps.length ? Math.max(...temps) : null;
  const tMin = temps.length ? Math.min(...temps) : null;
  const lluvia = Math.max(0, ...serie.map((d) => d.lluvia_max_diaria || 0));

  return (
    <section className="gw-history-panel">
      <div className="gw-history-header">
        <h3 className="gw-history-title">Analisis Historico</h3>
        <div className="gw-history-filters">
          {TIPOS.map((t) => (
            <button
              key={t.id}
              className={`gw-filter-btn${tipo === t.id ? " active" : ""}`}
              type="button"
              onClick={() => setTipo(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="gw-history-chart-container">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
          {serie.map((d, i) => {
            const h = ((d.lluvia_max_diaria || 0) / lluviaMax) * 100;
            return (
              <rect
                key={i}
                x={i * ancho + ancho * 0.25}
                y={100 - h}
                width={ancho * 0.5}
                height={h}
                fill="rgba(138,180,248,0.35)"
              />
            );
          })}
          <polyline
            points={puntos(serie, "temp_max", esc)}
            fill="none"
            stroke="#fbbc04"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points={puntos(serie, "temp_min", esc)}
            fill="none"
            stroke="rgba(251,188,4,0.45)"
            strokeWidth="2"
            strokeDasharray="4 3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="gw-history-labels">
        {serie.map((d, i) => (
          <span key={i}>{etiqueta(d, tipo)}</span>
        ))}
      </div>

      <div className="gw-history-analysis">
        <strong>Resumen ({tipo === "mensual" ? "ultimos meses" : "ultimas semanas"}):</strong>
        <br />
        Temp maxima {tMax != null ? Math.round(tMax) : "--"}°, minima {tMin != null ? Math.round(tMin) : "--"}°
        <br />
        Lluvia maxima en un dia {Math.round(lluvia)} mm
      </div>
    </section>
  );
}
