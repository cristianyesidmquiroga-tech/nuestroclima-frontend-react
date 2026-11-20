const IMG = "/static/img/mapa-estaciones";

export function getCondition(data, fecha) {
  const d = data || {};
  const h = (fecha || new Date()).getHours();
  const esNoche = h < 6 || h > 19;
  const lluvia = Number(d.lluvia_hora) > 0;
  const nublado = Number(d.radiacion_solar) < 200 && !esNoche;

  if (esNoche) return { text: "Despejado (noche)", icon: `${IMG}/icon-night.svg`, fx: "night" };
  if (lluvia) return { text: "Lluvia", icon: `${IMG}/icon-rain.svg`, fx: "rainy" };
  if (nublado) return { text: "Nublado", icon: `${IMG}/icon-cloudy.svg`, fx: "cloudy" };
  return { text: "Soleado", icon: `${IMG}/icon-sun.svg`, fx: "sunny" };
}
