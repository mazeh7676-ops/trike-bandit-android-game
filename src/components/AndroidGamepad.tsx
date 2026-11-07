import React, { useRef, useState, useEffect } from 'react';
import { Flame, Bell, Disc3, Maximize2, Minimize2 } from 'lucide-react';
import { GameEngine } from '../game/GameEngine';

interface AndroidGamepadProps {
  engine: GameEngine | null;
  lang: 'fa' | 'en';
}

export const AndroidGamepad: React.FC<AndroidGamepadProps> = ({ engine, lang }) => {
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  // Check fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignored if fullscreen request is denied
    }
  };

  // Joystick touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsDragging(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsDragging(false);
        setKnobPos({ x: 0, y: 0 });
        if (engine) {
          engine.input.joystickX = 0;
          engine.input.joystickY = 0;
        }
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current || !engine) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = rect.width / 2;

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const normX = (Math.cos(angle) * clampedDist) / maxRadius;
    // Invert Y so up is positive (forward)
    const normY = -(Math.sin(angle) * clampedDist) / maxRadius;

    setKnobPos({
      x: Math.cos(angle) * clampedDist,
      y: Math.sin(angle) * clampedDist,
    });

    engine.input.joystickX = normX;
    engine.input.joystickY = normY;
  };

  const isFa = lang === 'fa';

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20">
      {/* Top Android Fullscreen Toggle Button */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 hover:bg-slate-800 text-slate-300 border border-slate-700/70 text-xs shadow-md transition active:scale-95 cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreen ? (isFa ? 'خروج تمام‌صفحه' : 'Exit Fullscreen') : (isFa ? 'تمام‌صفحه اندروید' : 'Fullscreen')}</span>
        </button>
      </div>

      {/* Left Side: Virtual Analog Joystick */}
      <div className="absolute bottom-6 left-6 pointer-events-auto touch-none">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative w-32 h-32 rounded-full bg-slate-950/70 border-2 border-slate-700/80 shadow-2xl flex items-center justify-center backdrop-blur-none"
        >
          {/* Inner ring */}
          <div className="w-16 h-16 rounded-full border border-slate-600/50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-500/50" />
          </div>

          {/* Floating Thumb knob */}
          <div
            className={`absolute w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 border-2 border-amber-300 shadow-xl flex items-center justify-center text-slate-950 font-black text-sm transition-transform duration-75 ${
              isDragging ? 'scale-110 shadow-amber-500/50' : ''
            }`}
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            }}
          >
            🕹️
          </div>
        </div>
        <div className="text-center text-[10px] text-slate-400 mt-1 font-semibold">
          {isFa ? 'فرمان لمسی' : 'Steer Joystick'}
        </div>
      </div>

      {/* Right Side: Driving Action Buttons (Pedals + Nitro + Drift + Bell) */}
      <div className="absolute bottom-6 right-6 pointer-events-auto touch-none flex flex-col items-end gap-3">
        {/* Row 1: Nitro & Bell & Drift */}
        <div className="flex items-center gap-2.5">
          {/* Bell */}
          <button
            onTouchStart={() => engine?.ringBell()}
            className="w-12 h-12 rounded-full bg-sky-900/85 hover:bg-sky-800 border border-sky-500/70 text-sky-200 flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer"
            title="Bicycle Bell"
          >
            <Bell className="w-6 h-6" />
          </button>

          {/* Drift / Handbrake */}
          <button
            onTouchStart={() => {
              if (engine) engine.input.drift = true;
            }}
            onTouchEnd={() => {
              if (engine) engine.input.drift = false;
            }}
            className="w-12 h-12 rounded-full bg-purple-900/85 hover:bg-purple-800 border border-purple-500/70 text-purple-200 flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer"
            title="Drift"
          >
            <Disc3 className="w-6 h-6" />
          </button>

          {/* Super Nitro Boost */}
          <button
            onTouchStart={() => engine?.activateNitro()}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 border-2 border-amber-300 text-slate-950 font-black flex items-center justify-center shadow-xl active:scale-90 transition cursor-pointer"
            title="Nitro Boost"
          >
            <Flame className="w-7 h-7 fill-current" />
          </button>
        </div>

        {/* Row 2: Gas & Brake Pedals */}
        <div className="flex items-center gap-3">
          {/* Brake / Reverse Pedal */}
          <button
            onTouchStart={() => {
              if (engine) engine.input.backward = true;
            }}
            onTouchEnd={() => {
              if (engine) engine.input.backward = false;
            }}
            className="w-16 h-20 rounded-2xl bg-red-950/85 hover:bg-red-900 border-2 border-red-500 text-red-200 font-black text-xs flex flex-col items-center justify-center shadow-xl active:scale-95 transition cursor-pointer"
          >
            <span className="text-base mb-1">🛑</span>
            <span>{isFa ? 'ترمز' : 'Brake'}</span>
          </button>

          {/* Gas / Accelerate Pedal */}
          <button
            onTouchStart={() => {
              if (engine) engine.input.forward = true;
            }}
            onTouchEnd={() => {
              if (engine) engine.input.forward = false;
            }}
            className="w-18 h-24 rounded-2xl bg-emerald-950/85 hover:bg-emerald-900 border-2 border-emerald-400 text-emerald-200 font-black text-sm flex flex-col items-center justify-center shadow-xl active:scale-95 transition cursor-pointer"
          >
            <span className="text-xl mb-1">⚡</span>
            <span>{isFa ? 'گاز' : 'GAS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
