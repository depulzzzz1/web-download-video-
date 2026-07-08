import { useEffect, useRef, useState } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    
    // Set size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particles array
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }> = [];

    const colors = ["#10b981", "#06b6d4", "#8b5cf6", "#3b82f6"];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Shooting stars
    const shootingStars: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }> = [];

    const addShootingStar = () => {
      if (Math.random() > 0.985 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * (window.innerHeight / 2),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 4,
          opacity: 1,
        });
      }
    };

    const draw = () => {
      // Clear with very slight fade for trail
      ctx.fillStyle = "rgba(6, 7, 13, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Draw futuristic cyber grid lines with glowing horizontal pulses
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Draw shooting stars
      addShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        ctx.strokeStyle = `rgba(6, 182, 212, ${star.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.length, star.y + star.length * 0.6);
        ctx.stroke();

        star.x += star.speed;
        star.y -= star.speed * 0.6;
        star.opacity -= 0.015;

        if (star.opacity <= 0 || star.x > canvas.width || star.y < 0) {
          shootingStars.splice(i, 1);
        }
      }

      // 3. Draw standard glowing floating particles
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around borders
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />
      {/* Interactive radial highlight/spotlight following cursor */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.04), rgba(6, 182, 212, 0.04), rgba(139, 92, 246, 0.03), transparent 80%)`,
        }}
      />
    </>
  );
}
