"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Smartphone,
  Download,
  Share,
  PlusSquare,
  CheckCircle2,
  X,
  ExternalLink,
  Laptop,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PwaInstallModal({ isOpen, onClose }: PwaInstallModalProps) {
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">("ios");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [activeTab, setActiveTab] = useState<"ios" | "android" | "desktop">("ios");

  useEffect(() => {
    // Detect if already installed / standalone
    const standaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standaloneMode);

    // Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIos) {
      setDeviceType("ios");
      setActiveTab("ios");
    } else if (isAndroid) {
      setDeviceType("android");
      setActiveTab("android");
    } else {
      setDeviceType("desktop");
      setActiveTab("desktop");
    }

    // Listen for Android beforeinstallprompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallAndroid = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Emerald Gradient */}
        <div className="bg-gradient-to-r from-[#172B13] via-[#203A1A] to-[#12220F] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 p-2 flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-inner">
              <Image
                src="/images/verdalia-logo.png"
                alt="Verdalia Admin"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E3CAA5] bg-white/10 px-2 py-0.5 rounded-full">
                  Application Mobile & Web
                </span>
                {isStandalone && (
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Installée
                  </span>
                )}
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                Installer Verdalia Admin
              </h2>
              <p className="text-xs text-gray-300 mt-0.5">
                Accédez à votre espace en 1 clic sans passer par le navigateur
              </p>
            </div>
          </div>

          {/* OS Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 mt-5 bg-black/25 p-1 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("ios")}
              className={`py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "ios"
                  ? "bg-white text-gray-900 shadow-md font-bold"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>🍎 iPhone / iPad</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("android")}
              className={`py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "android"
                  ? "bg-white text-gray-900 shadow-md font-bold"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>🤖 Android</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("desktop")}
              className={`py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "desktop"
                  ? "bg-white text-gray-900 shadow-md font-bold"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>💻 PC / Mac</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* iOS / iPhone Guide */}
          {activeTab === "ios" && (
            <div className="space-y-3.5">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  Sur <strong>iPhone (iOS)</strong>, Apple permet d&apos;installer Verdalia Admin directement depuis <strong>Safari</strong> sans passer par l&apos;App Store !
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Step 1 */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#172B13] text-[#E3CAA5] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs text-gray-700">
                    <p className="font-bold text-gray-900 mb-0.5">Ouvrez le lien dans Safari</p>
                    <p>
                      Assurez-vous d&apos;ouvrir votre portail admin dans le navigateur <strong>Safari</strong> de votre iPhone.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#172B13] text-[#E3CAA5] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-xs text-gray-700">
                    <p className="font-bold text-gray-900 mb-0.5 flex items-center gap-1.5">
                      <span>Touchez le bouton Partager</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                        <Share className="w-3 h-3" /> Partager (⎋)
                      </span>
                    </p>
                    <p>
                      C&apos;est le carré avec la flèche qui monte tout en bas au milieu de l&apos;écran de votre iPhone.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#172B13] text-[#E3CAA5] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-xs text-gray-700">
                    <p className="font-bold text-gray-900 mb-0.5 flex items-center gap-1.5">
                      <span>Sélectionnez « Sur l&apos;écran d&apos;accueil »</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        <PlusSquare className="w-3 h-3" /> +
                      </span>
                    </p>
                    <p>
                      Faites défiler le menu vers le bas et appuyez sur <strong>« Sur l&apos;écran d&apos;accueil »</strong> (ou <em>« Add to Home Screen »</em>).
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#172B13] text-[#E3CAA5] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="text-xs text-gray-700">
                    <p className="font-bold text-gray-900 mb-0.5">Touchez « Ajouter » en haut à droite</p>
                    <p>
                      Une icône luxury Verdalia s&apos;ajoutera instantanément sur votre écran d&apos;accueil à côté de vos autres applications !
                    </p>
                  </div>
                </div>
              </div>

              {/* iOS Benefit highlight */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Avantage Plein Écran :</strong> L&apos;application s&apos;ouvre sans la barre d&apos;adresse Safari, fluide, rapide et toujours connectée !
                </span>
              </div>
            </div>
          )}

          {/* Android Guide */}
          {activeTab === "android" && (
            <div className="space-y-3.5">
              {deferredPrompt ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Download className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-emerald-950 text-sm">
                    Installation 1-Clic Disponible !
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Votre appareil Android prend en charge l&apos;installation directe de l&apos;application.
                  </p>
                  <button
                    type="button"
                    onClick={handleInstallAndroid}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Installer Verdalia Admin Maintenant</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[#172B13] text-[#E3CAA5] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs text-gray-700">
                      <p className="font-bold text-gray-900 mb-0.5">Ouvrez Chrome sur Android</p>
                      <p>Accédez à votre espace administrateur dans Google Chrome.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[#172B13] text-[#E3CAA5] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs text-gray-700">
                      <p className="font-bold text-gray-900 mb-0.5">Touchez le menu (les 3 points ⋮)</p>
                      <p>En haut à droite de l&apos;écran dans Google Chrome.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[#172B13] text-[#E3CAA5] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs text-gray-700">
                      <p className="font-bold text-gray-900 mb-0.5">
                        Sélectionnez « Installer l&apos;application »
                      </p>
                      <p>Ou « Ajouter à l&apos;écran d&apos;accueil », puis confirmez.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  L&apos;application s&apos;installera comme une application APK native sur votre smartphone avec notifications et accès rapide.
                </span>
              </div>
            </div>
          )}

          {/* Desktop PC/Mac Guide */}
          {activeTab === "desktop" && (
            <div className="space-y-3.5">
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#172B13] text-[#E3CAA5] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs text-gray-700">
                    <p className="font-bold text-gray-900 mb-0.5">Sur Google Chrome ou Microsoft Edge</p>
                    <p>
                      Regardez tout à droite de la barre d&apos;adresse en haut du navigateur.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#172B13] text-[#E3CAA5] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-xs text-gray-700">
                    <p className="font-bold text-gray-900 mb-0.5">
                      Cliquez sur l&apos;icône d&apos;installation
                    </p>
                    <p>
                      Une petite icône d&apos;écran avec une flèche vers le bas ou un bouton « Installer » apparaît.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-[#172B13] text-[#E3CAA5] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-xs text-gray-700">
                    <p className="font-bold text-gray-900 mb-0.5">Application autonome sur votre bureau</p>
                    <p>
                      Verdalia Admin devient une véritable application indépendante dans votre barre des tâches Windows ou Dock macOS !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
