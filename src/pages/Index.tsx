import { useState, useMemo, useRef } from 'react';
import Icon from '@/components/ui/icon';

function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChangeValue,
  displayClass = 'font-display text-xl tabular',
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChangeValue: (v: number) => void;
  displayClass?: string;
}) {
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
            onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
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

interface CookMethod {
  name: string;
  emoji: string;
  factor: number; // вес после / вес до по умолчанию
}

const COOK_METHODS: CookMethod[] = [
  { name: 'Без обработки', emoji: '🥗', factor: 1 },
  { name: 'Варка', emoji: '🍲', factor: 1.15 },
  { name: 'Жарка', emoji: '🍳', factor: 0.75 },
  { name: 'Запекание', emoji: '🔥', factor: 0.8 },
  { name: 'Гриль', emoji: '🥩', factor: 0.7 },
  { name: 'На пару', emoji: '💨', factor: 0.95 },
];

interface DishItem {
  id: number;
  product: Product;
  grams: number;
}

interface BodyRecord {
  id: number;
  date: string;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  arm: number;
  thigh: number;
}

const BODY_FIELDS: { key: keyof Omit<BodyRecord, 'id' | 'date'>; label: string; unit: string }[] = [
  { key: 'weight', label: 'Вес', unit: 'кг' },
  { key: 'chest', label: 'Грудь', unit: 'см' },
  { key: 'waist', label: 'Талия', unit: 'см' },
  { key: 'hips', label: 'Бёдра', unit: 'см' },
  { key: 'arm', label: 'Рука', unit: 'см' },
  { key: 'thigh', label: 'Бедро', unit: 'см' },
];

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

  const [dish, setDish] = useState<DishItem[]>([
    { id: 1, product: PRODUCTS[0], grams: 300 },
    { id: 2, product: PRODUCTS[8], grams: 100 },
  ]);
  const [dishSearch, setDishSearch] = useState('');
  const [method, setMethod] = useState<CookMethod>(COOK_METHODS[1]);
  const [rawWeight, setRawWeight] = useState(400);
  const [cookedWeight, setCookedWeight] = useState(460);

  const dishRaw = useMemo(() => {
    return dish.reduce(
      (acc, d) => {
        const k = d.grams / 100;
        acc.cal += d.product.cal * k;
        acc.p += d.product.p * k;
        acc.f += d.product.f * k;
        acc.c += d.product.c * k;
        acc.g += d.grams;
        return acc;
      },
      { cal: 0, p: 0, f: 0, c: 0, g: 0 }
    );
  }, [dish]);

  const dishPer100 = useMemo(() => {
    const w = cookedWeight > 0 ? cookedWeight : 1;
    return {
      cal: (dishRaw.cal / w) * 100,
      p: (dishRaw.p / w) * 100,
      f: (dishRaw.f / w) * 100,
      c: (dishRaw.c / w) * 100,
    };
  }, [dishRaw, cookedWeight]);

  const dishFiltered = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(dishSearch.toLowerCase())
  );

  const applyMethod = (m: CookMethod) => {
    setMethod(m);
    setCookedWeight(Math.round(rawWeight * m.factor));
  };

  const addDishItem = (product: Product) => {
    setDish((d) => [...d, { id: Date.now(), product, grams: 100 }]);
    setDishSearch('');
  };

  const setDishGrams = (id: number, grams: number) =>
    setDish((d) => d.map((x) => (x.id === id ? { ...x, grams } : x)));

  const removeDishItem = (id: number) =>
    setDish((d) => d.filter((x) => x.id !== id));

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

  const [bodyRecords, setBodyRecords] = useState<BodyRecord[]>([
    { id: 1, date: '2026-06-01', weight: 78.4, chest: 100, waist: 88, hips: 102, arm: 36, thigh: 58 },
    { id: 2, date: '2026-06-08', weight: 77.1, chest: 99, waist: 86, hips: 101, arm: 35.5, thigh: 57 },
    { id: 3, date: '2026-06-15', weight: 76.0, chest: 98, waist: 84, hips: 100, arm: 35, thigh: 56.5 },
    { id: 4, date: '2026-06-23', weight: 75.2, chest: 97, waist: 83, hips: 99, arm: 34.5, thigh: 56 },
  ]);
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

  const bmi = useMemo(() => {
    const h = height / 100;
    return +(weight / (h * h)).toFixed(1);
  }, [height, weight]);

  const bmiLabel = bmi < 18.5 ? 'Дефицит' : bmi < 25 ? 'Норма' : bmi < 30 ? 'Избыток' : 'Ожирение';
  const bmiColor = bmi < 18.5 ? 'text-[hsl(210,60%,55%)]' : bmi < 25 ? 'text-accent' : bmi < 30 ? 'text-[hsl(35,80%,55%)]' : 'text-destructive';

  const addBodyRecord = () => {
    setBodyRecords((r) => [...r, { ...bodyForm, id: Date.now() }]);
    setShowBodyForm(false);
  };

  const first = bodyRecords[0];
  const last = bodyRecords[bodyRecords.length - 1];

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

              <SliderInput label="Возраст" value={age} min={14} max={90} unit="лет" onChangeValue={setAge} />
              <SliderInput label="Рост" value={height} min={130} max={220} unit="см" onChangeValue={setHeight} />
              <SliderInput label="Вес" value={weight} min={40} max={160} unit="кг" onChangeValue={setWeight} />

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
          <h2 className="font-display text-3xl font-medium tracking-tight mb-2">
            Калькулятор КБЖУ блюда
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Соберите блюдо из продуктов, выберите способ готовки — мы пересчитаем
            КБЖУ на 100 г готового продукта.
          </p>

          <div className="grid lg:grid-cols-[1fr,360px] gap-6">
            <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6">
              <div className="relative">
                <Icon
                  name="Plus"
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                  placeholder="Добавить ингредиент…"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-background border border-border outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
                />
                {dishSearch && (
                  <div className="absolute z-10 mt-2 w-full rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
                    {dishFiltered.length === 0 && (
                      <p className="px-4 py-3 text-sm text-muted-foreground">
                        Ничего не найдено
                      </p>
                    )}
                    {dishFiltered.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => addDishItem(p)}
                        className="flex items-center justify-between w-full px-4 py-3 hover:bg-secondary transition-colors text-left"
                      >
                        <span className="text-sm">{p.name}</span>
                        <span className="text-xs text-muted-foreground tabular">
                          {p.cal} ккал
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {dish.map((d) => (
                  <div
                    key={d.id}
                    className="group flex items-center gap-3 rounded-2xl bg-background border border-border px-4 py-3"
                  >
                    <span className="flex-1 text-sm font-medium truncate">
                      {d.product.name}
                    </span>
                    <input
                      type="number"
                      value={d.grams}
                      onChange={(e) =>
                        setDishGrams(d.id, Math.max(0, Number(e.target.value)))
                      }
                      className="w-20 h-9 px-2 rounded-lg bg-card border border-border text-right tabular text-sm outline-none focus:ring-2 focus:ring-ring/40"
                    />
                    <span className="text-xs text-muted-foreground">г</span>
                    <button
                      onClick={() => removeDishItem(d.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <span className="text-sm text-muted-foreground block mb-2">
                  Способ приготовления
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {COOK_METHODS.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => applyMethod(m)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl text-[11px] font-medium leading-tight transition-colors ${
                        method.name === m.name
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      <span className="text-lg">{m.emoji}</span>
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SliderInput
                  label="Вес до"
                  value={rawWeight}
                  min={50}
                  max={2000}
                  step={10}
                  unit="г"
                  displayClass="font-display text-lg tabular"
                  onChangeValue={(v) => {
                    setRawWeight(v);
                    setCookedWeight(Math.round(v * method.factor));
                  }}
                />
                <SliderInput
                  label="После"
                  value={cookedWeight}
                  min={50}
                  max={2000}
                  step={10}
                  unit="г"
                  displayClass="font-display text-lg tabular"
                  onChangeValue={setCookedWeight}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-primary text-primary-foreground p-7 flex flex-col">
              <p className="text-sm opacity-70 mb-1">На 100 г готового блюда</p>
              <p className="font-display text-6xl font-medium tabular mb-1 text-accent">
                {Math.round(dishPer100.cal)}
                <span className="text-xl opacity-60 text-primary-foreground"> ккал</span>
              </p>
              <div className="grid grid-cols-3 gap-2 mt-5">
                {[
                  { l: 'Белки', v: dishPer100.p },
                  { l: 'Жиры', v: dishPer100.f },
                  { l: 'Углеводы', v: dishPer100.c },
                ].map((x) => (
                  <div
                    key={x.l}
                    className="rounded-xl bg-primary-foreground/10 px-3 py-3"
                  >
                    <p className="text-[11px] opacity-60 mb-1">{x.l}</p>
                    <p className="font-display text-2xl tabular">
                      {x.v.toFixed(1)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-primary-foreground/15 my-6" />

              <p className="text-sm opacity-70 mb-3">Всё блюдо</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-60">Калории</span>
                  <span className="tabular">{Math.round(dishRaw.cal)} ккал</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Б · Ж · У</span>
                  <span className="tabular">
                    {Math.round(dishRaw.p)} · {Math.round(dishRaw.f)} ·{' '}
                    {Math.round(dishRaw.c)} г
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Уварка / ужарка</span>
                  <span className="tabular text-accent">
                    {rawWeight > 0
                      ? Math.round((cookedWeight / rawWeight) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="animate-rise" style={{ animationDelay: '400ms' }}>
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