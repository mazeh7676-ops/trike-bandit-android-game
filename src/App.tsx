/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine, GameState, GameStats } from './game/GameEngine';
import { GameHUD } from './components/GameHUD';

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('title');
  const [gameStats, setGameStats] = useState<GameStats>({
    sheepInCart: 0,
    maxCartCapacity: 6,
    totalSheepStolen: 0,
    totalScore: 0,
    nitro: 100,
    speedKmh: 0,
    shepherdAlert: false,
    timeLeft: 90,
    mode: 'heist',
    activeNotification: null,
  });
  const [lang, setLang] = useState<'fa' | 'en'>('fa');

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize GameEngine once
    const engine = new GameEngine(mountRef.current);
    engineRef.current = engine;

    engine.onStatsUpdate = (stats) => {
      setGameStats(stats);
    };

    engine.onStateChange = (state) => {
      setGameState(state);
    };

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleStartGame = (mode: 'heist' | 'freeroam') => {
    engineRef.current?.startHeist(mode);
  };

  const handleResume = () => {
    engineRef.current?.resumeGame();
  };

  const handlePause = () => {
    engineRef.current?.pauseGame();
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'fa' ? 'en' : 'fa'));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-vazir select-none">
      {/* 3D WebGL Canvas Viewport Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Game HUD and Overlays */}
      <GameHUD
        engine={engineRef.current}
        state={gameState}
        stats={gameStats}
        onStartGame={handleStartGame}
        onResume={handleResume}
        onPause={handlePause}
        lang={lang}
        onToggleLang={handleToggleLang}
      />
    </div>
  );
}
