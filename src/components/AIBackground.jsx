import React, { useEffect, useRef } from 'react';

export default function AIBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, radius: 80 }); // Reduced mouse connection radius from 150 to 80

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    const maxParticles = 35; // Reduced count by 50% from 75 to 35
    let lastTime = 0;
    const fpsInterval = 1000 / 30; // Lock particles updates to 30 FPS

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        if (!animationFrameId) {
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    handleResize();

    // Create particles representing neural network nodes
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off canvas boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Mouse attraction physics
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseRef.current.radius) {
            const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 207, 255, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    // Connect nodes close to each other
    const connect = () => {
      const length = particles.length;
      for (let a = 0; a < length; a++) {
        for (let b = a + 1; b < length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Reduced connection threshold from 110 to 60px
          if (dist < 60) {
            const alpha = (60 - dist) / 60 * 0.12;
            ctx.strokeStyle = `rgba(0, 207, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }

        // Draw connection to mouse if nearby
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = particles[a].x - mouseRef.current.x;
          const dy = particles[a].y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRef.current.radius) {
            const alpha = (mouseRef.current.radius - dist) / mouseRef.current.radius * 0.15;
            ctx.strokeStyle = `rgba(79, 223, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = (timestamp) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!timestamp) timestamp = performance.now();
      const elapsed = timestamp - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = timestamp - (elapsed % fpsInterval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid pattern (subtle blueprint grid)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 0.5;
      const gridSize = 45;
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

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      connect();
    };

    // Kickstart
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-[#090B14]"
    />
  );
}
