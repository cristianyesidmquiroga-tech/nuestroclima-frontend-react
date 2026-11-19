# Nuestro Clima — Frontend (React)

Dashboard meteorológico de la finca. Consume la API del backend y muestra el
clima actual, las métricas y el histórico, conservando el diseño del sistema
anterior. Es el frontend del piloto: el mismo contrato puede tener varios
frontends para comparar.

<details>
<summary><b>Read this in English</b></summary>

Weather dashboard for the farm. It consumes the backend API and shows the
current weather, metrics and history, keeping the previous system's design. It
is the pilot's frontend: the same contract can have several frontends to
compare.

</details>

## Stack

React 18 · Vite · consume la API Go (`VITE_API_URL`).

## Desarrollo

```bash
npm install
cp .env.example .env   # VITE_API_URL apunta al backend
npm run dev
```

## Build

```bash
npm run build
```
