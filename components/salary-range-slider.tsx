'use client';

import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';

interface SalaryRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  onChange: (range: [number, number]) => void;
  defaultMin?: number;
  defaultMax?: number;
  formatLabel?: (value: number) => string;
}

export function SalaryRangeSlider({
  min = 0,
  max = 300000,
  step = 5000,
  onChange,
  defaultMin,
  defaultMax,
  formatLabel = (value) => `$${(value / 1000).toFixed(0)}k`,
}: SalaryRangeSliderProps) {
  const [range, setRange] = useState<[number, number]>([
    defaultMin ?? min,
    defaultMax ?? max,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(range);
    }, 300);

    return () => clearTimeout(timer);
  }, [range, onChange]);

  const handleMinChange = (value: number) => {
    if (value <= range[1]) {
      setRange([value, range[1]]);
    }
  };

  const handleMaxChange = (value: number) => {
    if (value >= range[0]) {
      setRange([range[0], value]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-700">Salary Range</label>
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-900">
            {formatLabel(range[0])} - {formatLabel(range[1])}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-600 mb-2 block">Minimum Salary</label>
          <Slider
            min={min}
            max={max}
            step={step}
            value={[range[0]]}
            onValueChange={(value) => handleMinChange(value[0])}
            className="w-full"
          />
          <span className="text-xs text-gray-500 mt-1 block">
            {formatLabel(range[0])}
          </span>
        </div>

        <div>
          <label className="text-xs text-gray-600 mb-2 block">Maximum Salary</label>
          <Slider
            min={min}
            max={max}
            step={step}
            value={[range[1]]}
            onValueChange={(value) => handleMaxChange(value[0])}
            className="w-full"
          />
          <span className="text-xs text-gray-500 mt-1 block">
            {formatLabel(range[1])}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-600 pt-2">
        Range: {formatLabel(min)} - {formatLabel(max)}
      </div>
    </div>
  );
}
