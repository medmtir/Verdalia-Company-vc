"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n/context";
import dynamic from 'next/dynamic';
const QuoteModal = dynamic(() => import('@/components/ui/QuoteModal').then(m => m.QuoteModal), { ssr: false });
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Globe,
  Droplets,
  CheckCircle2,
  Container,
  Ship,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
} from "lucide-react";

export default function HomePage() {
  const { dict, locale, dir } = useI18n();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleOpenQuote = (productName = "") => {
    setSelectedProduct(productName);
    setQuoteModalOpen(true);
  };

  const certsList = [
    { name: "BRC Food", code: "BRC", file: "brc.svg", desc: "Global Standard" },
    { name: "ISO 22000", code: "ISO", file: "iso22000.svg", desc: "Food Safety" },
    { name: "IFS Food", code: "IFS", file: "ifs.svg", desc: "International Standard" },
    { name: "Biologique", code: "BIO", file: "organic.svg", desc: "Certified Organic" },
    { name: "Halal", code: "HALAL", file: "halal.svg", desc: "Sharia Compliant" },
    { name: "Kosher", code: "KOSHER", file: "kosher.svg", desc: "Supervised Facility" },
  ];

  const productsPreview = [
    {
      name:
        locale === "fr"
          ? "Huile d'Olive Biologique"
          : locale === "ar"
          ? "زيت زيتون بيولوجي عضوي"
          : locale === "es"
          ? "Aceite de Oliva Ecológico"
          : locale === "it"
          ? "Olio d'Oliva Biologico"
          : "Organic Olive Oil",
      badge: "ORGANIC",
      desc:
        locale === "fr"
          ? "Huile bio certifiée, pressée à froid — goût franc, lots stables pour l'export."
          : locale === "ar"
          ? "زيت عضوي معتمد، عصر بارد، بطعم صافٍ ودفعات ثابتة للتصدير."
          : "Certified organic, cold-pressed — clean taste, steady lots for export buyers.",
      image: "/images/products/olive-bio.jpg",
      formats: "Flexitank · IBC · Fûts 200L",
      slug: "organic-olive-oil",
    },
    {
      name:
        locale === "fr"
          ? "Huile d'Olive Vierge Extra"
          : locale === "ar"
          ? "زيت زيتون بكر ممتاز"
          : locale === "es"
          ? "Aceite de Oliva Virgen Extra"
          : locale === "it"
          ? "Olio Extra Vergine di Oliva"
          : "Extra Virgin Olive Oil",
      badge: "EXTRA VIRGIN",
      desc:
        locale === "fr"
          ? "Acidité basse, notes fruitées — grade demandé par les importateurs alimentaires."
          : locale === "ar"
          ? "حموضة منخفضة ونكهة فاكهية — الدرجة المطلوبة لدى مستوردي الأغذية."
          : "Low acidity, fruity notes — the grade food importers ask for most.",
      image: "/images/products/extra-vierge.jpg",
      formats: "Flexitank · IBC · Fûts 200L",
      slug: "extra-virgin-olive-oil",
    },
    {
      name:
        locale === "fr"
          ? "Huile d'Olive Raffinée"
          : locale === "ar"
          ? "زيت زيتون مكرر"
          : locale === "es"
          ? "Aceite de Oliva Refinado"
          : locale === "it"
          ? "Olio d'Oliva Raffinato"
          : "Refined Olive Oil",
      badge: "INDUSTRIE",
      desc:
        locale === "fr"
          ? "Goût neutre, bonne tenue à la chaleur — pour fabricants et transformateurs."
          : locale === "ar"
          ? "طعم محايد وثبات حراري جيد — للمصانع ومعامل التحويل الغذائي."
          : "Neutral taste, solid heat stability — for food manufacturers and processors.",
      image: "/images/products/raffine.jpg",
      formats: "Flexitank · IBC · Fûts 200L",
      slug: "refined-olive-oil",
    },
    {
      name:
        locale === "fr"
          ? "Huile de Grignons d'Olive"
          : locale === "ar"
          ? "زيت تفل الزيتون"
          : locale === "es"
          ? "Aceite de Orujo de Oliva"
          : locale === "it"
          ? "Olio di Sansa di Oliva"
          : "Olive Pomace Oil",
      badge: "B2B",
      desc:
        locale === "fr"
          ? "Option économique pour la restauration et les usages industriels à volume."
          : locale === "ar"
          ? "خيار اقتصادي للمطاعم والاستخدام الصناعي بكميات كبيرة."
          : "A practical grade for catering and high-volume industrial cooking.",
      image: "/images/products/grignons.jpg",
      formats: "Flexitank · IBC · Fûts 200L",
      slug: "olive-pomace-oil",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-verdalia-offwhite text-verdalia-dark" dir={dir}>
      <Header />

      <main className="flex-grow pt-16">
        {/* Hero */}
        <section className="relative min-h-[88vh] flex items-end md:items-center overflow-hidden bg-[#203A1A]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/facility/storage-tanks.jpg"
              alt="Unités de stockage Verdalia — huile d'olive en vrac Tunisie"
              fill
              priority
              className="object-cover object-center opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#172B13]/85 via-[#203A1A]/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#152511]/90 via-transparent to-[#203A1A]/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full text-white">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-verdalia-gold mb-5">
                {dict.hero.badge}
              </p>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold leading-[1.1] tracking-tight mb-5 sm:mb-6">
                {dict.hero.title}{" "}
                <span className="italic font-normal text-verdalia-gold block sm:inline">
                  {dict.hero.titleAccent}
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-gray-200/95 font-light leading-relaxed mb-8 sm:mb-10 max-w-xl">
                {dict.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Link
                  href="/products"
                  className="btn-gold px-8 py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 text-center shadow-lg"
                >
                  <span>{dict.hero.discoverBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleOpenQuote()}
                  className="px-8 py-3.5 sm:py-4 text-xs font-bold tracking-widest uppercase text-white rounded border border-white/35 hover:bg-white hover:text-verdalia-dark transition-all duration-300 text-center"
                >
                  {dict.hero.quoteBtn}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            2. TRUST & KEY FEATURES STRIP
            ==================================================== */}
        <section className="bg-verdalia-beige/80 border-y border-verdalia-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-verdalia-border/80">
              <div className="flex items-center gap-4 py-2 md:py-0 md:px-6">
                <div className="w-12 h-12 rounded-full bg-verdalia-olive/10 flex items-center justify-center flex-shrink-0 text-verdalia-olive">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-verdalia-dark">
                    {dict.trustStrip.originTitle}
                  </h4>
                  <p className="text-xs text-verdalia-gray mt-0.5">
                    {dict.trustStrip.originDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-2 md:py-0 md:px-6">
                <div className="w-12 h-12 rounded-full bg-verdalia-olive/10 flex items-center justify-center flex-shrink-0 text-verdalia-olive">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-verdalia-dark">
                    {dict.trustStrip.pressTitle}
                  </h4>
                  <p className="text-xs text-verdalia-gray mt-0.5">
                    {dict.trustStrip.pressDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-2 md:py-0 md:px-6">
                <div className="w-12 h-12 rounded-full bg-verdalia-olive/10 flex items-center justify-center flex-shrink-0 text-verdalia-olive">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-verdalia-dark">
                    {dict.trustStrip.exportTitle}
                  </h4>
                  <p className="text-xs text-verdalia-gray mt-0.5">
                    {dict.trustStrip.exportDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            3. ABOUT US ASYMMETRICAL EDITORIAL SECTION
            ==================================================== */}
        <section className="py-24 bg-verdalia-offwhite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Photo Collage Column */}
              <div className="lg:col-span-6 relative pb-12 lg:pb-0">
                <div className="relative z-10 w-4/5 rounded-lg overflow-hidden shadow-luxury border-4 border-white aspect-[4/3]">
                  <Image
                    src="/images/facility/storage-tanks.jpg"
                    alt="Citernes de stockage Verdalia"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="absolute -bottom-8 -right-2 sm:right-4 z-20 w-3/5 rounded-lg overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                  <Image
                    src="/images/facility/tanker-truck.jpg"
                    alt="Flotte de transport citerne Verdalia"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Stamp */}
                <div className="absolute -bottom-6 left-6 z-30 w-24 h-24 rounded-full bg-verdalia-beige border-2 border-verdalia-gold flex flex-col items-center justify-center text-center shadow-lg p-2">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-verdalia-olive">
                    Tunisia
                  </span>
                  <span className="font-serif text-xs font-extrabold text-verdalia-dark leading-tight">
                    ORIGINE
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-verdalia-gold font-bold">
                    100%
                  </span>
                </div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
                  {dict.aboutSection.badge}
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark leading-tight">
                  {dict.aboutSection.title}
                </h2>

                <p className="text-sm text-verdalia-gray leading-relaxed">
                  {dict.aboutSection.desc1}
                </p>

                <p className="text-sm text-verdalia-gray leading-relaxed">
                  {dict.aboutSection.desc2}
                </p>

                {/* Bullet Points */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-verdalia-olive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-verdalia-dark">
                        {dict.aboutSection.point1Title}
                      </h4>
                      <p className="text-xs text-verdalia-gray mt-0.5">
                        {dict.aboutSection.point1Desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-verdalia-olive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-verdalia-dark">
                        {dict.aboutSection.point2Title}
                      </h4>
                      <p className="text-xs text-verdalia-gray mt-0.5">
                        {dict.aboutSection.point2Desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-verdalia-olive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-verdalia-dark">
                        {dict.aboutSection.point3Title}
                      </h4>
                      <p className="text-xs text-verdalia-gray mt-0.5">
                        {dict.aboutSection.point3Desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/about" className="btn-primary">
                    {dict.aboutSection.learnMoreBtn} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            4. PRODUCTS SHOWCASE (Bottles Line-up & Cards)
            ==================================================== */}
        <section className="py-24 bg-verdalia-cream border-t border-verdalia-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
                  {dict.productsSection.badge}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark mt-2">
                  {dict.productsSection.title}
                </h2>
                <p className="text-sm text-verdalia-gray mt-2 max-w-xl">
                  {dict.productsSection.subtitle}
                </p>
              </div>

              <Link href="/products" className="btn-secondary">
                {dict.productsSection.viewAllBtn} →
              </Link>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {productsPreview.map((prod) => (
                <div
                  key={prod.slug}
                  className="bg-white rounded-lg border border-verdalia-border overflow-hidden shadow-card card-hover flex flex-col"
                >
                  <div className="relative aspect-[4/3] img-zoom-container bg-verdalia-beige/30">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-verdalia-dark/90 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                      {prod.badge}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-verdalia-dark mb-2">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-verdalia-gray leading-relaxed mb-4">
                        {prod.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-verdalia-border/60">
                      <p className="text-[10px] uppercase tracking-wider text-verdalia-olive font-semibold mb-3">
                        {prod.formats}
                      </p>
                      <button
                        onClick={() => handleOpenQuote(prod.name)}
                        className="w-full btn-primary py-2.5 text-xs font-semibold"
                      >
                        {dict.productsSection.requestInfoBtn}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================
            5. WHY CHOOSE VERDALIA
            ==================================================== */}
        <section className="py-24 bg-verdalia-offwhite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
                {dict.whyChooseUs.badge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark mt-2">
                {dict.whyChooseUs.title}
              </h2>
              <p className="text-sm text-verdalia-gray mt-2">
                {dict.whyChooseUs.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-white rounded-lg border border-verdalia-border shadow-card card-hover">
                <div className="w-12 h-12 rounded-lg bg-verdalia-olive/10 text-verdalia-olive flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-verdalia-dark mb-2">
                  {dict.whyChooseUs.item1Title}
                </h3>
                <p className="text-xs text-verdalia-gray leading-relaxed">
                  {dict.whyChooseUs.item1Desc}
                </p>
              </div>

              <div className="p-8 bg-white rounded-lg border border-verdalia-border shadow-card card-hover">
                <div className="w-12 h-12 rounded-lg bg-verdalia-olive/10 text-verdalia-olive flex items-center justify-center mb-6">
                  <Container className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-verdalia-dark mb-2">
                  {dict.whyChooseUs.item2Title}
                </h3>
                <p className="text-xs text-verdalia-gray leading-relaxed">
                  {dict.whyChooseUs.item2Desc}
                </p>
              </div>

              <div className="p-8 bg-white rounded-lg border border-verdalia-border shadow-card card-hover">
                <div className="w-12 h-12 rounded-lg bg-verdalia-olive/10 text-verdalia-olive flex items-center justify-center mb-6">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-verdalia-dark mb-2">
                  {dict.whyChooseUs.item3Title}
                </h3>
                <p className="text-xs text-verdalia-gray leading-relaxed">
                  {dict.whyChooseUs.item3Desc}
                </p>
              </div>

              <div className="p-8 bg-white rounded-lg border border-verdalia-border shadow-card card-hover">
                <div className="w-12 h-12 rounded-lg bg-verdalia-olive/10 text-verdalia-olive flex items-center justify-center mb-6">
                  <Ship className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-verdalia-dark mb-2">
                  {dict.whyChooseUs.item4Title}
                </h3>
                <p className="text-xs text-verdalia-gray leading-relaxed">
                  {dict.whyChooseUs.item4Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cinematic Journey Video Section */}
        <section className="relative py-20 bg-[#142611] text-white overflow-hidden border-y border-verdalia-gold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-verdalia-gold">
                {locale === "fr" ? "Du Terroir aux Ports Mondiaux" : locale === "ar" ? "من مزارع تونس إلى موانئ العالم" : "From Grove to Global Ports"}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
                {locale === "fr" ? "L'Odyssée de l'Huile Verdalia" : locale === "ar" ? "رحلة زيت الزيتون فيرداليا" : "The Verdalia Olive Oil Journey"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-3 font-light leading-relaxed">
                {locale === "fr"
                  ? "Suivez le parcours complet : récolte, pressage à froid, stockage sous azote, conditionnement sécurisé et expédition maritime internationale."
                  : locale === "ar"
                  ? "شاهد مسار الإنتاج والتصدير: من الجني والعصر البارد إلى التخزين الآمن والتحميل البحري عبر القارات."
                  : "Watch the seamless supply chain: harvesting, cold extraction, inert nitrogen storage, bulk packaging, and container vessel shipment."}
              </p>
            </div>

            {/* Video Player Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-verdalia-gold/30 bg-black aspect-video max-w-5xl mx-auto group">
              <video
                ref={videoRef}
                src="/videos/verdalia-final.mp4"
                poster="/images/facility/storage-tanks.jpg"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Video Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Top Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-white/90">
                  Verdalia Global Logistics
                </span>
              </div>

              {/* Video Controls Bar */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleVideoPlay}
                    className="w-10 h-10 rounded-full bg-verdalia-gold hover:bg-verdalia-gold/90 text-verdalia-dark flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={toggleVideoMute}
                    className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-colors"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        if (videoRef.current.requestFullscreen) {
                          videoRef.current.requestFullscreen();
                        }
                      }
                    }}
                    className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-colors hidden sm:flex"
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-white/80 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <span>⚓ Port de Radès & Sousse</span>
                  <span>•</span>
                  <span>🚢 45+ Destinations</span>
                </div>
              </div>
            </div>

            {/* Packaging Preview Cards underneath video */}
            <div className="mt-14 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                    {locale === "fr" ? "Conditionnements Disponibles à l'Export" : locale === "ar" ? "أشكال التعبئة المتوفرة للتصدير" : "Available Export Formats"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {locale === "fr" ? "Solutions adaptées aux volumes industriels et semi-vrac" : locale === "ar" ? "حلول ملائمة للكميات الصناعية والتوزيع" : "Tailored solutions for industrial bulk and distribution"}
                  </p>
                </div>
                <Link href="/export" className="text-xs font-bold text-verdalia-gold hover:underline flex items-center gap-1 self-start sm:self-auto">
                  <span>{locale === "fr" ? "Voir tous les formats" : locale === "ar" ? "عرض جميع الأنواع" : "View all formats"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 hover:bg-white/10 transition-colors group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-black/40 mb-3">
                    <Image
                      src="/images/packaging/ibc-container.jpg"
                      alt="IBC Container Verdalia"
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-verdalia-gold uppercase tracking-wider">1 000 Litres</div>
                  <div className="text-xs font-bold text-white mt-0.5">Conteneur IBC</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 hover:bg-white/10 transition-colors group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-black/40 mb-3">
                    <Image
                      src="/images/packaging/steel-drum.jpg"
                      alt="Steel Drum Verdalia"
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-verdalia-gold uppercase tracking-wider">208 Litres</div>
                  <div className="text-xs font-bold text-white mt-0.5">Fûts Acier Scellés</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 hover:bg-white/10 transition-colors group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-black/40 mb-3">
                    <Image
                      src="/images/packaging/pails-buckets.jpg"
                      alt="Pails Verdalia"
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-verdalia-gold uppercase tracking-wider">10L – 25L</div>
                  <div className="text-xs font-bold text-white mt-0.5">Seaux PEHD Food-grade</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 hover:bg-white/10 transition-colors group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-black/40 mb-3">
                    <Image
                      src="/images/facility/port-containers.jpg"
                      alt="Flexitank Container Verdalia"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-verdalia-gold uppercase tracking-wider">24 000 Litres</div>
                  <div className="text-xs font-bold text-white mt-0.5">Flexitank 20ft FCL</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            7. OFFICIAL CERTIFICATIONS PREVIEW
            ==================================================== */}
        <section className="py-24 bg-verdalia-offwhite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
                  {dict.certificationsSection.badge}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark mt-2">
                  {dict.certificationsSection.title}
                </h2>
                <p className="text-sm text-verdalia-gray mt-2 max-w-xl">
                  {dict.certificationsSection.subtitle}
                </p>
              </div>

              <Link href="/certifications" className="btn-secondary">
                {dict.certificationsSection.viewAllBtn} →
              </Link>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {certsList.map((c) => (
                <div
                  key={c.code}
                  className="bg-white p-6 rounded-xl border border-verdalia-border shadow-card card-hover flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 relative mb-4">
                    <Image
                      src={`/images/certs/${c.file}`}
                      alt={c.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-serif text-xs font-bold text-verdalia-dark uppercase tracking-wider">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-verdalia-gray mt-1">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="relative py-20 text-white text-center overflow-hidden bg-[#203A1A]">
          <div className="absolute inset-0 z-0 opacity-25">
            <Image
              src="/images/facility/storage-tanks.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-[#203A1A]/80" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {dict.contactCta.title}
            </h2>
            <p className="text-sm sm:text-base text-verdalia-light/90 max-w-2xl mx-auto mb-8 font-light">
              {dict.contactCta.subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleOpenQuote()}
                className="btn-gold px-8 py-4 text-xs font-bold tracking-widest uppercase"
              >
                {dict.contactCta.btn}
              </button>
              <Link
                href="/contact"
                className="px-8 py-4 text-xs font-bold tracking-widest uppercase text-white rounded border border-white/30 hover:bg-white/10 transition-colors"
              >
                Contact direct
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultProduct={selectedProduct}
      />
    </div>
  );
}
