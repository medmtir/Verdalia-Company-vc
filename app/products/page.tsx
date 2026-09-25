"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n/context";
import dynamic from 'next/dynamic';
const QuoteModal = dynamic(() => import('@/components/ui/QuoteModal').then(m => m.QuoteModal), { ssr: false });
import { Product } from "@/lib/types";
import {
  ArrowRight,
  Package,
  Droplet,
  Layers,
  Sparkles,
  Scale,
  FileText,
  SlidersHorizontal,
} from "lucide-react";

export default function ProductsPage() {
  const { dict, locale, dir } = useI18n();
  const pp = dict.productsPage;
  const ps = dict.productsSection;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    fetch("/api/admin/products?activeOnly=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleRequestQuote = (prodName: string) => {
    setSelectedProduct(prodName);
    setQuoteModalOpen(true);
  };

  const filtered =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.slug.includes(activeFilter));

  const filterButtons = [
    { id: "all", label: pp.filters.all },
    { id: "organic", label: pp.filters.organic },
    { id: "extra-virgin", label: pp.filters.extraVirgin },
    { id: "refined", label: pp.filters.refined },
    { id: "pomace", label: pp.filters.pomace },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-verdalia-offwhite text-verdalia-dark" dir={dir}>
      <Header />

      <main className="flex-grow pt-24 pb-20">
        {/* Banner */}
        <section className="relative py-20 bg-[#203A1A] text-white overflow-hidden mb-16">
          <div className="absolute inset-0 z-0 opacity-30">
            <Image
              src="/images/facility/storage-tanks.jpg"
              alt="Huile d'olive tunisienne"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-verdalia-gold">
              {pp.bannerBadge}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">
              {pp.bannerTitle}{" "}
              <br className="hidden sm:inline" />
              <span className="italic font-normal text-verdalia-gold">
                {pp.bannerTitleAccent}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-4 leading-relaxed font-light">
              {pp.bannerSubtitle}
            </p>
          </div>
        </section>

        {/* Catalog Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-verdalia-border">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-verdalia-olive" />
              <span className="text-xs font-bold uppercase tracking-wider text-verdalia-dark">
                {pp.categoriesLabel}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {filterButtons.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                    activeFilter === filter.id
                      ? "bg-verdalia-olive text-white shadow-sm"
                      : "bg-verdalia-beige/60 text-verdalia-dark hover:bg-verdalia-beige"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products List */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-4 border-verdalia-olive border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs text-verdalia-gray uppercase tracking-widest">
                {pp.loading}
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {filtered.map((prod, index) => {
                const t = prod.translations[locale] || prod.translations.en;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={prod.id}
                    id={prod.slug}
                    className="bg-white rounded-xl border border-verdalia-border shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                  >
                    {/* Image Column */}
                    <div
                      className={`lg:col-span-5 relative aspect-[4/3] lg:aspect-square bg-verdalia-beige/30 ${
                        isEven ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <Image
                        src={prod.image_url}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-verdalia-dark text-verdalia-gold text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded">
                        100% Tunisian Origin
                      </div>
                    </div>

                    {/* Content Column */}
                    <div
                      className={`lg:col-span-7 p-8 sm:p-10 ${
                        isEven ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <div className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive mb-2">
                        {prod.specs.variety}
                      </div>

                      <h2 className="font-serif text-3xl font-bold text-verdalia-dark mb-4">
                        {t.name}
                      </h2>

                      <p className="text-sm text-verdalia-gray leading-relaxed mb-6">
                        {t.full_description || t.short_description}
                      </p>

                      {/* Technical Specs Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-verdalia-offwhite rounded-lg border border-verdalia-border mb-6">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-verdalia-gray tracking-wider block">
                            {ps.specs.acidity}
                          </span>
                          <span className="font-serif text-sm font-bold text-verdalia-olive">
                            {prod.specs.acidity}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-verdalia-gray tracking-wider block">
                            {ps.specs.extraction}
                          </span>
                          <span className="text-xs font-semibold text-verdalia-dark">
                            {prod.specs.extraction}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-verdalia-gray tracking-wider block">
                            {ps.specs.moq}
                          </span>
                          <span className="text-xs font-semibold text-verdalia-dark">
                            {prod.specs.moq}
                          </span>
                        </div>
                      </div>

                      {/* Formats export */}
                      <div className="mb-8">
                        <span className="text-xs font-bold uppercase tracking-wider text-verdalia-dark block mb-2">
                          {pp.formatsLabel}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {t.formats?.map((fmt, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs bg-verdalia-beige/60 rounded border border-verdalia-border text-verdalia-dark"
                            >
                              {fmt}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => handleRequestQuote(t.name)}
                          className="btn-primary"
                        >
                          {pp.quoteBtn}: {t.name}
                        </button>
                        <Link
                          href={`/products/${prod.slug}`}
                          className="btn-secondary"
                        >
                          {pp.specsBtn} →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bulk & Food-Grade Packaging Formats Showcase */}
          <section className="mt-24 pt-16 border-t border-verdalia-border">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
                {locale === "fr" ? "Conditionnements Vrac & Restauration" : locale === "ar" ? "أشكال التعبئة والتغليف" : "Bulk & Food-Grade Packagings"}
              </span>
              <h2 className="font-serif text-3xl font-bold text-verdalia-dark mt-2">
                {locale === "fr" ? "Formats Disponibles pour l'Industrie et le CHR" : locale === "ar" ? "خيارات التعبئة للمصانع والمطاعم والموزعين" : "Available Packaging for Industry & Foodservice"}
              </h2>
              <p className="text-xs sm:text-sm text-verdalia-gray mt-2">
                {locale === "fr"
                  ? "Toutes nos huiles sont livrables dans des contenants neufs certifiés conformes aux normes sanitaires et logistiques internationales."
                  : locale === "ar"
                  ? "نوفر جميع زيوتنا في عبوات مطابقة لأعلى المعايير الصحية العالمية مع حماية ضد الأكسدة."
                  : "All olive oils are delivered in food-grade, certified export containers with full lot traceability."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-verdalia-border shadow-card p-5 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-lg bg-verdalia-beige/30 overflow-hidden mb-4 border border-verdalia-border">
                    <Image
                      src="/images/packaging/ibc-container.jpg"
                      alt="IBC Container Verdalia"
                      fill
                      className="object-contain p-2 hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-verdalia-olive bg-verdalia-olive/10 px-2 py-0.5 rounded">
                    1 000 Litres
                  </span>
                  <h3 className="font-serif text-base font-bold text-verdalia-dark mt-2">
                    {locale === "fr" ? "Cuve IBC avec armature" : locale === "ar" ? "خزان IBC مع قفص فولاذي" : "IBC Tote Tank"}
                  </h3>
                  <p className="text-xs text-verdalia-gray mt-1 leading-relaxed">
                    {locale === "fr"
                      ? "Idéal pour distributeurs et transformateurs intermédiaires. Vanne scellée et palette intégrée."
                      : locale === "ar"
                      ? "مناسب للمصانع والموزعين الإقليميين، مزود بصمام تفريغ وقاعدة باليت متينة."
                      : "Designed for intermediate processors and distributors with protective cage and bottom valve."}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-verdalia-border shadow-card p-5 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-lg bg-verdalia-beige/30 overflow-hidden mb-4 border border-verdalia-border">
                    <Image
                      src="/images/packaging/steel-drum.jpg"
                      alt="Steel Drum Verdalia"
                      fill
                      className="object-contain p-2 hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-verdalia-olive bg-verdalia-olive/10 px-2 py-0.5 rounded">
                    208 Litres (~190 kg)
                  </span>
                  <h3 className="font-serif text-base font-bold text-verdalia-dark mt-2">
                    {locale === "fr" ? "Fût Acier Alimentaire" : locale === "ar" ? "برميل فولاذي غذائي" : "Food-grade Steel Drum"}
                  </h3>
                  <p className="text-xs text-verdalia-gray mt-1 leading-relaxed">
                    {locale === "fr"
                      ? "Vernis intérieur alimentaire de haute pureté, hermétique sous atmosphère protectrice d'azote."
                      : locale === "ar"
                      ? "مطلي داخلياً بمادة غذائية عازلة ومحكم الإغلاق تحت النيتروجين لحفظ الطعم والنقاء."
                      : "Epoxy-lined food-grade drums, hermetically sealed under nitrogen for optimal preservation."}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-verdalia-border shadow-card p-5 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-lg bg-verdalia-beige/30 overflow-hidden mb-4 border border-verdalia-border">
                    <Image
                      src="/images/packaging/pails-buckets.jpg"
                      alt="Seaux et bidons Verdalia"
                      fill
                      className="object-contain p-2 hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-verdalia-olive bg-verdalia-olive/10 px-2 py-0.5 rounded">
                    10L & 20L
                  </span>
                  <h3 className="font-serif text-base font-bold text-verdalia-dark mt-2">
                    {locale === "fr" ? "Seaux & Bidons PEHD" : locale === "ar" ? "سلات وأوعية PEHD" : "Food-grade HDPE Pails"}
                  </h3>
                  <p className="text-xs text-verdalia-gray mt-1 leading-relaxed">
                    {locale === "fr"
                      ? "Poignée ergonomique, bec verseur et bouchon scellé inviolable pour la restauration et les cuisines centrales."
                      : locale === "ar"
                      ? "مزودة بمقابض وأغطية أمان غير قابلة للتلاعب، مثالية للمطاعم ومطابخ الفنادق."
                      : "Rigid pails with tamper-evident seal and ergonomic carry handle for commercial kitchens."}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-verdalia-border shadow-card p-5 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square rounded-lg bg-verdalia-beige/30 overflow-hidden mb-4 border border-verdalia-border">
                    <Image
                      src="/images/packaging/bag-in-box.jpg"
                      alt="Bag in box Verdalia"
                      fill
                      className="object-contain p-2 hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-verdalia-olive bg-verdalia-olive/10 px-2 py-0.5 rounded">
                    3L & 5L
                  </span>
                  <h3 className="font-serif text-base font-bold text-verdalia-dark mt-2">
                    {locale === "fr" ? "Bag-in-Box Hermétique" : locale === "ar" ? "أكياس كرتونية مفرغة من الهواء" : "Bag-in-Box Cartons"}
                  </h3>
                  <p className="text-xs text-verdalia-gray mt-1 leading-relaxed">
                    {locale === "fr"
                      ? "Poche sous vide avec robinet anti-retour : zéro contact avec l'air même après ouverture continue."
                      : locale === "ar"
                      ? "صمام ذكي مانع لمرور الهواء يضمن حماية تامة للزيت من الأكسدة حتى بعد الفتح."
                      : "Vacuum-sealed inner bag prevents oxidation after multiple dispensing uses."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
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
