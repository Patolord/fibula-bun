// src/app/page.tsx
'use client';

import Game from '@/components/Game';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <Game />
    </main>
  );
}