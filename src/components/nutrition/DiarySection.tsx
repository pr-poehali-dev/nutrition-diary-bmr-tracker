import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Entry, Meal, Product, PRODUCTS, MEALS, WEEK } from './types';

interface DiarySectionProps {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  tdee: number;
}

export default function DiarySection({ entries, setEntries, tdee }: DiarySectionProps) {
  const [search, setSearch] = useState('');

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, e) => {
        const k = e.grams / 100;
        acc.cal += e.product.cal * k;
        acc.p += e.product.p * k;
        acc.f += e.product.f * k;
        acc.c += e.product.c * k;
        return acc;
      },
      { cal: 0, p: 0, f: 0, c: 0 }
    );
  }, [entries]);

  const pct = Math.min(100, Math.round((totals.cal / tdee) * 100));
  const left = Math.max(0, tdee - Math.round(totals.cal));

  const filtered = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addProduct = (product: Product) => {
    setEntries((e) => [
      ...e,
      { id: Date.now(), meal: 'Перекус', product, grams: 100 },
    ]);
    setSearch('');
  };

  const removeEntry = (id: number) =>
    setEntries((e) => e.filter((x) => x.id !== id));

  const maxWeek = Math.max(...WEEK.map((w) => w.cal));

  return (
    <>
      {/* Дневной баланс */}
      <section className="animate-rise">
        <p className="text-sm text-muted-foreground mb-1">Сегодня · 23 июня</p>
        <h1 className="font-display text-5xl sm:text-6xl font-medium tracking-tight mb-10">
          Дневной баланс
        </h1>

        <div className="grid md:grid-cols-[auto,1fr] gap-10 items-center">
          <div className="relative w-52 h-52 mx-auto">
            <div
              className="absolute inset-0 rounded-full ring-gradient"
              style={{ ['--p' as string]: `${pct}%` }}
            />
            <div className="absolute inset-[14px] rounded-full bg-background flex flex-col items-center justify-center">
              <span className="font-display text-5xl font-medium tabular leading-none">
                {Math.round(totals.cal)}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                из {tdee} ккал
              </span>
              <span className="mt-3 text-xs font-medium text-accent">
                осталось {left}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Белки', val: totals.p, color: 'bg-accent', goal: 140 },
              { label: 'Жиры', val: totals.f, color: 'bg-[hsl(35,80%,55%)]', goal: 60 },
              { label: 'Углеводы', val: totals.c, color: 'bg-[hsl(210,60%,55%)]', goal: 220 },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl bg-card border border-border p-5"
              >
                <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
                <p className="font-display text-3xl font-medium tabular mb-3">
                  {Math.round(m.val)}
                  <span className="text-sm text-muted-foreground"> г</span>
                </p>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${m.color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min(100, (m.val / m.goal) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Дневник питания */}
      <section className="animate-rise" style={{ animationDelay: '80ms' }}>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-3xl font-medium tracking-tight">
            Дневник питания
          </h2>
          <span className="text-sm text-muted-foreground">
            {entries.length} записей
          </span>
        </div>

        <div className="relative mb-6">
          <Icon
            name="Search"
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Добавить продукт из базы…"
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-card border border-border outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
          />
          {search && (
            <div className="absolute z-10 mt-2 w-full rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
              {filtered.length === 0 && (
                <p className="px-4 py-3 text-sm text-muted-foreground">
                  Ничего не найдено
                </p>
              )}
              {filtered.map((p) => (
                <button
                  key={p.name}
                  onClick={() => addProduct(p)}
                  className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary transition-colors text-left"
                >
                  <span className="text-sm">{p.name}</span>
                  <span className="text-xs text-muted-foreground tabular">
                    {p.cal} ккал / 100г
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {MEALS.map((meal: Meal) => {
            const items = entries.filter((e) => e.meal === meal);
            if (items.length === 0) return null;
            const mealCal = items.reduce(
              (s, e) => s + (e.product.cal * e.grams) / 100,
              0
            );
            return (
              <div key={meal}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {meal}
                  </h3>
                  <span className="text-sm tabular text-muted-foreground">
                    {Math.round(mealCal)} ккал
                  </span>
                </div>
                <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
                  {items.map((e) => (
                    <div
                      key={e.id}
                      className="group flex items-center gap-4 px-4 py-3.5"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {e.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground tabular">
                          {e.grams} г · Б {Math.round((e.product.p * e.grams) / 100)} · Ж{' '}
                          {Math.round((e.product.f * e.grams) / 100)} · У{' '}
                          {Math.round((e.product.c * e.grams) / 100)}
                        </p>
                      </div>
                      <span className="font-display text-xl tabular">
                        {Math.round((e.product.cal * e.grams) / 100)}
                      </span>
                      <button
                        onClick={() => removeEntry(e.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Неделя */}
      <section className="animate-rise" style={{ animationDelay: '160ms' }}>
        <h2 className="font-display text-3xl font-medium tracking-tight mb-6">
          Неделя
        </h2>
        <div className="rounded-3xl bg-card border border-border p-6 sm:p-8">
          <div className="flex items-end justify-between gap-3 h-44">
            {WEEK.map((w) => (
              <div
                key={w.day}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <span className="text-xs tabular text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {w.cal}
                </span>
                <div
                  className="w-full rounded-t-lg bg-accent/15 relative overflow-hidden transition-all duration-700"
                  style={{ height: `${(w.cal / maxWeek) * 100}%` }}
                >
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-accent rounded-t-lg" />
                </div>
                <span className="text-xs text-muted-foreground">{w.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border text-sm">
            <span className="text-muted-foreground">Среднее за неделю</span>
            <span className="font-display text-2xl tabular">
              {Math.round(WEEK.reduce((s, w) => s + w.cal, 0) / 7)} ккал
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
