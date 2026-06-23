import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { BodyRecord, BODY_FIELDS } from './types';

interface BodySectionProps {
  bodyRecords: BodyRecord[];
  setBodyRecords: React.Dispatch<React.SetStateAction<BodyRecord[]>>;
  bmi: number;
  bmiLabel: string;
  bmiColor: string;
}

export default function BodySection({
  bodyRecords,
  setBodyRecords,
  bmi,
  bmiLabel,
  bmiColor,
}: BodySectionProps) {
  const [bodyForm, setBodyForm] = useState<Omit<BodyRecord, 'id'>>({
    date: '2026-06-23',
    weight: 75.2,
    chest: 97,
    waist: 83,
    hips: 99,
    arm: 34.5,
    thigh: 56,
  });
  const [showBodyForm, setShowBodyForm] = useState(false);

  const addBodyRecord = () => {
    setBodyRecords((r) => [...r, { ...bodyForm, id: Date.now() }]);
    setShowBodyForm(false);
  };

  const first = bodyRecords[0];
  const last = bodyRecords[bodyRecords.length - 1];

  return (
    <section className="animate-rise" style={{ animationDelay: '200ms' }}>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl font-medium tracking-tight">
            Антропометрия
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Динамика тела в сантиметрах и килограммах
          </p>
        </div>
        <button
          onClick={() => setShowBodyForm((v) => !v)}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-accent text-accent-foreground text-sm font-medium transition-opacity hover:opacity-90"
        >
          <Icon name="Plus" size={16} />
          Замер
        </button>
      </div>

      {showBodyForm && (
        <div className="rounded-2xl bg-card border border-border p-6 mb-6 animate-rise">
          <h3 className="font-medium mb-4">Новый замер</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Дата</label>
              <input
                type="date"
                value={bodyForm.date}
                onChange={(e) => setBodyForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            {BODY_FIELDS.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {f.label}, {f.unit}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyForm[f.key]}
                  onChange={(e) =>
                    setBodyForm((bf) => ({ ...bf, [f.key]: Number(e.target.value) }))
                  }
                  className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={addBodyRecord}
              className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
            >
              Сохранить
            </button>
            <button
              onClick={() => setShowBodyForm(false)}
              className="h-10 px-5 rounded-xl bg-secondary text-muted-foreground text-sm"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr,280px] gap-6">
        <div className="rounded-3xl bg-card border border-border overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <span className="text-sm font-medium">История замеров</span>
            <span className="text-xs text-muted-foreground">{bodyRecords.length} записей</span>
          </div>
          <div className="divide-y divide-border">
            {[...bodyRecords].reverse().map((r, i) => {
              const prev = [...bodyRecords].reverse()[i + 1];
              const wDiff = prev ? +(r.weight - prev.weight).toFixed(1) : null;
              return (
                <div key={r.id} className="px-6 py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </span>
                      {i === 0 && (
                        <span className="ml-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                          последний
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl tabular">{r.weight}</span>
                      <span className="text-xs text-muted-foreground">кг</span>
                      {wDiff !== null && (
                        <span
                          className={`ml-2 text-xs font-medium ${
                            wDiff < 0 ? 'text-accent' : wDiff > 0 ? 'text-destructive' : 'text-muted-foreground'
                          }`}
                        >
                          {wDiff > 0 ? '+' : ''}{wDiff}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {BODY_FIELDS.filter((f) => f.key !== 'weight').map((f) => {
                      const val = r[f.key as keyof BodyRecord] as number;
                      const prevVal = prev ? (prev[f.key as keyof BodyRecord] as number) : null;
                      const diff = prevVal !== null ? +(val - prevVal).toFixed(1) : null;
                      return (
                        <div key={f.key} className="rounded-xl bg-background border border-border px-2.5 py-2 text-center">
                          <p className="text-[10px] text-muted-foreground mb-1">{f.label}</p>
                          <p className="text-sm font-medium tabular">{val}</p>
                          {diff !== null && (
                            <p className={`text-[10px] tabular ${diff < 0 ? 'text-accent' : diff > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {diff > 0 ? '+' : ''}{diff}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-card border border-border p-6">
            <p className="text-xs text-muted-foreground mb-1">Индекс массы тела</p>
            <p className={`font-display text-5xl font-medium tabular mb-1 ${bmiColor}`}>
              {bmi}
            </p>
            <p className={`text-sm font-medium ${bmiColor}`}>{bmiLabel}</p>
            <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{ width: `${Math.min(100, ((bmi - 15) / 25) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-6">
            <p className="text-xs text-muted-foreground mb-4">Прогресс с начала</p>
            <div className="space-y-3">
              {BODY_FIELDS.map((f) => {
                const startVal = first[f.key as keyof BodyRecord] as number;
                const lastVal = last[f.key as keyof BodyRecord] as number;
                const diff = +(lastVal - startVal).toFixed(1);
                return (
                  <div key={f.key} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground w-16">{f.label}</span>
                    <div className="flex-1 mx-3 h-px bg-border" />
                    <span className="text-sm tabular">{lastVal} {f.unit}</span>
                    <span
                      className={`ml-2 text-xs tabular w-10 text-right font-medium ${
                        diff < 0 ? 'text-accent' : diff > 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}
                    >
                      {diff > 0 ? '+' : ''}{diff}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
