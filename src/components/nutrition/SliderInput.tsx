import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChangeValue: (v: number) => void;
  displayClass?: string;
}

export default function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChangeValue,
  displayClass = 'font-display text-xl tabular',
}: SliderInputProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setDraft(String(value));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commit = () => {
    const v = parseFloat(draft);
    if (!isNaN(v)) onChangeValue(Math.min(max, Math.max(min, v)));
    setEditing(false);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {editing ? (
          <input
            ref={inputRef}
            type="number"
            value={draft}
            step={step}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') setEditing(false);
            }}
            className="w-24 h-8 px-2 rounded-lg bg-secondary border border-border text-right tabular text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        ) : (
          <button
            onClick={startEdit}
            title="Нажмите, чтобы ввести вручную"
            className={`${displayClass} hover:text-accent transition-colors cursor-text group flex items-baseline gap-1`}
          >
            {value}
            <span className="text-sm text-muted-foreground font-sans">{unit}</span>
            <Icon name="Pencil" size={11} className="opacity-0 group-hover:opacity-40 transition-opacity mb-0.5" />
          </button>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChangeValue(Number(e.target.value))}
        className="w-full accent-[hsl(var(--accent))]"
      />
    </div>
  );
}
