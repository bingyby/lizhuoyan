import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, ArrowRightLeft, Gauge } from 'lucide-react';

interface UnitConversion {
  kPa: number;
  bar: number;
  psi: number;
  mmHg: number;
  inH2O: number;
  'kgf/cm2': number;
}

const conversionFactors = {
  kPa: 1,
  bar: 0.01,
  psi: 0.145038,
  mmHg: 7.50062,
  inH2O: 4.01463,
  'kgf/cm2': 0.0101972
};

const unitLabels = {
  kPa: 'kPa (千帕)',
  bar: 'bar (巴)',
  psi: 'psi (磅每平方英寸)',
  mmHg: 'mmHg (毫米汞柱)',
  inH2O: 'inH2O (英寸水柱)',
  'kgf/cm2': 'kgf/cm² (千克力每平方厘米)'
};

interface UnitConverterProps {
  onUnitChange?: (unit: keyof UnitConversion, value: number) => void;
}

export const UnitConverter: React.FC<UnitConverterProps> = ({ onUnitChange }) => {
  const [inputValue, setInputValue] = useState<string>('100');
  const [inputUnit, setInputUnit] = useState<keyof UnitConversion>('kPa');
  const [results, setResults] = useState<UnitConversion>({
    kPa: 100,
    bar: 1,
    psi: 14.5038,
    mmHg: 750.062,
    inH2O: 401.463,
    'kgf/cm2': 1.01972
  });
  const [prefix, setPrefix] = useState<'k' | 'M' | 'G'>('k');

  const prefixMultipliers = {
    k: 1000,    // kilo
    M: 1000000, // mega
    G: 1000000000 // giga
  };

  useEffect(() => {
    const numValue = parseFloat(inputValue) || 0;
    const baseValue = numValue * prefixMultipliers[prefix];
    const kPaValue = inputUnit === 'kPa' ? baseValue : baseValue / conversionFactors[inputUnit];
    
    const newResults: UnitConversion = {
      kPa: kPaValue,
      bar: kPaValue * conversionFactors.bar,
      psi: kPaValue * conversionFactors.psi,
      mmHg: kPaValue * conversionFactors.mmHg,
      inH2O: kPaValue * conversionFactors.inH2O,
      'kgf/cm2': kPaValue * conversionFactors['kgf/cm2']
    };

    setResults(newResults);
  }, [inputValue, inputUnit, prefix]);

  const formatNumber = (value: number, unit: keyof UnitConversion) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(3)} M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(3)} k`;
    } else if (value < 0.001) {
      return value.toExponential(3);
    } else {
      return value.toFixed(3);
    }
  };

  const handleUnitClick = (unit: keyof UnitConversion) => {
    if (onUnitChange) {
      onUnitChange(unit, results[unit]);
    }
  };

  // 迷你仪表盘组件
  const MiniGauge: React.FC<{ value: number; unit: keyof UnitConversion; isActive: boolean }> = ({ value, unit, isActive }) => {
    const percentage = Math.min((value / 200) * 100, 100); // 假设最大值200
    const angle = (percentage / 100) * 270 - 135;
    
    return (
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg
          className="absolute inset-0 transform -rotate-45"
          width="48"
          height="48"
          viewBox="0 0 48 48"
        >
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="3"
            strokeDasharray="76.4 84"
            className="opacity-30"
          />
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="none"
            stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--accent))"}
            strokeWidth="3"
            strokeDasharray="76.4 84"
            strokeDashoffset={84 - (percentage / 100) * 76.4}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div
          className="absolute w-0.5 bg-accent rounded-full origin-bottom"
          style={{
            height: '14px',
            left: '50%',
            bottom: '50%',
            transform: `translateX(-50%) rotate(${angle}deg)`,
            transformOrigin: 'bottom center',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        <div className="absolute w-1.5 h-1.5 bg-accent rounded-full"
             style={{
               left: '50%',
               top: '50%',
               transform: 'translate(-50%, -50%)'
             }}
        />
      </div>
    );
  };

  return (
    <Card className="h-full shadow-[var(--shadow-card)] border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Calculator className="w-5 h-5 text-primary" />
          压力单位换算器
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 输入区域 */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label htmlFor="input-value" className="text-sm font-medium">
                输入数值
              </Label>
              <Input
                id="input-value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mt-1"
                placeholder="请输入数值"
              />
            </div>
            <div>
              <Label htmlFor="prefix" className="text-sm font-medium">
                级别
              </Label>
              <Select value={prefix} onValueChange={(value: 'k' | 'M' | 'G') => setPrefix(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="k">k (千)</SelectItem>
                  <SelectItem value="M">M (兆)</SelectItem>
                  <SelectItem value="G">G (吉)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="input-unit" className="text-sm font-medium">
              输入单位
            </Label>
            <Select value={inputUnit} onValueChange={(value: keyof UnitConversion) => setInputUnit(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(unitLabels).map(([unit, label]) => (
                  <SelectItem key={unit} value={unit}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 转换图标 */}
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
            <ArrowRightLeft className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>

        {/* 结果显示 */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            换算结果 (点击切换仪表盘单位)
          </h3>
          <div className="grid gap-3">
            {Object.entries(results).map(([unit, value]) => (
              <div
                key={unit}
                onClick={() => handleUnitClick(unit as keyof UnitConversion)}
                className={`flex justify-between items-center p-3 rounded-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
                  unit === inputUnit 
                    ? 'bg-gradient-to-r from-primary/10 to-primary-glow/10 border border-primary/20 shadow-lg' 
                    : 'bg-card border border-border hover:bg-muted/50 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MiniGauge 
                    value={value} 
                    unit={unit as keyof UnitConversion} 
                    isActive={unit === inputUnit}
                  />
                  <div className="text-sm font-medium text-card-foreground">
                    {unitLabels[unit as keyof UnitConversion]}
                  </div>
                </div>
                <div className={`text-sm font-mono ${
                  unit === inputUnit ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}>
                  {formatNumber(value, unit as keyof UnitConversion)}
                  {unit === inputUnit && (
                    <span className="ml-1 text-xs text-accent">●</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 常用换算提示 */}
        <div className="mt-6 p-3 bg-accent/10 rounded-lg border border-accent/20">
          <h4 className="text-xs font-medium text-accent mb-2">常用换算参考</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• 1 bar = 100 kPa = 14.5 psi</div>
            <div>• 1 atm = 101.325 kPa = 760 mmHg</div>
            <div>• 1 psi = 6.895 kPa = 51.715 mmHg</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};