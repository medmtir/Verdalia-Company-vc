"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n/context";
import dynamic from 'next/dynamic';
const QuoteModal = dynamic(() => import('@/components/ui/QuoteModal').then(m => m.QuoteModal), { ssr: false });
import { Certification } from "@/lib/types";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  FileCheck,
  FileText,
  ExternalLink,
  FlaskConical,
  Microscope,
  Scale,
} from "lucide-react";

export default function CertificationsPage() {
  const { dict, locale, dir } = useI18n();
  const cp = dict.certificationsPage;
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/certifications?activeOnly=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.certifications) {
          setCertifications(data.certifications);
        }
      })
      .catch((err) => console.error("Error loading certs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-verdalia-offwhite text-verdalia-dark" dir={dir}>
      <Header />

      <main className="flex-grow pt-24 pb-20">
        {/* Banner */}
        <section className="relative py-20 bg-[#203A1A] text-white overflow-hidden mb-16">
          <div className="absolute inset-0 z-0 opacity-25">
            <Image
              src="/images/facility/storage-detail.jpg"
              alt="Quality and Certifications"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-verdalia-gold">
              {cp.bannerBadge}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">
              {cp.bannerTitle} <br className="hidden sm:inline" />
              <span className="italic font-normal text-verdalia-gold">
                {cp.bannerTitleAccent}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-4 leading-relaxed font-light">
              {cp.bannerSubtitle}
            </p>
          </div>
        </section>

        {/* Certifications Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
              {cp.auditBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark mt-2">
              {cp.auditTitle}
            </h2>
            <p className="text-sm text-verdalia-gray mt-2">
              {cp.auditSubtitle}
            </p>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-4 border-verdalia-olive border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs text-verdalia-gray uppercase tracking-widest">
                {cp.loading}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map((cert) => {
                const t = cert.translations[locale] || cert.translations.en;
                return (
                  <div
                    key={cert.id}
                    className="bg-white rounded-xl border border-verdalia-border shadow-card p-8 card-hover flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-20 h-20 relative">
                          <Image
                            src={cert.badge_url}
                            alt={t.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-verdalia-olive/10 text-verdalia-olive">
                          {cert.code}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-verdalia-dark mb-1">
                        {t.name}
                      </h3>
                      <p className="text-xs font-semibold text-verdalia-gold uppercase tracking-wider mb-3">
                        {t.issuer}
                      </p>
                      <p className="text-xs text-verdalia-gray leading-relaxed mb-6">
                        {t.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-verdalia-border/70 text-xs">
                      {cert.cert_number && (
                        <div className="flex justify-between mb-2">
                          <span className="text-verdalia-gray">Cert Number:</span>
                          <span className="font-semibold text-verdalia-dark">
                            {cert.cert_number}
                          </span>
                        </div>
                      )}

                      {cert.document_url ? (
                        <a
                          href={cert.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-verdalia-olive font-bold hover:underline mt-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Official Document</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-verdalia-gray italic">
                          Official copy provided upon formal RFQ
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quality Assurance & Laboratory Testing */}
        <section className="bg-verdalia-beige/60 py-24 border-y border-verdalia-border mb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
                  {cp.guaranteeBadge}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark leading-tight">
                  {cp.guaranteeTitle}
                </h2>
                <p className="text-sm text-verdalia-gray leading-relaxed">
                  {cp.guaranteeDesc}
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-verdalia-olive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-verdalia-dark">
                        {locale === "fr" ? "Pureté Chimique & Profil d'Acides Gras" : locale === "ar" ? "النقاء الكيميائي ومطابقة الأحماض الدهنية" : "Chemical Purity & Fatty Acid Profile"}
                      </h4>
                      <p className="text-xs text-verdalia-gray mt-0.5">
                        {locale === "fr" ? "Acidité libre, indice de peroxyde, absorbance UV (K232, K270) et composition stérolique." : locale === "ar" ? "الحموضة الحرة، مؤشر البيروكسيد، الامتصاص الطيفي UV وتركيبة الستيرول." : "Free acidity (FFA), peroxide value, UV spectrophotometric absorbance (K232, K270), and sterols."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-verdalia-olive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-verdalia-dark">
                        {locale === "fr" ? "Absence de Pesticides & Métaux Lourds" : locale === "ar" ? "خلو تام من المبيدات والمعادن الثقيلة" : "Pesticide & Heavy Metal Absence"}
                      </h4>
                      <p className="text-xs text-verdalia-gray mt-0.5">
                        {locale === "fr" ? "Analyses multi-résidus garantissant la conformité stricte aux limites UE et FDA." : locale === "ar" ? "فحوص مخبرية متعددة تضمن المطابقة التامة للمعايير الأوروبية والأمريكية." : "Multi-residue screening guaranteeing compliance with strict European and FDA limits."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-verdalia-olive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-verdalia-dark">
                        {locale === "fr" ? "Panel de Dégustation Sensorielle" : locale === "ar" ? "لجنة التذوق الحسي المعتمدة" : "Sensory Tasting Panel"}
                      </h4>
                      <p className="text-xs text-verdalia-gray mt-0.5">
                        {locale === "fr" ? "Évaluation par jury COI confirmant fruité, amertume, piquant et absence de défaut." : locale === "ar" ? "تقييم من خبراء تذوق معتمدين لتأكيد النكهة الفاكهية والخلو التام من العيوب." : "Assessment by certified sensory panels verifying fruitiness, bitterness, and zero defects."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl border border-verdalia-border shadow-card text-center">
                  <FlaskConical className="w-8 h-8 text-verdalia-olive mx-auto mb-3" />
                  <h4 className="font-serif text-lg font-bold mb-1">
                    {locale === "fr" ? "Acidité Libre" : locale === "ar" ? "الحموضة الحرة" : "Free Acidity"}
                  </h4>
                  <p className="text-xs text-verdalia-gray">
                    {locale === "fr" ? "Extra Vierge : < 0.4% (COI : 0.8%)" : locale === "ar" ? "بكر ممتاز: < 0.4% (حد COI: 0.8%)" : "Typical Extra Virgin: < 0.4%"}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-verdalia-border shadow-card text-center">
                  <Microscope className="w-8 h-8 text-verdalia-olive mx-auto mb-3" />
                  <h4 className="font-serif text-lg font-bold mb-1">
                    {locale === "fr" ? "Indice de Peroxyde" : locale === "ar" ? "مؤشر البيروكسيد" : "Peroxide Value"}
                  </h4>
                  <p className="text-xs text-verdalia-gray">
                    {locale === "fr" ? "Contrôle strict : < 10 meq O2/kg" : locale === "ar" ? "رقابة صارمة: < 10 meq O2/kg" : "Strict control: < 10 meq O2/kg"}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-verdalia-border shadow-card text-center">
                  <Scale className="w-8 h-8 text-verdalia-gold mx-auto mb-3" />
                  <h4 className="font-serif text-lg font-bold mb-1">
                    {locale === "fr" ? "Hauts Polyphénols" : locale === "ar" ? "بوليفينول مرتفع" : "High Polyphenols"}
                  </h4>
                  <p className="text-xs text-verdalia-gray">
                    {locale === "fr" ? "Antioxydants naturels puissants" : locale === "ar" ? "مضادات أكسدة طبيعية فريدة" : "Exceptional natural antioxidants"}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-verdalia-border shadow-card text-center">
                  <ShieldCheck className="w-8 h-8 text-verdalia-gold mx-auto mb-3" />
                  <h4 className="font-serif text-lg font-bold mb-1">
                    {locale === "fr" ? "100% Traçable" : locale === "ar" ? "تتبع موثق 100%" : "100% Traceable"}
                  </h4>
                  <p className="text-xs text-verdalia-gray">
                    {locale === "fr" ? "Du verger au scellé conteneur" : locale === "ar" ? "من الحقل إلى ختم الحاوية" : "From registered groves to seal"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-serif text-3xl font-bold text-verdalia-dark mb-3">
            {cp.ctaTitle}
          </h3>
          <p className="text-xs sm:text-sm text-verdalia-gray max-w-xl mx-auto mb-8 leading-relaxed">
            {cp.ctaSubtitle}
          </p>
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="btn-primary"
          >
            {cp.ctaBtn} →
          </button>
        </div>
      </main>

      <Footer />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </div>
  );
}
