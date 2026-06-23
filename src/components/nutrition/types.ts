export type Sex = 'male' | 'female';
export type Activity = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
export type Meal = 'Завтрак' | 'Обед' | 'Ужин' | 'Перекус';

export interface Product {
  name: string;
  cal: number;
  p: number;
  f: number;
  c: number;
}

export interface Entry {
  id: number;
  meal: Meal;
  product: Product;
  grams: number;
}

export interface CookMethod {
  name: string;
  emoji: string;
  factor: number;
}

export interface DishItem {
  id: number;
  product: Product;
  grams: number;
}

export interface BodyRecord {
  id: number;
  date: string;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  arm: number;
  thigh: number;
}

export const PRODUCTS: Product[] = [
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

export const RECIPES = [
  { name: 'Боул с лососем', cal: 520, p: 38, f: 22, c: 44, emoji: '🍱' },
  { name: 'Овсянка с бананом', cal: 310, p: 9, f: 6, c: 55, emoji: '🥣' },
  { name: 'Куриный салат', cal: 280, p: 32, f: 9, c: 14, emoji: '🥗' },
  { name: 'Творожная запеканка', cal: 220, p: 19, f: 7, c: 18, emoji: '🍰' },
];

export const ACTIVITIES: { value: Activity; label: string }[] = [
  { value: 1.2, label: 'Минимум' },
  { value: 1.375, label: 'Лёгкая' },
  { value: 1.55, label: 'Средняя' },
  { value: 1.725, label: 'Высокая' },
  { value: 1.9, label: 'Экстрим' },
];

export const WEEK = [
  { day: 'Пн', cal: 1840 },
  { day: 'Вт', cal: 2100 },
  { day: 'Ср', cal: 1650 },
  { day: 'Чт', cal: 1980 },
  { day: 'Пт', cal: 2240 },
  { day: 'Сб', cal: 1420 },
  { day: 'Вс', cal: 1760 },
];

export const MEALS: Meal[] = ['Завтрак', 'Обед', 'Ужин', 'Перекус'];

export const COOK_METHODS: CookMethod[] = [
  { name: 'Без обработки', emoji: '🥗', factor: 1 },
  { name: 'Варка', emoji: '🍲', factor: 1.15 },
  { name: 'Жарка', emoji: '🍳', factor: 0.75 },
  { name: 'Запекание', emoji: '🔥', factor: 0.8 },
  { name: 'Гриль', emoji: '🥩', factor: 0.7 },
  { name: 'На пару', emoji: '💨', factor: 0.95 },
];

export const BODY_FIELDS: { key: keyof Omit<BodyRecord, 'id' | 'date'>; label: string; unit: string }[] = [
  { key: 'weight', label: 'Вес', unit: 'кг' },
  { key: 'chest', label: 'Грудь', unit: 'см' },
  { key: 'waist', label: 'Талия', unit: 'см' },
  { key: 'hips', label: 'Бёдра', unit: 'см' },
  { key: 'arm', label: 'Рука', unit: 'см' },
  { key: 'thigh', label: 'Бедро', unit: 'см' },
];
