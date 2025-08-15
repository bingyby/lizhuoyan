import React from 'react';

interface PressureGaugeProps {
  value: number;
  max: number;
  unit: string;
  label: string;
  size?: number;
  displayValue?: number; // 用于显示换算后的值
}

export const PressureGauge: React.FC<PressureGaugeProps> = ({
  value,
  max,
  unit,
  label,
  size = 200,
  displayValue
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getGaugeColor = () => {
    if (percentage > 90) return 'hsl(var(--gauge-danger))';
    if (percentage > 70) return 'hsl(var(--gauge-warning))';
    return 'hsl(var(--gauge-success))';
  };

  const barWidth = 400; // 条形仪表盘宽度
  const barHeight = 40; // 条形仪表盘高度

  return (
    <div className="relative flex flex-col items-center p-6 w-full">
      {/* 标签 */}
      <div className="mb-6 text-center">
        <div className="text-lg font-semibold text-foreground">{label}</div>
        <div className="text-sm text-muted-foreground">
          量程: 0 - {displayValue ? (max * (displayValue / value)).toFixed(0) : max} {unit}
        </div>
      </div>

      {/* 水平条形仪表盘 */}
      <div className="relative w-full max-w-lg">
        {/* 背景条 */}
        <div 
          className="relative bg-gauge-bg rounded-full shadow-[var(--shadow-gauge)] backdrop-blur-sm border border-border overflow-hidden"
          style={{ width: barWidth, height: barHeight }}
        >
          {/* 进度条 */}
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${getGaugeColor()}, ${getGaugeColor()}90)`,
              boxShadow: `0 0 12px ${getGaugeColor()}60`
            }}
          />
          
          {/* 刻度标记 */}
          {Array.from({ length: 7 }, (_, i) => {
            const tickPosition = (i / 6) * 100; // 6段，7个刻度点
            const tickValue = (max / 6) * i;
            
            return (
              <div
                key={i}
                className="absolute top-0 w-0.5 h-full bg-border opacity-60"
                style={{ left: `${tickPosition}%` }}
              />
            );
          })}
        </div>

        {/* 刻度数值 */}
        <div className="flex justify-between mt-2 px-1">
          {Array.from({ length: 7 }, (_, i) => {
            const tickValue = (max / 6) * i;
            
            return (
              <div
                key={i}
                className="text-xs text-muted-foreground font-medium"
              >
                {displayValue ? ((max / 6) * i * (displayValue / value)).toFixed(0) : tickValue.toFixed(0)}
              </div>
            );
          })}
        </div>

        {/* 当前数值显示 */}
        <div className="flex items-center justify-center mt-4 space-x-2">
          <div className="text-3xl font-bold text-foreground transition-all duration-500">
            {displayValue ? displayValue.toFixed(1) : value.toFixed(1)}
          </div>
          <div className="text-lg text-muted-foreground font-medium">
            {unit}
          </div>
        </div>
      </div>
    </div>
  );
};