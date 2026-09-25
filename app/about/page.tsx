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
  ShieldCheck,
  CheckCircle2,
  Award,
  Users,
  Target,
  Eye,
  HeartHandshake,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react";

export default function AboutPage() {
  const { dict, locale, dir } = useI18n();
  const ap = dict.aboutPage;
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const values = [
    {
      title: locale === "fr" ? "Qualité" : locale === "ar" ? "الجودة العالية" : locale === "es" ? "Calidad" : locale === "it" ? "Qualità" : "Quality",
      desc:
        locale === "fr"
          ? "Contrôle organoleptique et physico-chimique systématique de chaque lot."
          : locale === "ar"
          ? "مراقبة دقيقة وشاملة لكافة الخصائص الكيميائية والحسية للزيت."
          : locale === "es"
          ? "Control organoléptico y físico-químico sistemático de cada lote."
          : locale === "it"
          ? "Controllo organolettico e chimico-fisico sistematico di ogni lotto."
          : "Systematic laboratory testing guaranteeing low acidity and high polyphenol contents.",
    },
    {
      title: locale === "fr" ? "Authenticité" : locale === "ar" ? "الأصالة التونسية" : locale === "es" ? "Autenticidad" : locale === "it" ? "Autenticità" : "Authenticity",
      desc:
        locale === "fr"
          ? "Origine 100% tunisienne issue des meilleurs terroirs ancestraux."
          : locale === "ar"
          ? "أصل تونسي 100% مستمد من أعرق حقول الزيتون المتوسطية."
          : locale === "es"
          ? "Origen 100% tunecino procedente de los mejores olivares ancestrales."
          : locale === "it"
          ? "Origine 100% tunisina dai migliori uliveti secolari."
          : "Pure Tunisian single-origin varieties reflecting centuries of Mediterranean heritage.",
    },
    {
      title: locale === "fr" ? "Confiance" : locale === "ar" ? "الثقة والمصداقية" : locale === "es" ? "Confianza" : locale === "it" ? "Fiducia" : "Trust",
      desc:
        locale === "fr"
          ? "Relations partenariales transparentes et contrats d'approvisionnement sécurisés."
          : locale === "ar"
          ? "علاقات تجارية شفافة وعقود توريد موثوقة ومضمونة."
          : locale === "es"
          ? "Relaciones de colaboración transparentes y contratos de suministro seguros."
          : locale === "it"
          ? "Rapporti di partnership trasparenti e contratti di fornitura garantiti."
          : "Long-term relationships built on total transparency and commercial honor.",
    },
    {
      title: locale === "fr" ? "Traçabilité" : locale === "ar" ? "التتبع والشفافية" : locale === "es" ? "Trazabilidad" : locale === "it" ? "Tracciabilità" : "Traceability",
      desc:
        locale === "fr"
          ? "Suivi rigoureux du verger au moulin et jusqu'au port d'embarquement."
          : locale === "ar"
          ? "تتبع دقيق من الحقل إلى المعصرة وحتى ميناء الشحن والتسليم."
          : locale === "es"
          ? "Seguimiento riguroso desde el olivar hasta el puerto de embarque."
          : locale === "it"
          ? "Tracciabilità rigorosa dall'uliveto fino al porto di imbarco."
          : "Unbroken audit trail from certified olive grove to container dispatch.",
    },
    {
      title: locale === "fr" ? "Professionnalisme" : locale === "ar" ? "الاحترافية" : locale === "es" ? "Profesionalismo" : locale === "it" ? "Professionalità" : "Professionalism",
      desc:
        locale === "fr"
          ? "Expertise export, respect des délais maritimes et accompagnement douanier."
          : locale === "ar"
          ? "خبرة تصديرية واسعة ودقة في مواعيد الشحن والتوثيق الجمركي."
          : locale === "es"
          ? "Experiencia en exportación, puntualidad marítima y gestión aduanera."
          : locale === "it"
          ? "Esperienza nell'export, puntualità marittima e supporto doganale."
          : "Punctual logistics, strict customs compliance, and dedicated client service.",
    },
    {
      title: locale === "fr" ? "Durabilité" : locale === "ar" ? "الاستدامة البيئية" : locale === "es" ? "Sostenibilidad" : locale === "it" ? "Sostenibilità" : "Sustainability",
      desc:
        locale === "fr"
          ? "Pratiques agricoles respectueuses des sols et valorisation des co-produits."
          : locale === "ar"
          ? "ممارسات فلاحية تحافظ على التربة وتثمن الموارد الطبيعية."
          : locale === "es"
          ? "Prácticas agrícolas respetuosas con el suelo y valoración de subproductos."
          : locale === "it"
          ? "Pratiche agricole rispettose del terreno e valorizzazione dei sottoprodotti."
          : "Environmental stewardship preserving soil fertility and promoting organic farming.",
    },
    {
      title: locale === "fr" ? "Satisfaction Client" : locale === "ar" ? "رضا الشركاء" : locale === "es" ? "Satisfacción del Cliente" : locale === "it" ? "Soddisfazione del Cliente" : "Customer Satisfaction",
      desc:
        locale === "fr"
          ? "Des solutions sur-mesure adaptées aux spécifications de chaque marché cible."
          : locale === "ar"
          ? "حلول تجارية ولوجستية مخصصة تلبي كافة متطلبات كل شريك دولي."
          : locale === "es"
          ? "Soluciones a medida adaptadas a las especificaciones de cada mercado."
          : locale === "it"
          ? "Soluzioni su misura adatte alle specifiche di ogni mercato di destinazione."
          : "Specs and volumes adapted to each importer — bulk formats only, no retail bottles.",
    },
  ];

  const leadership = [
    {
      name: "Iheb Boussalem",
      role: locale === "fr" ? "Directeur Général & Associé" : locale === "ar" ? "المدير التنفيذي وشريك" : "Managing Director & Partner",
      phone: "+216 53 228 867",
      email: "Bousalemiheb8@gmail.com",
      bio:
        locale === "fr"
          ? "Supervise la stratégie globale, les partenariats internationaux et les contrats commerciaux de gros volumes."
          : locale === "ar"
          ? "يشرف على التوجه الإستراتيجي، الشراكات الدولية وعقود التصدير الكبرى حول العالم."
          : "Oversees executive strategy, international partnerships, and high-volume commercial contracts worldwide.",
      cardImg: "/images/cards/iheb-boussalem.jpg",
    },
    {
      name: "Aymen Braham",
      role: locale === "fr" ? "Directeur Commercial & Associé" : locale === "ar" ? "مدير المبيعات وشريك" : "Sales Manager & Partner",
      phone: "+216 98 462 421",
      email: "aymen_braham@outlook.fr",
      bio:
        locale === "fr"
          ? "Pilote le développement des marchés internationaux, l'intégration des clients et la relation B2B."
          : locale === "ar"
          ? "يقود توسع المبيعات الدولية، مواءمة المواصفات الفنية وبناء علاقات العملاء في الأسواق الخارجية."
          : "Leads global market expansion, client onboarding, technical specifications alignment, and B2B customer relations.",
      cardImg: "/images/cards/aymen-braham.jpg",
    },
    {
      name: "Badie Amarie",
      role: locale === "fr" ? "Directeur des Achats & Associé" : locale === "ar" ? "مدير المشتريات وشريك" : "Purchasing Manager & Partner",
      subtitle: locale === "fr" ? "Propriétaire de l'Huilerie Amari" : locale === "ar" ? "مالك معصرة العماري" : "Owner of Amari Olive Mill",
      phone: "+216 26 540 868",
      email: "amari.badi31989@gmail.com",
      bio:
        locale === "fr"
          ? "Gère le sourcing direct depuis les oliveraies, les opérations de mouture moderne et le contrôle de l'extraction à froid."
          : locale === "ar"
          ? "يدير التوريد المباشر من مزارع الزيتون، عمليات العصر الحديثة وضمان جودة الاستخلاص على البارد."
          : "Manages direct sourcing from olive groves, modern milling operations, cold-extraction quality control, and producer partnerships.",
      cardImg: "/images/cards/badie-amarie.jpg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-verdalia-offwhite text-verdalia-dark" dir={dir}>
      <Header />

      <main className="flex-grow pt-24 pb-20">
        {/* Page Hero Banner */}
        <section className="relative py-20 bg-[#203A1A] text-white overflow-hidden mb-16">
          <div className="absolute inset-0 z-0 opacity-25">
            <Image
              src="/images/facility/storage-tanks.jpg"
              alt="Unités de stockage Verdalia"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-verdalia-gold">
              {ap.heroBadge}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">
              {ap.heroTitle} <br className="hidden sm:inline" />
              <span className="italic font-normal text-verdalia-gold">
                {ap.heroTitleAccent}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-4 leading-relaxed font-light">
              {ap.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Who We Are & Mill Heritage */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
                {ap.whoWeAreBadge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark leading-tight">
                {ap.whoWeAreTitle}
              </h2>
              <p className="text-sm text-verdalia-gray leading-relaxed">
                {ap.whoWeAreP1}
              </p>
              <p className="text-sm text-verdalia-gray leading-relaxed">
                {ap.whoWeAreP2}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="btn-primary"
                >
                  {ap.workWithUs}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-xl overflow-hidden shadow-luxury border border-verdalia-border aspect-[4/3]">
                <Image
                  src="/images/facility/storage-tanks.jpg"
                  alt="Citernes inox — stockage huile d'olive"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-verdalia-dark/85 backdrop-blur-md text-white p-4 rounded-lg border border-white/10">
                  <p className="text-xs font-serif font-bold text-verdalia-gold">
                    {ap.amariBadge}
                  </p>
                  <p className="text-[11px] text-gray-200 mt-0.5">
                    {ap.amariDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Cards */}
        <section className="bg-verdalia-beige/60 py-20 border-y border-verdalia-border mb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 md:p-10 rounded-xl border border-verdalia-border shadow-card">
                <div className="w-12 h-12 rounded-lg bg-verdalia-olive/10 text-verdalia-olive flex items-center justify-center mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-verdalia-dark mb-3">
                  {ap.missionTitle}
                </h3>
                <p className="text-sm text-verdalia-gray leading-relaxed">
                  {ap.missionDesc}
                </p>
              </div>

              <div className="bg-white p-8 md:p-10 rounded-xl border border-verdalia-border shadow-card">
                <div className="w-12 h-12 rounded-lg bg-verdalia-gold/15 text-verdalia-gold flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-verdalia-dark mb-3">
                  {ap.visionTitle}
                </h3>
                <p className="text-sm text-verdalia-gray leading-relaxed">
                  {ap.visionDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
              {ap.valuesBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark mt-2">
              {ap.valuesTitle}
            </h2>
            <p className="text-sm text-verdalia-gray mt-2">
              {ap.valuesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="bg-white p-6 rounded-lg border border-verdalia-border shadow-card card-hover"
              >
                <div className="text-xs font-bold text-verdalia-gold uppercase tracking-widest mb-2">
                  0{i + 1}
                </div>
                <h3 className="font-serif text-lg font-bold text-verdalia-dark mb-2">
                  {v.title}
                </h3>
                <p className="text-xs text-verdalia-gray leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership Team & Business Cards Verification */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
              {ap.leadershipBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark mt-2">
              {ap.leadershipTitle}
            </h2>
            <p className="text-sm text-verdalia-gray mt-2">
              {ap.leadershipSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader) => (
              <div
                key={leader.name}
                className="bg-white rounded-xl border border-verdalia-border shadow-card overflow-hidden card-hover flex flex-col justify-between"
              >
                <div className="p-8">
                  <div className="w-12 h-12 rounded-full bg-verdalia-olive/10 text-verdalia-olive flex items-center justify-center font-serif text-lg font-bold mb-4">
                    {leader.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-verdalia-dark">
                    {leader.name}
                  </h3>
                  <p className="text-xs font-semibold text-verdalia-gold uppercase tracking-wider mt-1">
                    {leader.role}
                  </p>
                  {leader.subtitle && (
                    <p className="text-[11px] text-verdalia-olive font-medium mt-0.5">
                      {leader.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-verdalia-gray leading-relaxed mt-4">
                    {leader.bio}
                  </p>
                </div>

                <div className="px-8 py-5 bg-verdalia-beige/30 border-t border-verdalia-border/70 space-y-2 text-xs">
                  <a
                    href={`tel:${leader.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-2 text-verdalia-dark hover:text-verdalia-olive transition-colors font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-verdalia-gold" />
                    <span>{leader.phone}</span>
                  </a>
                  <a
                    href={`mailto:${leader.email}`}
                    className="flex items-center gap-2 text-verdalia-dark hover:text-verdalia-olive transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-verdalia-gold" />
                    <span className="truncate">{leader.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </div>
  );
}
