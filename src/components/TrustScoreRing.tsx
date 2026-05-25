import React, { useEffect, useState } from 'react';

interface TrustScoreRingProps {
  score: number;
  label: string;
  color: 'red' | 'green' | 'amber' | 'cyan';
  size?: number;
}

export const TrustScoreRing: React.FC<TrustScoreRingProps> = ({ score, label, color, size = 120 }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = Math.abs(Math.floor(duration / score));
    
    if (score === 0) return;

    const timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start >= score) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color mappings
  const strokeColorMap = {
    red: '#ff3d5a',
    green: '#00e682',
    amber: '#f0a500',
    cyan: '#00cfff',
  };

  const glowColorMap = {
    red: 'rgba(255, 61, 90, 0.3)',
    green: 'rgba(0, 230, 130, 0.3)',
    amber: 'rgba(240, 165, 0, 0.3)',
    cyan: 'rgba(0, 207, 255, 0.3)',
  };

  const activeColor = strokeColorMap[color];
  const activeGlow = glowColorMap[color];

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="relative flex items-center justify-center" 
        style={{ width: size, height: size }}
      >
        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90"
        >
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Animated Value Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${activeGlow})`,
              transition: 'stroke-dashoffset 0.1s ease',
            }}
          />
        </svg>
        {/* Core Value Overlay */}
        <span 
          className="absolute font-display text-3xl font-extrabold"
          style={{ color: activeColor }}
        >
          {displayScore}%
        </span>
      </div>
      <span className="text-mono mt-3 text-[10px] uppercase tracking-wider text-text3 font-bold">
        {label}
      </span>
    </div>
  );
};
export default TrustScoreRing;
