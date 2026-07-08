import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width || window.innerWidth;
        canvas.height = height || window.innerHeight;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Matrix characters
    const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabet = katakana.split("");

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);

    // Rain drop positions
    let rainDrops: number[] = [];
    const initRainDrops = () => {
      columns = Math.floor(canvas.width / fontSize);
      rainDrops = [];
      for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * -100; // stagger entrance
      }
    };

    initRainDrops();

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 16, 0.08)"; // trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f7"; // green text
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        
        // Slightly glowing head
        if (Math.random() > 0.98) {
          ctx.fillStyle = "#fff";
        } else if (Math.random() > 0.8) {
          ctx.fillStyle = "#a7f3d0"; // mint/neon
        } else {
          ctx.fillStyle = "#059669"; // matrix green
        }

        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      initRainDrops();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-[0.06] transition-opacity duration-1000"
    />
  );
}
