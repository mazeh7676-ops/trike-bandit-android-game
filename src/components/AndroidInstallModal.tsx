import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2, Copy, Check, ExternalLink, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'fa' | 'en';
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk'>('pwa');

  if (!isOpen) return null;

  const isFa = lang === 'fa';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) onClose();
    }
  };

  return (
    <div className={`fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 select-none ${isFa ? 'font-vazir' : 'font-rubik'}`} dir={isFa ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base sm:text-lg">
                {isFa ? 'نصب و اجرای بازی روی اندروید (Android)' : 'Install on Android / APK'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isFa ? 'اجرا به صورت اپلیکیشن مستقل تمام‌صفحه با آیکون اختصاصی' : 'Standalone fullscreen Android gaming experience'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 my-4 bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
              activeTab === 'pwa'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isFa ? '۱. نصب فوری (WebAPK)' : '1. WebAPK Install'}
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
              activeTab === 'apk'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isFa ? '۲. بیلد خودکار با GitHub Actions' : '2. GitHub Actions APK'}
          </button>
        </div>

        {/* Tab 1: Direct Android Install (WebAPK) */}
        {activeTab === 'pwa' && (
          <div className="flex flex-col gap-4 text-xs text-slate-300">
            {/* Direct Install CTA Button */}
            {isInstalled ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-600/50 flex items-center gap-3 text-emerald-300">
                <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
                <div>
                  <div className="font-bold text-sm">{isFa ? 'بازی روی دستگاه شما نصب است!' : 'Game is already installed!'}</div>
                  <div className="text-[11px] text-emerald-400/80">
                    {isFa ? 'می‌توانید بازی را از صفحه اصلی گوشی خود باز کنید.' : 'You are running the standalone Android application.'}
                  </div>
                </div>
              </div>
            ) : isInstallable ? (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/60 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-2xl shadow-lg shrink-0">
                    🚲
                  </div>
                  <div>
                    <div className="font-black text-white text-sm">
                      {isFa ? 'نصب با ۱ کلیک روی گوشی اندروید' : 'One-Tap Android Installation'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isFa ? 'بدون نیاز به دانلود فایل اضافی، مستقیم در لیست برنامه‌ها قرار می‌گیرد.' : 'Installs directly to home screen with custom icon and splash screen.'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {isFa ? 'همین حالا روی اندروید نصب کن' : 'Install on Android Now'}
                </button>
              </div>
            ) : null}

            {/* Manual Instructions for Chrome / Samsung Internet on Android */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                <span>📱</span>
                {isFa ? 'روش نصب در مرورگر گوگل کروم اندروید:' : 'Installation via Chrome on Android:'}
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed pr-1">
                <li>
                  {isFa ? 'در گوشی اندرویدی خود، لینک بازی را با مرورگر Chrome باز کنید.' : 'Open this game link in Chrome on your Android device.'}
                </li>
                <li>
                  {isFa ? 'منوی سه نقطه (⋮) بالا سمت راست یا چپ مرورگر را لمس کنید.' : 'Tap the three dots menu (⋮) in the top corner.'}
                </li>
                <li>
                  {isFa ? (
                    <>
                      گزینه <strong className="text-emerald-400">«نصب برنامه»</strong> یا <strong className="text-emerald-400">«افزودن به صفحه اصلی» (Add to Home screen)</strong> را بزنید.
                    </>
                  ) : (
                    <>
                      Select <strong className="text-emerald-400">"Install app"</strong> or <strong className="text-emerald-400">"Add to Home screen"</strong>.
                    </>
                  )}
                </li>
                <li>
                  {isFa
                    ? 'بازی فوراً با نام و آیکون اختصاصی سه‌چرخه شوتی روی صفحه گوشی شما می‌نشیند و به صورت تمام‌صفحه و آفلاین اجرا می‌شود!'
                    : 'The game will be added as a native-like app on your Android home screen!'}
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: GitHub Actions Automated APK Build */}
        {activeTab === 'apk' && (
          <div className="flex flex-col gap-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/60">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{isFa ? 'بیلد خودکار APK با هر Push در گیت‌هاب' : 'Automated GitHub Actions APK Build'}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isFa
                  ? 'یک گردش کار آماده (.github/workflows/build-android-apk.yml) در پروژه قرار داده شده است. به محض ارسال پروژه به گیت‌هاب، سرورهای رایگان گیت‌هاب پروژه را کامپایل کرده و فایل app-debug.apk را می‌سازند!'
                  : 'A pre-configured GitHub Actions workflow (.github/workflows/build-android-apk.yml) is ready in this repo. Whenever you push to GitHub, it automatically compiles and exports app-debug.apk!'}
              </p>
            </div>

            {/* Step 1: Push commands */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="font-bold text-white text-xs mb-1.5 flex items-center justify-between">
                <span>{isFa ? 'دستورات ارسال به گیت‌هاب:' : 'Commands to push to GitHub:'}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{isFa ? 'کلیک برای کپی' : 'Click to copy'}</span>
              </div>
              <div className="relative group bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                <code>git init<br />git add .<br />git commit -m "Tricycle Sheep Rustler Android Game"<br />git branch -M main<br />git remote add origin https://github.com/USER/REPO.git<br />git push -u origin main</code>
                <button
                  onClick={() => copyToClipboard('git init && git add . && git commit -m "Tricycle Sheep Rustler Android Game" && git branch -M main && git push -u origin main', 'git')}
                  className="absolute top-2 left-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  title="Copy"
                >
                  {copiedCmd === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 2: Download APK */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="font-bold text-white text-xs mb-1.5">
                {isFa ? 'نحوه دریافت فایل نصبی از گیت‌هاب:' : 'How to download the APK from GitHub:'}
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed pr-1">
                <li>{isFa ? 'در ریپازیتوری گیت‌هاب خود به تب Actions بروید.' : 'Go to the Actions tab in your GitHub repository.'}</li>
                <li>{isFa ? 'روی بیلد Build Android APK کلیک کنید.' : 'Click on the Build Android APK workflow.'}</li>
                <li>{isFa ? 'در انتهای صفحه از بخش Artifacts، فایل Tricycle-Sheep-Rustler-Android-APK را دانلود کنید.' : 'Under Artifacts, download Tricycle-Sheep-Rustler-Android-APK.'}</li>
                <li>{isFa ? 'فایل zip را اکسترکت کنید و app-debug.apk را روی گوشی نصب کنید!' : 'Unzip and install app-debug.apk on your Android phone!'}</li>
              </ol>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
          >
            {isFa ? 'فهمیدم / بستن' : 'Got it / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
