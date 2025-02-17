// src/app/page.js
"use client";

import { FoodDiaryApp } from '@/components/food-diary-app';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <FoodDiaryApp />
    </main>
  );
}