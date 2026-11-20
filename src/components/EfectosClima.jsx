import { useEffect, useRef } from "react";

function gotaLluvia(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * -h,
    len: Math.random() * 18 + 8,
    speed: Math.random() * 6 + 8,
    alpha: Math.random() * 0.4 + 0.2,
  };
}

function estrella(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h * 0.6,
    r: Math.random() * 1.5 + 0.3,
    alpha: Math.random(),
    blink: Math.random() * 0.02 + 0.005,
    dir: Math.random() > 0.5 ? 1 : -1,
  };
}

export default function EfectosClima({ modo }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let particulas = [];
    let frame = null;

    function dimensionar() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }

    function iniciar() {
      particulas = [];
      const w = canvas.width;
      const h = canvas.height;
      if (modo === "rainy") for (let i = 0; i < 180; i++) particulas.push(gotaLluvia(w, h));
      else if (modo === "night") for (let i = 0; i < 120; i++) particulas.push(estrella(w, h));
    }

    function dibujar() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (modo === "rainy") {
        ctx.strokeStyle = "rgba(180,210,255,0.5)";
        ctx.lineWidth = 1;
        particulas.forEach((p) => {
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.len);
          ctx.stroke();
          p.y += p.speed;
          p.x -= 1;
          if (p.y > h) {
            p.y = Math.random() * -50;
            p.x = Math.random() * w;
          }
        });
        ctx.globalAlpha = 1;
      } else if (modo === "night") {
        particulas.forEach((p) => {
          p.alpha += p.blink * p.dir;
          if (p.alpha > 1 || p.alpha < 0.1) p.dir *= -1;
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      frame = requestAnimationFrame(dibujar);
    }

    function dibujarEstatico() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (modo !== "night") return;
      particulas.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function arrancar() {
      dimensionar();
      iniciar();
      if (frame) cancelAnimationFrame(frame);
      if (modo === "rainy" || modo === "night") {
        if (reduce) dibujarEstatico();
        else dibujar();
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    arrancar();
    window.addEventListener("resize", arrancar);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", arrancar);
    };
  }, [modo]);

  return <canvas ref={canvasRef} className="weather-canvas" aria-hidden="true"></canvas>;
}
