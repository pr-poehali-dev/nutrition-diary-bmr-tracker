import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import SliderInput from './SliderInput';
import {
  Sex,
  Activity,
  CookMethod,
  DishItem,
  Product,
  PRODUCTS,
  RECIPES,
  ACTIVITIES,
  COOK_METHODS,
} from './types';

interface MetabolismSectionProps {
  sex: Sex;
  setSex: (s: Sex) => void;
  age: number;
  setAge: (v: number) => void;
  height: number;
  setHeight: (v: number) => void;
  weight: number;
  setWeight: (v: number) => void;
  activity: Activity;
  setActivity: (v: Activity) => void;
  bmr: number;
  tdee: number;
}

export default function MetabolismSection({
  sex,
  setSex,
  age,
  setAge,
  height,
  setHeight,
  weight,
  setWeight,
  activity,
  setActivity,
  bmr,
  tdee,
}: MetabolismSectionProps) {
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

  return (
    <>
      {/* Базовый метаболизм */}
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

      {/* Калькулятор КБЖУ блюда */}
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

      {/* База рецептов */}
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
    </>
  );
}
