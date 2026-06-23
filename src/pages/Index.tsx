import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';

type Sex = 'male' | 'female';
type Activity = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
type Meal = 'Завтрак' | 'Обед' | 'Ужин' | 'Перекус';

interface Product {
  name: string;
  cal: number;
  p: number;
  f: number;
  c: number;
}

interface Entry {
  id: number;
  meal: Meal;
  product: Product;
  grams: number;
}

const PRODUCTS: Product[] = [
  { name: 'Куриная грудка', cal: 113, p: 23.6, f: 1.9, c: 0.4 },
  { name: 'Гречка варёная', cal: 110, p: 4.2, f: 1.1, c: 21.3 },
  { name: 'Овсянка на воде', cal: 88, p: 3, f: 1.7, c: 15 },
  { name: 'Яйцо куриное', cal: 157, p: 12.7, f: 11.5, c: 0.7 },
  { name: 'Творог 5%', cal: 121, p: 17, f: 5, c: 1.8 },
  { name: 'Банан', cal: 96, p: 1.5, f: 0.2, c: 21 },
  { name: 'Авокадо', cal: 160, p: 2, f: 14.7, c: 8.5 },
  { name: 'Лосось', cal: 208, p: 20, f: 13, c: 0 },
  { name: 'Рис бурый', cal: 111, p: 2.6, f: 0.9, c: 23 },
  { name: 'Греческий йогурт', cal: 66, p: 5, f: 3.2, c: 3.5 },
  { name: 'Миндаль', cal: 579, p: 21, f: 49, c: 22 },
  { name: 'Брокколи', cal: 34, p: 2.8, f: 0.4, c: 7 },
];

const RECIPES = [
  { name: 'Боул с лососем', cal: 520, p: 38, f: 22, c: 44, emoji: '🍱' },
  { name: 'Овсянка с бананом', cal: 310, p: 9, f: 6, c: 55, emoji: '🥣' },
  { name: 'Куриный салат', cal: 280, p: 32, f: 9, c: 14, emoji: '🥗' },
  { name: 'Творожная запеканка', cal: 220, p: 19, f: 7, c: 18, emoji: '🍰' },
];

const ACTIVITIES: { value: Activity; label: string }[] = [
  { value: 1.2, label: 'Минимум' },
  { value: 1.375, label: 'Лёгкая' },
  { value: 1.55, label: 'Средняя' },
  { value: 1.725, label: 'Высокая' },
  { value: 1.9, label: 'Экстрим' },
];

const WEEK = [
  { day: 'Пн', cal: 1840 },
  { day: 'Вт', cal: 2100 },
  { day: 'Ср', cal: 1650 },
  { day: 'Чт', cal: 1980 },
  { day: 'Пт', cal: 2240 },
  { day: 'Сб', cal: 1420 },
  { day: 'Вс', cal: 1760 },
];

const MEALS: Meal[] = ['Завтрак', 'Обед', 'Ужин', 'Перекус'];

export default function Index() {
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(178);
  const [weight, setWeight] = useState(74);
  const [activity, setActivity] = useState<Activity>(1.375);
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, meal: 'Завтрак', product: PRODUCTS[2], grams: 60 },
    { id: 2, meal: 'Завтрак', product: PRODUCTS[5], grams: 120 },
    { id: 3, meal: 'Обед', product: PRODUCTS[0], grams: 180 },
    { id: 4, meal: 'Обед', product: PRODUCTS[1], grams: 150 },
  ]);
  const [search, setSearch] = useState('');

  const bmr = useMemo(() => {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return Math.round(sex === 'male' ? base + 5 : base - 161);
  }, [sex, age, height, weight]);

  const tdee = Math.round(bmr * activity);

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
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container max-w-5xl flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Icon name="Leaf" size={18} className="text-accent-foreground" />
            </div>
            <span className="font-semibold tracking-tight">Рацион</span>
          </div>
          <nav className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
            {['Дневник', 'Статистика', 'База', 'Профиль'].map((n, i) => (
              <a
                key={n}
                className={`px-3 py-1.5 rounded-lg transition-colors hover:text-foreground ${
                  i === 0 ? 'text-foreground bg-secondary' : ''
                }`}
                href="#"
              >
                {n}
              </a>
            ))}
          </nav>
          <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
            А
          </button>
        </div>
      </header>

      <main className="container max-w-5xl px-6 py-10 space-y-16">
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
            {MEALS.map((meal) => {
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

        <section className="animate-rise" style={{ animationDelay: '240ms' }}>
          <h2 className="font-display text-3xl font-medium tracking-tight mb-6">
            Базовый метаболизм
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6">
              <div className="flex gap-2">
                {(['male', 'female'] as Sex[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSex(s)}
                    className={`flex-1 h-11 rounded-xl text-sm font-medium transition-colors ${
                      sex === s
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {s === 'male' ? 'Мужчина' : 'Женщина'}
                  </button>
                ))}
              </div>

              {[
                { label: 'Возраст', val: age, set: setAge, min: 14, max: 90, unit: 'лет' },
                { label: 'Рост', val: height, set: setHeight, min: 130, max: 220, unit: 'см' },
                { label: 'Вес', val: weight, set: setWeight, min: 40, max: 160, unit: 'кг' },
              ].map((f) => (
                <div key={f.label}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{f.label}</span>
                    <span className="font-display text-xl tabular">
                      {f.val} <span className="text-sm text-muted-foreground">{f.unit}</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    value={f.val}
                    onChange={(e) => f.set(Number(e.target.value))}
                    className="w-full accent-[hsl(var(--accent))]"
                  />
                </div>
              ))}

              <div>
                <span className="text-sm text-muted-foreground block mb-2">
                  Активность
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {ACTIVITIES.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => setActivity(a.value)}
                      className={`py-2 rounded-lg text-[11px] font-medium leading-tight transition-colors ${
                        activity === a.value
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-primary text-primary-foreground p-8 flex flex-col justify-center">
              <p className="text-sm opacity-70 mb-1">Базовый метаболизм (BMR)</p>
              <p className="font-display text-6xl font-medium tabular mb-6">
                {bmr}
                <span className="text-xl opacity-60"> ккал</span>
              </p>
              <div className="h-px bg-primary-foreground/15 mb-6" />
              <p className="text-sm opacity-70 mb-1">
                Норма с учётом активности (TDEE)
              </p>
              <p className="font-display text-5xl font-medium tabular text-accent">
                {tdee}
                <span className="text-lg opacity-60"> ккал</span>
              </p>
              <p className="text-xs opacity-50 mt-6">
                Формула Миффлина — Сан Жеора
              </p>
            </div>
          </div>
        </section>

        <section className="animate-rise" style={{ animationDelay: '320ms' }}>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-3xl font-medium tracking-tight">
              База рецептов
            </h2>
            <a href="#" className="text-sm text-accent font-medium">
              Все рецепты
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RECIPES.map((r) => (
              <div
                key={r.name}
                className="rounded-2xl bg-card border border-border p-5 hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="text-4xl mb-4">{r.emoji}</div>
                <p className="font-medium mb-1">{r.name}</p>
                <p className="font-display text-2xl tabular mb-3">
                  {r.cal} <span className="text-sm text-muted-foreground">ккал</span>
                </p>
                <div className="flex gap-3 text-xs text-muted-foreground tabular">
                  <span>Б {r.p}</span>
                  <span>Ж {r.f}</span>
                  <span>У {r.c}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="container max-w-5xl px-6 py-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>Рацион · дневник питания</span>
          <span className="flex items-center gap-1.5">
            <Icon name="Cloud" size={14} />
            Синхронизировано
          </span>
        </div>
      </footer>
    </div>
  );
}
