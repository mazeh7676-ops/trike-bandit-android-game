import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Volume2,
  VolumeX,
  Radio,
  Camera,
  Play,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Flame,
  Bell,
  Eye,
  Compass,
  Smartphone,
  Download,
} from 'lucide-react';
import { GameEngine, GameState, GameStats, CameraMode } from '../game/GameEngine';
import { sounds } from '../game/audio';
import { AndroidGamepad } from './AndroidGamepad';
import { AndroidInstallModal } from './AndroidInstallModal';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface GameHUDProps {
  engine: GameEngine | null;
  state: GameState;
  stats: GameStats;
  onStartGame: (mode: 'heist' | 'freeroam') => void;
  onResume: () => void;
  onPause: () => void;
  lang: 'fa' | 'en';
  onToggleLang: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  engine,
  state,
  stats,
  onStartGame,
  onResume,
  onPause,
  lang,
  onToggleLang,
}) => {
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [radioActive, setRadioActive] = useState(false);
  const { isInstallable } = usePWAInstall();
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync mute and radio state
  useEffect(() => {
    setIsMuted(sounds.getIsMuted());
    setRadioActive(sounds.getIsMusicPlaying());
  }, [state]);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const toggleRadio = () => {
    const playing = sounds.toggleFolkRadio();
    setRadioActive(playing);
  };

  // Mini Radar rendering
  useEffect(() => {
    if (state !== 'playing' || !engine || !radarCanvasRef.current) return;

    let animId: number;
    const canvas = radarCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = cx - 4;
      const scale = 0.55; // meters to radar pixels

      // Radar background & grid
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
      ctx.stroke();

      // Range rings
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.15)';
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      const pPos = engine.getPlayerPosition();

      // Draw Secret Barn (green icon)
      const bPos = engine.getDropZonePosition();
      const bRelX = (bPos.x - pPos.x) * scale;
      const bRelZ = (bPos.z - pPos.z) * scale;
      if (Math.hypot(bRelX, bRelZ) < radius - 3) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(cx + bRelX, cy + bRelZ, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw Sheep (dots)
      const sheepList = engine.getSheepList();
      sheepList.forEach((s) => {
        if (s.captured) return;
        const relX = (s.pos.x - pPos.x) * scale;
        const relZ = (s.pos.z - pPos.z) * scale;
        if (Math.hypot(relX, relZ) < radius - 2) {
          ctx.fillStyle = s.breed === 'golden' ? '#fbbf24' : s.breed === 'baluchi' ? '#e2e8f0' : '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + relX, cy + relZ, s.breed === 'golden' ? 3.5 : 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Shepherd (Red alert dot)
      const shPos = engine.getShepherdPosition();
      const shRelX = (shPos.x - pPos.x) * scale;
      const shRelZ = (shPos.z - pPos.z) * scale;
      if (Math.hypot(shRelX, shRelZ) < radius - 2) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx + shRelX, cy + shRelZ, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Player in center (Blue triangle)
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(renderRadar);
    };

    animId = requestAnimationFrame(renderRadar);
    return () => cancelAnimationFrame(animId);
  }, [state, engine]);

  const isFa = lang === 'fa';

  return (
    <div className={`fixed inset-0 pointer-events-none select-none z-10 ${isFa ? 'font-vazir' : 'font-rubik'}`} dir={isFa ? 'rtl' : 'ltr'}>
      {/* 1. TITLE SCREEN OVERLAY */}
      {state === 'title' && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 pointer-events-auto bg-gradient-to-t from-black/80 via-transparent to-black/40">
          {/* Header Bar */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-amber-300 uppercase rounded-full bg-amber-950/70 border border-amber-600/40">
                {isFa ? '🎮 بازی سه‌بعدی اندروید و وب' : '3D Android & Web Game'}
              </span>
              <button
                onClick={() => setShowAndroidModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-300 bg-emerald-950/90 hover:bg-emerald-900 rounded-full border border-emerald-500/60 shadow-lg shadow-emerald-950 transition cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                {isFa ? 'نصب روی اندروید (APK)' : 'Install on Android'}
              </button>
              <button
                onClick={() => setShowPhotoModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 rounded-full border border-slate-600/50 transition cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                {isFa ? 'مشاهده عکس اصلی شخصیت' : 'View Photo'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleLang}
                className="px-3 py-1 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 rounded-full border border-slate-600/50 transition cursor-pointer"
              >
                {isFa ? 'English' : 'فارسی'}
              </button>
              <button
                onClick={toggleSound}
                className="p-2 text-slate-200 bg-slate-800/80 hover:bg-slate-700 rounded-full border border-slate-600/50 transition cursor-pointer"
                aria-label="Toggle Sound"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
              </button>
            </div>
          </div>

          {/* Title Lockup (Bespoke SVG title lockup) */}
          <div className="max-w-xl mx-auto text-center my-auto flex flex-col items-center">
            {/* Custom Game Logo Badge */}
            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl">
                🚲
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              {isFa ? (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-pink-400">
                    سه‌چرخه شوتی
                  </span>
                  <span className="block text-2xl sm:text-4xl mt-1 text-white">دزد گوسفندان روستا</span>
                </>
              ) : (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-pink-400">
                    TRICYCLE RUSTLER
                  </span>
                  <span className="block text-2xl sm:text-3xl mt-1 text-white">The Village Sheep Heist</span>
                </>
              )}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-md drop-shadow">
              {isFa
                ? 'با سه‌چرخه کودکانه تو روستا بتاز، گوسفندها رو بار تریلر کن و از دست چوپان در برو!'
                : 'Cruise the scenic village on a tiny colorful tricycle, scoop sheep into your cargo cart, and evade the shepherd!'}
            </p>

            {/* Start CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full max-w-sm">
              <button
                onClick={() => onStartGame('heist')}
                className="w-full py-3.5 px-6 rounded-xl font-black text-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                {isFa ? 'شروع ماموریت دزدی (Enter)' : 'Start Heist Mission (Enter)'}
              </button>

              <button
                onClick={() => onStartGame('freeroam')}
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                {isFa ? 'گردش آزاد' : 'Free Roam'}
              </button>
            </div>

            {/* Single flat control-hint line */}
            <div className="mt-6 text-xs text-slate-400 bg-slate-950/60 px-4 py-2 rounded-full border border-slate-800/80">
              {isFa
                ? 'کلیدهای W A S D یا جهت‌ها حرکت · Space نیترو · Shift دریفت · H زنگوله · C تغییر زاویه دوربین'
                : 'WASD / Arrows to Move · Space Nitro · Shift Drift · H Bell · C Camera Toggle'}
            </div>
          </div>

          {/* Footer credits / meme info */}
          <div className="text-center text-xs text-slate-400">
            {isFa
              ? 'الهام گرفته از عکس واقعی پسر عینک دودی سوار بر سه‌چرخه میان گله گوسفندان'
              : 'Directly recreated from the iconic user photo on the country road!'}
          </div>
        </div>
      )}

      {/* 2. CINEMATIC INTRO BANNER */}
      {state === 'cinematic_intro' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-6 py-3 rounded-2xl bg-black/75 border border-amber-500/40 text-center shadow-2xl">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
              {isFa ? '🎥 زاویه دوربین به پشت سه‌چرخه منتقل می‌شود...' : '🎥 Camera swinging behind tricycle...'}
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {isFa ? 'سوار شو! گوسفندا منتظرن!' : 'Mount up! Ready for the Heist!'}
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVE PLAYING HUD (Unobstructed center >= 85%) */}
      {(state === 'playing' || state === 'paused') && (
        <>
          {/* Top Status Perimeter Clusters */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
            {/* Top-Left: Sheep Cargo Cart Capacity */}
            <div className="flex flex-col gap-2">
              <div className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-950/85 border border-slate-800 shadow-lg text-slate-100">
                <div className="text-2xl">🛒</div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {isFa ? 'بار تریلر سه‌چرخه' : 'Cart Cargo'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-amber-400 tabular-nums">
                      {stats.sheepInCart} / {stats.maxCartCapacity}
                    </span>
                    <span className="text-xs text-slate-400">
                      {stats.sheepInCart >= stats.maxCartCapacity
                        ? (isFa ? '(تکمیل!)' : '(Full!)')
                        : (isFa ? 'گوسفند' : 'Sheep')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stolen Total */}
              <div className="px-3 py-1 rounded-lg bg-slate-950/75 border border-slate-800/80 text-xs text-slate-300 w-fit">
                {isFa ? 'کل گوسفندان دزدیده شده:' : 'Total Rustled:'}{' '}
                <span className="font-bold text-emerald-400 tabular-nums">{stats.totalSheepStolen}</span>
              </div>
            </div>

            {/* Top-Center: Shepherd Alert or Notifications */}
            <div className="flex flex-col items-center gap-1.5 max-w-sm pointer-events-none text-center">
              {stats.shepherdAlert && (
                <div className="px-4 py-1.5 rounded-xl bg-red-600/90 text-white font-bold text-xs sm:text-sm border border-red-400 shadow-lg shadow-red-600/40 animate-bounce">
                  🚨 {isFa ? 'هشدار! چوپان مش قربان داره میاد دنبالت!' : 'Alert! Shepherd is chasing you!'}
                </div>
              )}

              {stats.activeNotification && (
                <div className="px-4 py-1.5 rounded-xl bg-slate-950/85 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/50 shadow-lg">
                  {stats.activeNotification}
                </div>
              )}
            </div>

            {/* Top-Right: Score, Time, Controls */}
            <div className="flex flex-col items-end gap-2">
              <div className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-950/85 border border-slate-800 shadow-lg text-slate-100">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {isFa ? 'امتیاز / سکه' : 'Score'}
                  </div>
                  <div className="text-xl font-black text-yellow-400 tabular-nums">
                    {stats.totalScore.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Time remaining for Heist mode */}
              {stats.mode === 'heist' && (
                <div className="px-3 py-1 rounded-lg bg-slate-950/75 border border-slate-800/80 text-xs text-slate-300">
                  {isFa ? 'زمان باقی‌مانده:' : 'Time Left:'}{' '}
                  <span
                    className={`font-black tabular-nums ${stats.timeLeft < 20 ? 'text-red-400 font-bold' : 'text-sky-400'}`}
                  >
                    {Math.floor(stats.timeLeft / 60)}:
                    {(Math.floor(stats.timeLeft % 60)).toString().padStart(2, '0')}
                  </span>
                </div>
              )}

              <div className="pointer-events-auto flex items-center gap-1.5">
                <button
                  onClick={onPause}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition cursor-pointer"
                >
                  {isFa ? 'توقف (Esc)' : 'Pause (Esc)'}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Left Perimeter: Mini Radar */}
          <div className="absolute bottom-6 left-6 pointer-events-auto flex flex-col items-start gap-1">
            <div className="p-1 rounded-full bg-slate-950/85 border border-slate-800 shadow-xl">
              <canvas
                ref={radarCanvasRef}
                width={110}
                height={110}
                className="w-[110px] h-[110px] rounded-full block"
              />
            </div>
            <div className="text-[10px] text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded-full">
              🟢 {isFa ? 'مقر دزدان' : 'Secret Barn'} · 🔴 {isFa ? 'چوپان' : 'Shepherd'}
            </div>
          </div>

          {/* Bottom Right Perimeter: Speedometer & Nitro */}
          <div className="absolute bottom-6 right-6 pointer-events-auto flex flex-col items-end gap-2">
            {/* Speedometer */}
            <div className="px-4 py-2.5 rounded-xl bg-slate-950/85 border border-slate-800 shadow-xl text-center min-w-[90px]">
              <div className="text-2xl font-black text-sky-400 tabular-nums">
                {stats.speedKmh}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                {isFa ? 'کیلومتر / ساعت' : 'KM / H'}
              </div>
            </div>

            {/* Nitro Bar */}
            <div className="w-28 p-2 rounded-xl bg-slate-950/85 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between text-[10px] text-amber-300 mb-1 font-bold">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-400" />
                  {isFa ? 'سوپر نیترو' : 'NITRO'}
                </span>
                <span className="tabular-nums">{Math.round(stats.nitro)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-100"
                  style={{ width: `${stats.nitro}%` }}
                />
              </div>
            </div>
          </div>

          {/* Android Virtual Gamepad (Analog thumbstick, pedals, nitro, drift, bell, fullscreen) */}
          <AndroidGamepad engine={engine} lang={lang} />

          {/* 4. COLLAPSIBLE BOTTOM DOCK (Unified dock adhering to Three.js directives) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center">
            {/* Collapse / Expand Tab */}
            <button
              onClick={() => setDockCollapsed(!dockCollapsed)}
              className="px-3 py-0.5 rounded-t-lg bg-slate-900/90 border-t border-x border-slate-700/80 text-[10px] text-slate-400 hover:text-slate-200 transition flex items-center gap-1 cursor-pointer"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  {isFa ? 'نمایش تنظیمات' : 'Show Controls'}
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  {isFa ? 'حالت سینمایی (مخفی)' : 'Cinema Mode'}
                </>
              )}
            </button>

            {/* Dock Body */}
            {!dockCollapsed && (
              <div className="px-4 py-2 rounded-xl bg-slate-950/90 border border-slate-800 shadow-2xl flex items-center gap-2 sm:gap-4 text-xs text-slate-300">
                {/* Camera Views Selector */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg">
                  <span className="text-[10px] text-slate-400 px-1 hidden sm:inline">
                    {isFa ? 'دوربین:' : 'Camera:'}
                  </span>
                  <button
                    onClick={() => engine?.setCameraMode('chase')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                      engine?.cameraMode === 'chase' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800'
                    }`}
                  >
                    {isFa ? 'پشت' : 'Chase'}
                  </button>
                  <button
                    onClick={() => engine?.setCameraMode('front_meme')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                      engine?.cameraMode === 'front_meme' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800'
                    }`}
                  >
                    {isFa ? 'جلو (میم)' : 'Front (Photo)'}
                  </button>
                  <button
                    onClick={() => engine?.setCameraMode('first_person')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                      engine?.cameraMode === 'first_person' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800'
                    }`}
                  >
                    {isFa ? 'فرمان' : 'Cockpit'}
                  </button>
                  <button
                    onClick={() => engine?.setCameraMode('drone')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                      engine?.cameraMode === 'drone' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800'
                    }`}
                  >
                    {isFa ? 'پهپاد' : 'Drone'}
                  </button>
                </div>

                <div className="h-4 w-px bg-slate-800" />

                {/* Bicycle Bell Action */}
                <button
                  onClick={() => engine?.ringBell()}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-800/60 transition cursor-pointer"
                  title="Ring Tricycle Bell (H)"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isFa ? 'زنگ سه‌چرخه' : 'Bell (H)'}</span>
                </button>

                {/* Folk Village Radio */}
                <button
                  onClick={toggleRadio}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                    radioActive
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Village Folk Music Radio"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isFa ? 'رادیو محلی' : 'Radio'}</span>
                </button>

                {/* Mute Toggle */}
                <button
                  onClick={toggleSound}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Android Install & APK Modal */}
                <button
                  onClick={() => setShowAndroidModal(true)}
                  className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 transition cursor-pointer"
                  title="نصب بازی روی اندروید (APK / PWA)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>

                {/* Original Photo Preview */}
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 transition cursor-pointer"
                  title="View original user meme photo"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* 5. PAUSE MODAL */}
      {state === 'paused' && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 pointer-events-auto">
          <div className="w-full max-w-sm rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-2xl text-center">
            <h2 className="text-2xl font-black text-white mb-2">
              {isFa ? 'بازی متوقف شد' : 'Game Paused'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              {isFa
                ? 'سه‌چرخه شوتی آماده ادامه گرد و خاک است!'
                : 'Your tricycle is waiting! Ready to resume the heist?'}
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={onResume}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                {isFa ? 'ادامه بازی' : 'Resume'}
              </button>
              <button
                onClick={() => onStartGame('heist')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isFa ? 'شروع مجدد' : 'Restart'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. VICTORY MODAL */}
      {state === 'victory' && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-4 pointer-events-auto">
          <div className="w-full max-w-md rounded-2xl bg-slate-950 border border-amber-500/50 p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-3xl">
              🏆
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 mb-2">
              {isFa ? 'پیروزی بزرگ دزد گوسفند!' : 'Heist Mastermind Victory!'}
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              {isFa
                ? `تبریک! موفق شدی ${stats.totalSheepStolen} گوسفند رو به سلامت به مقر برسونی و چوپان رو قال بذاری!`
                : `Congratulations! You successfully rustled ${stats.totalSheepStolen} sheep into the barn!`}
            </p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6 text-sm">
              <div>
                <div className="text-xs text-slate-400">{isFa ? 'کل امتیاز' : 'Final Score'}</div>
                <div className="text-xl font-black text-yellow-400 tabular-nums">
                  {stats.totalScore.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">{isFa ? 'تعداد گوسفندان' : 'Sheep Stolen'}</div>
                <div className="text-xl font-black text-emerald-400 tabular-nums">
                  {stats.totalSheepStolen}
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartGame('heist')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-base shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              {isFa ? 'بازی دوباره (Enter)' : 'Play Again'}
            </button>
          </div>
        </div>
      )}

      {/* 7. GAME OVER MODAL (Heist time up) */}
      {state === 'gameover' && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-4 pointer-events-auto">
          <div className="w-full max-w-sm rounded-2xl bg-slate-950 border border-red-500/40 p-6 shadow-2xl text-center">
            <div className="text-4xl mb-3">⏰</div>
            <h2 className="text-2xl font-black text-white mb-2">
              {isFa ? 'زمان به پایان رسید!' : 'Time Expired!'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              {isFa
                ? `غروب شد و چوپان گله رو جمع کرد. شما ${stats.totalSheepStolen} گوسفند دزدیدید!`
                : `Dusk settled in! You managed to rustle ${stats.totalSheepStolen} sheep.`}
            </p>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-6 text-center">
              <div className="text-xs text-slate-400">{isFa ? 'امتیاز نهایی' : 'Final Score'}</div>
              <div className="text-2xl font-black text-yellow-400 tabular-nums">
                {stats.totalScore.toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => onStartGame('heist')}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
            >
              {isFa ? 'تلاش دوباره' : 'Try Again'}
            </button>
          </div>
        </div>
      )}

      {/* 8. ORIGINAL MEME PHOTO PREVIEW MODAL */}
      {showPhotoModal && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4 pointer-events-auto z-50">
          <div className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 p-5 shadow-2xl flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-sky-400" />
                {isFa ? 'عکس واقعی شخصیت اصلی (ارسالی شما)' : 'Original User Photo'}
              </h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 cursor-pointer"
              >
                ✕ {isFa ? 'بستن' : 'Close'}
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-700 max-h-[60vh] bg-black">
              <img
                src="/assets/aistudio/Screenshot_2026-11-08-00-51-54-754_com.miui.gallery_eb000d79.jpg"
                alt="Original character on tricycle with sheep"
                className="w-full h-auto object-contain max-h-[55vh]"
              />
            </div>

            <p className="text-xs text-slate-400 mt-3 text-center">
              {isFa
                ? 'مدل سه‌بعدی کاراکتر و سه‌چرخه کودکانه دقیقاً با عینک دودی، تیشرت مشکی و سه‌چرخه زرد و صورتی طبق این عکس بازسازی شده است!'
                : 'The 3D character and tricycle were custom modeled to faithfully mirror this photo!'}
            </p>
          </div>
        </div>
      )}

      {/* 9. ANDROID INSTALL & APK EXPORT MODAL */}
      <AndroidInstallModal
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
        lang={lang}
      />
    </div>
  );
};
