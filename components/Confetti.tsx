import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({ trigger, onComplete }) => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
    }>
  >([]);

  const colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#96ceb4',
    '#feca57',
    '#ff9ff3',
    '#54a0ff',
    '#5f27cd',
    '#00d2d3',
    '#ff9f43',
  ];

  useEffect(() => {
    if (trigger) {
      console.log("🎊 Confetti: Déclenchement de l'animation !");
      const newParticles = [];
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -10,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 20,
        });
      }

      setParticles(newParticles);

      // Animation
      const animate = () => {
        setParticles(prev =>
          prev
            .map(particle => ({
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              vy: particle.vy + 0.1, // gravity
              rotation: particle.rotation + particle.rotationSpeed,
            }))
            .filter(particle => particle.y < window.innerHeight + 50)
        );

        if (particles.length > 0) {
          requestAnimationFrame(animate);
        } else {
          onComplete?.();
        }
      };

      const timeout = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);

      requestAnimationFrame(animate);

      return () => clearTimeout(timeout);
    }
  }, [trigger, onComplete]);

  if (!trigger || particles.length === 0) return null;

  return (
    <div className='fixed inset-0 pointer-events-none' style={{ zIndex: 9999 }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className='absolute rounded-full'
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            transition: 'none',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
