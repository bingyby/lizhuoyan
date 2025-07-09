import React from 'react';

interface PressureGaugeProps {
  value: number;
  max: number;
  unit: string;
  label: string;
  size?: number;
}

export const PressureGauge: React.FC<PressureGaugeProps> = ({
  value,
  max,
  unit,
  label,
  size = 200
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const angle = (percentage / 100) * 270 - 135; // 270度范围，从-135度开始
  
  const getGaugeColor = () => {
    if (percentage > 90) return 'hsl(var(--gauge-danger))';
    if (percentage > 70) return 'hsl(var(--gauge-warning))';
    return 'hsl(var(--gauge-success))';
  };

  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(270 / 360) * circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * (270 / 360) * circumference;

  return (
    <div className="relative flex flex-col items-center p-6">
      <div 
        className="relative bg-gauge-bg rounded-full shadow-[var(--shadow-gauge)] backdrop-blur-sm border border-border"
        style={{ width: size, height: size }}
      >
        {/* 背景圆弧 */}
        <svg
          className="absolute inset-2 transform -rotate-45"
          width={size - 16}
          height={size - 16}
          viewBox={`0 0 ${size - 16} ${size - 16}`}
        >
          <circle
            cx={(size - 16) / 2}
            cy={(size - 16) / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--gauge-track))"
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            className="opacity-30"
          />
          
          {/* 进度圆弧 */}
          <circle
            cx={(size - 16) / 2}
            cy={(size - 16) / 2}
            r={radius}
            fill="none"
            stroke={getGaugeColor()}
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out drop-shadow-lg"
            style={{
              filter: `drop-shadow(0 0 8px ${getGaugeColor()})`
            }}
          />
        </svg>

        {/* 中心数值显示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-foreground mb-1">
            {value.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {unit}
          </div>
        </div>

        {/* 刻度标记 */}
        {Array.from({ length: 6 }, (_, i) => {
          const tickAngle = -135 + (i * 54); // 270度分成5段
          const tickValue = (max / 5) * i;
          const radian = (tickAngle * Math.PI) / 180;
          const x = (size / 2) + (radius - 15) * Math.cos(radian);
          const y = (size / 2) + (radius - 15) * Math.sin(radian);
          
          return (
            <div
              key={i}
              className="absolute text-xs text-muted-foreground font-medium"
              style={{
                left: x - 12,
                top: y - 6,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {tickValue.toFixed(0)}
            </div>
          );
        })}

        {/* 指针 */}
        <div
          className="absolute w-1 bg-gradient-to-t from-accent to-accent/60 rounded-full origin-bottom shadow-lg"
          style={{
            height: radius - 30,
            left: '50%',
            bottom: '50%',
            transform: `translateX(-50%) rotate(${angle}deg)`,
            transformOrigin: 'bottom center',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        
        {/* 中心点 */}
        <div className="absolute w-4 h-4 bg-accent rounded-full shadow-lg"
             style={{
               left: '50%',
               top: '50%',
               transform: 'translate(-50%, -50%)'
             }}
        />
      </div>
      
      {/* 标签 */}
      <div className="mt-4 text-center">
        <div className="text-lg font-semibold text-foreground">{label}</div>
        <div className="text-sm text-muted-foreground">
          最大值: {max} {unit}
        </div>
      </div>
    </div>
  );
};