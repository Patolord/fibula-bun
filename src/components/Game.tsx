// src/components/Game.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { GameScene } from '../game/scenes/GameScene';

export default function Game() {
  const gameRef = useRef<Phaser.Game>();
  const status = useQuery(api.status.getStatus);

  useEffect(() => {
    if (gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 800,
      height: 600,
      scene: GameScene,
      backgroundColor: '#1a1a1a',
      pixelArt: true,
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div id="game-container" className="rounded-lg overflow-hidden shadow-2xl" />
      <div className="text-white mt-4">Server Status: {status ?? 'Connecting...'}</div>
    </div>
  );
}