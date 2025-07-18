import React from 'react';
import { Button } from '@/components/ui/button';

const units = [
  { key: 'kPa', label: 'kPa', fullName: '千帕' },
  { key: 'bar', label: 'bar', fullName: '巴' },
  { key: 'psi', label: 'psi', fullName: '磅每平方英寸' },
  { key: 'mmHg', label: 'mmHg', fullName: '毫米汞柱' },
  { key: 'inH2O', label: 'inH2O', fullName: '英寸水柱' },
  { key: 'kgf/cm2', label: 'kgf/cm²', fullName: '千克力每平方厘米' }
];

interface UnitConverterProps {
  currentUnit: string;
  onUnitChange?: (unit: string) => void;
}

export const UnitConverter: React.FC<UnitConverterProps> = ({ currentUnit, onUnitChange }) => {
  const handleUnitClick = (unit: string) => {
    if (onUnitChange) {
      onUnitChange(unit);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {units.map((unit) => (
        <Button
          key={unit.key}
          variant={currentUnit === unit.key ? "default" : "outline"}
          size="sm"
          onClick={() => handleUnitClick(unit.key)}
          className={`
            min-w-20 h-10 text-sm font-medium transition-all duration-200
            ${currentUnit === unit.key 
              ? 'bg-primary text-primary-foreground shadow-md scale-105' 
              : 'hover:scale-105 hover:bg-muted'
            }
          `}
        >
          {unit.label}
        </Button>
      ))}
    </div>
  );
};