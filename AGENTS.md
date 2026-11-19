# AGENTS.md

Frontend de **Nuestro Clima**: el dashboard de la finca en React, que consume la
API del backend. Conserva el diseño del dashboard del sistema anterior (los CSS
`base`, `header-current` y `tabs-charts` se trajeron tal cual).

## Stack

- React 18, Vite. Sin framework de UI: CSS propio con clases `gw-*`.
- La API se configura con `VITE_API_URL`.

## Estructura

- `src/components/` vistas y componentes.
- `src/api/` cliente HTTP hacia el backend.
- `src/styles/` CSS del dashboard (conservado del sistema anterior).
- `public/static/img/` imágenes del dashboard.

## Reglas

- Una contribución por funcionalidad; commits en español `tipo: descripcion`.
- Todo cambio entra por Pull Request; se fusiona solo con `pruebas` y `codeql`
  en verde (squash y borrar rama). Nada de push directo a `main`.
- Nada de `git push --force` ni reescribir historial publicado.
- Sin emojis en la interfaz ni en los entregables.
- Cambios visuales: verificar en navegador (móvil y escritorio) antes de dar por
  terminado. No inventar datos; si un dato no existe, se oculta o muestra vacío.
- El `.env` real nunca se sube; solo `.env.example`.
