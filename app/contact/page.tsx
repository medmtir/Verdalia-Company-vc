"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n/context";
import { useSiteSettings } from "@/lib/context/site-settings-context";
import {
  COUNTRIES,
  CountryData,
  CountryFlag,
  PRODUCT_IMAGES,
  EMAIL_REGEX,
} from "@/components/ui/QuoteModal";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  ShieldCheck,
  Send,
  ChevronDown,
  Search,
  X,
  Check,
  FileText,
  FileCheck,
} from "lucide-react";

export default function ContactPage() {
  const { dict, locale, dir } = useI18n();
  const f = dict.contactForm;

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    country: "Tunisia",
    countryFlag: "🇹🇳",
    countryIso: "tn",
    email: "",
    phoneNumber: "",
    phoneCountryCode: "+216",
    productInterest: "Organic Olive Oil",
    quantity: "",
    destinationCountry: "",
    message: "",
    privacyConsent: false,
    website_url: "", // honeypot
  });

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Dropdown states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState("");

  const countryRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
      }
      if (phoneRef.current && !phoneRef.current.contains(e.target as Node)) {
        setPhoneDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clean up object url preview
  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // Selected phone country details
  const selectedPhoneCountry = useMemo(() => {
    return (
      COUNTRIES.find((c) => c.code === formData.phoneCountryCode) ||
      COUNTRIES[0]
    );
  }, [formData.phoneCountryCode]);

  // Instant Validation States
  const isEmailValid = useMemo(() => {
    if (!formData.email.trim()) return null;
    return EMAIL_REGEX.test(formData.email.trim());
  }, [formData.email]);

  const isPhoneValid = useMemo(() => {
    if (!formData.phoneNumber) return null;
    return formData.phoneNumber.length === selectedPhoneCountry.phoneLen;
  }, [formData.phoneNumber, selectedPhoneCountry.phoneLen]);

  // Filtered countries for country selector
  const filteredCountries = useMemo(() => {
    const q = countrySearch.toLowerCase().trim();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameFr.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.code.includes(q)
    );
  }, [countrySearch]);

  // Filtered phone codes
  const filteredPhoneCodes = useMemo(() => {
    const q = phoneSearch.toLowerCase().trim();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameFr.toLowerCase().includes(q) ||
        c.code.includes(q)
    );
  }, [phoneSearch]);

  const productImage = PRODUCT_IMAGES[formData.productInterest] || null;

  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "");
    const trimmed = digitsOnly.slice(0, selectedPhoneCountry.phoneLen);
    setFormData((prev) => ({ ...prev, phoneNumber: trimmed }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    setFile(selected);
    setError(null);

    if (selected.type.startsWith("image/")) {
      const url = URL.createObjectURL(selected);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!EMAIL_REGEX.test(formData.email.trim())) {
      setError("Please enter a valid email address containing '@' and a domain (e.g. name@example.com).");
      return;
    }

    if (!formData.privacyConsent) {
      setError(f.errorMessage);
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      const fullPhone = formData.phoneNumber
        ? `${formData.phoneCountryCode} ${formData.phoneNumber}`
        : "";

      data.append("fullName", formData.fullName);
      data.append("companyName", formData.companyName);
      data.append("country", formData.country);
      data.append("email", formData.email.trim());
      data.append("phone", fullPhone);
      data.append("productInterest", formData.productInterest);
      data.append("quantity", formData.quantity);
      data.append("destinationCountry", formData.destinationCountry);
      data.append("message", formData.message);
      data.append("privacyConsent", "true");
      if (formData.website_url) {
        data.append("website_url", formData.website_url);
      }

      if (file) {
        data.append("file", file);
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || f.errorMessage);
      }

      setSubmittedData({
        ...formData,
        fullPhone,
        fileName: file ? file.name : null,
        fileIsImage: file ? file.type.startsWith("image/") : false,
        filePreviewUrl: filePreview,
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || f.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };


  const { partners: contacts, generalEmail, generalPhone, socialLinks } = useSiteSettings();



  return (
    <div className="min-h-screen flex flex-col bg-verdalia-offwhite text-verdalia-dark" dir={dir}>
      <Header />

      <main className="flex-grow pt-24 pb-20">
        {/* Banner */}
        <section className="relative py-20 bg-[#203A1A] text-white overflow-hidden mb-16">
          <div className="absolute inset-0 z-0 opacity-25">
            <Image
              src="/images/facility/storage-tanks.jpg"
              alt="Contact Verdalia"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-verdalia-gold">
              {dict.contactPage.bannerBadge}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">
              {dict.contactPage.bannerTitle} <br className="hidden sm:inline" />
              <span className="italic font-normal text-verdalia-gold">
                {dict.contactPage.bannerTitleAccent}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-4 leading-relaxed font-light">
              {dict.contactPage.bannerSubtitle}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Details & Partners */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
                  {dict.contactPage.hqBadge}
                </span>
                <h2 className="font-serif text-3xl font-bold text-verdalia-dark mt-2 mb-4">
                  Verdalia Company VC
                </h2>
                <div className="space-y-4 text-xs sm:text-sm text-verdalia-gray">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-verdalia-olive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-verdalia-dark">
                        {dict.contactPage.locationTitle}
                      </p>
                      <p>{dict.contactPage.locationVal}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-verdalia-olive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-verdalia-dark">Email Officiel</p>
                      <a href={`mailto:${generalEmail}`} className="text-verdalia-olive hover:underline font-medium">
                        {generalEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-verdalia-olive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-verdalia-dark">Téléphone / WhatsApp</p>
                      <a href={`tel:${generalPhone.replace(/\s+/g, "")}`} className="text-verdalia-olive hover:underline font-medium">
                        {generalPhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-verdalia-olive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-verdalia-dark">
                        {dict.contactPage.hoursTitle}
                      </p>
                      <p>{dict.contactPage.hoursVal}</p>
                      <p className="text-[11px] text-verdalia-gold font-semibold">
                        {dict.contactPage.hoursSupport}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Presence Card */}
                {(socialLinks?.linkedin_enabled !== false && socialLinks?.linkedin ||
                  socialLinks?.instagram_enabled !== false && socialLinks?.instagram ||
                  socialLinks?.facebook_enabled !== false && socialLinks?.facebook ||
                  socialLinks?.youtube_enabled !== false && socialLinks?.youtube) && (
                  <div className="mt-6 pt-5 border-t border-verdalia-border">
                    <span className="text-[10px] uppercase font-bold text-verdalia-olive tracking-widest block mb-3">
                      Canaux Officiels & Réseaux Sociaux
                    </span>
                    <div className="flex items-center gap-3">
                      {socialLinks?.linkedin_enabled !== false && socialLinks?.linkedin && (
                        <a
                          href={socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white border border-verdalia-border hover:bg-verdalia-olive hover:text-white text-verdalia-dark transition-all text-xs font-semibold flex items-center gap-2 shadow-sm"
                        >
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {socialLinks?.instagram_enabled !== false && socialLinks?.instagram && (
                        <a
                          href={socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white border border-verdalia-border hover:bg-verdalia-olive hover:text-white text-verdalia-dark transition-all text-xs font-semibold flex items-center gap-2 shadow-sm"
                        >
                          <span>Instagram</span>
                        </a>
                      )}
                      {socialLinks?.facebook_enabled !== false && socialLinks?.facebook && (
                        <a
                          href={socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white border border-verdalia-border hover:bg-verdalia-olive hover:text-white text-verdalia-dark transition-all text-xs font-semibold flex items-center gap-2 shadow-sm"
                        >
                          <span>Facebook</span>
                        </a>
                      )}
                      {socialLinks?.youtube_enabled !== false && socialLinks?.youtube && (
                        <a
                          href={socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white border border-verdalia-border hover:bg-red-600 hover:text-white text-verdalia-dark transition-all text-xs font-semibold flex items-center gap-2 shadow-sm"
                        >
                          <span>YouTube</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Partners List */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive mb-4">
                  {dict.contactPage.partnersTitle}
                </h3>
                <div className="space-y-4">
                  {contacts.map((c) => (
                    <div
                      key={c.name}
                      className="p-5 bg-white rounded-lg border border-verdalia-border shadow-card space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-serif text-base font-bold text-verdalia-dark">
                            {c.name}
                          </p>
                          <p className="text-verdalia-gold font-semibold uppercase tracking-wider text-[11px]">
                            {c.role}
                          </p>
                          {c.subtitle && (
                            <p className="text-[10px] text-verdalia-olive font-medium">
                              {c.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-verdalia-border/60 flex flex-col gap-1.5 text-verdalia-gray">
                        <a
                          href={`tel:${(c.phone ?? "").replace(/\s+/g, "")}`}
                          className="flex items-center gap-2 hover:text-verdalia-olive transition-colors font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-verdalia-olive" />
                          <span>{c.phone} (Call / WhatsApp)</span>
                        </a>
                        <a
                          href={`mailto:${c.email}`}
                          className="flex items-center gap-2 hover:text-verdalia-olive transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-verdalia-olive" />
                          <span>{c.email}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Commercial Quotation Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-verdalia-border shadow-luxury overflow-hidden">
              {/* Product Visual Banner Preview */}
              {productImage && !submitted && (
                <div className="relative w-full h-32 sm:h-44 overflow-hidden bg-verdalia-dark">
                  <Image
                    src={productImage}
                    alt={formData.productInterest}
                    fill
                    priority
                    className="object-cover object-center opacity-90 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-verdalia-dark/30 to-transparent" />
                  <div className="absolute bottom-3 left-6 sm:left-8 bg-verdalia-dark/85 backdrop-blur-sm text-verdalia-gold text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-md border border-verdalia-gold/30 flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-verdalia-gold animate-pulse"></span>
                    <span>{formData.productInterest}</span>
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-10">
                {submitted ? (
                  /* ====================================================
                     SUCCESS SCREEN WITH ATTACHED IMAGE/FILE PREVIEW
                     ==================================================== */
                  <div className="py-6 text-center animate-fade-in space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 shadow-sm">
                      <CheckCircle className="w-10 h-10" />
                    </div>

                    <div>
                      <h4 className="font-serif text-2xl sm:text-3xl font-bold text-verdalia-dark mb-2">
                        Demande reçue avec succès !
                      </h4>
                      <p className="text-xs sm:text-sm text-verdalia-gray max-w-md mx-auto">
                        {f.successMessage}
                      </p>
                    </div>

                    {/* Submitted Details Recap */}
                    <div className="bg-verdalia-offwhite/80 p-5 sm:p-6 rounded-xl border border-verdalia-border shadow-sm text-left max-w-lg mx-auto text-xs space-y-3.5">
                      <div className="flex items-center justify-between border-b border-gray-200/80 pb-2.5">
                        <span className="text-gray-500 font-medium">Demandeur :</span>
                        <span className="font-bold text-verdalia-dark">
                          {submittedData?.fullName} ({submittedData?.companyName})
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-200/80 pb-2.5">
                        <span className="text-gray-500 font-medium">Pays & Contact :</span>
                        <span className="font-semibold text-verdalia-dark flex items-center gap-2">
                          <CountryFlag iso={submittedData?.countryIso || "tn"} flag={submittedData?.countryFlag} />
                          <span>{submittedData?.country}</span>
                          <span className="text-gray-300">•</span>
                          <span>{submittedData?.fullPhone || submittedData?.email}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-200/80 pb-2.5">
                        <span className="text-gray-500 font-medium">Produit ciblé :</span>
                        <span className="font-bold text-verdalia-olive">
                          {submittedData?.productInterest} {submittedData?.quantity ? `(${submittedData?.quantity})` : ""}
                        </span>
                      </div>

                      {/* Uploaded File / Image Preview on Success */}
                      {submittedData?.fileName && (
                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                            Fichier / Spécification envoyé :
                          </span>
                          {submittedData?.fileIsImage && submittedData?.filePreviewUrl ? (
                            <div className="relative w-full h-44 rounded-lg overflow-hidden border border-verdalia-border bg-white flex items-center justify-center shadow-inner">
                              <Image
                                src={submittedData.filePreviewUrl}
                                alt="Pièce jointe envoyée"
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                              <FileCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                              <span className="font-medium truncate text-xs">
                                {submittedData?.fileName}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setSubmittedData(null);
                          setFormData({
                            fullName: "",
                            companyName: "",
                            country: "Tunisia",
                            countryFlag: "🇹🇳",
                            countryIso: "tn",
                            email: "",
                            phoneNumber: "",
                            phoneCountryCode: "+216",
                            productInterest: "Organic Olive Oil",
                            quantity: "",
                            destinationCountry: "",
                            message: "",
                            privacyConsent: false,
                            website_url: "",
                          });
                          setFile(null);
                          setFilePreview(null);
                        }}
                        className="btn-primary px-8 py-3 text-xs"
                      >
                        Envoyer une autre demande
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ====================================================
                     INTERACTIVE RFQ FORM (EXACT QUOTE MODAL DESIGN)
                     ==================================================== */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                      <h3 className="font-serif text-2xl font-bold text-verdalia-dark mb-1">
                        {f.title}
                      </h3>
                      <p className="text-xs text-verdalia-gray">{f.subtitle}</p>
                    </div>

                    {/* Honeypot field */}
                    <input
                      type="text"
                      name="website_url"
                      value={formData.website_url}
                      onChange={(e) =>
                        setFormData({ ...formData, website_url: e.target.value })
                      }
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {error && (
                      <div className="flex items-start gap-3 p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Full Name & Company */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark mb-1">
                          {f.fullName} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-verdalia-border rounded-lg focus:outline-none focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive"
                          placeholder="ex: Jean Dupont"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark mb-1">
                          {f.companyName} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={(e) =>
                            setFormData({ ...formData, companyName: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-verdalia-border rounded-lg focus:outline-none focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive"
                          placeholder="Global Olive Imports S.A."
                        />
                      </div>
                    </div>

                    {/* Country (Searchable Select) & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Searchable Country Selector */}
                      <div className="relative" ref={countryRef}>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark mb-1">
                          {f.country} *
                        </label>
                        <button
                          type="button"
                          onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs bg-white border border-verdalia-border rounded-lg text-left hover:border-verdalia-olive transition-colors focus:outline-none focus:ring-1 focus:ring-verdalia-olive"
                        >
                          <span className="flex items-center gap-2.5 truncate">
                            <CountryFlag iso={formData.countryIso} flag={formData.countryFlag} />
                            <span className="font-medium text-gray-800">
                              {formData.country}
                            </span>
                          </span>
                          <ChevronDown className="w-4 h-4 text-verdalia-gray flex-shrink-0" />
                        </button>

                        {/* Searchable Dropdown Popover */}
                        {countryDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-verdalia-border rounded-xl shadow-xl overflow-hidden animate-fade-in">
                            <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                              <Search className="w-3.5 h-3.5 text-gray-400 ml-1" />
                              <input
                                type="text"
                                autoFocus
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                placeholder="Rechercher un pays..."
                                className="w-full bg-transparent text-xs py-1 outline-none text-gray-800 placeholder-gray-400"
                              />
                              {countrySearch && (
                                <button
                                  type="button"
                                  onClick={() => setCountrySearch("")}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                              {filteredCountries.map((c) => (
                                <button
                                  key={c.name}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      country: c.name,
                                      countryFlag: c.flag,
                                      countryIso: c.iso,
                                      phoneCountryCode: c.code,
                                    }));
                                    setCountryDropdownOpen(false);
                                    setCountrySearch("");
                                  }}
                                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs hover:bg-verdalia-beige/60 transition-colors text-left ${
                                    formData.country === c.name
                                      ? "bg-verdalia-beige/80 font-bold text-verdalia-olive"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <span className="flex items-center gap-2.5">
                                    <CountryFlag iso={c.iso} flag={c.flag} />
                                    <span>
                                      {locale === "fr" ? c.nameFr : locale === "ar" ? c.nameAr : c.name}
                                    </span>
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono">
                                    {c.code}
                                  </span>
                                </button>
                              ))}
                              {filteredCountries.length === 0 && (
                                <div className="py-4 text-center text-xs text-gray-400">
                                  Aucun pays trouvé
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Email with Instant Validation */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark">
                            {f.email} *
                          </label>
                          {isEmailValid === true && (
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Email valide
                            </span>
                          )}
                          {isEmailValid === false && (
                            <span className="text-[10px] text-red-500 font-medium">
                              Format email invalide (@ requis)
                            </span>
                          )}
                        </div>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-lg focus:outline-none transition-colors ${
                            isEmailValid === false
                              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-300"
                              : isEmailValid === true
                              ? "border-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300"
                              : "border-verdalia-border focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive"
                          }`}
                          placeholder="contact@exemple.com"
                        />
                      </div>
                    </div>

                    {/* Phone (Flag + Country Code + Digits only) & Product Interest */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Phone Field */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark">
                            {f.phone}
                          </label>
                          {formData.phoneNumber && (
                            <span
                              className={`text-[10px] font-mono ${
                                isPhoneValid ? "text-emerald-600 font-bold" : "text-gray-400"
                              }`}
                            >
                              {formData.phoneNumber.length}/{selectedPhoneCountry.phoneLen} chiffres
                              {isPhoneValid && " ✓"}
                            </span>
                          )}
                        </div>

                        <div className="flex">
                          {/* Dial Code Dropdown */}
                          <div className="relative" ref={phoneRef}>
                            <button
                              type="button"
                              onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
                              className="flex items-center gap-2 px-3 py-2.5 bg-verdalia-beige border border-r-0 border-verdalia-border rounded-l-lg text-xs font-semibold h-full hover:bg-verdalia-beige/80 transition-colors"
                              title="Changer l'indicatif pays"
                            >
                              <CountryFlag iso={selectedPhoneCountry.iso} flag={selectedPhoneCountry.flag} />
                              <span className="font-bold text-gray-800">
                                {selectedPhoneCountry.code}
                              </span>
                              <ChevronDown className="w-3 h-3 text-verdalia-gray" />
                            </button>

                            {phoneDropdownOpen && (
                              <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white border border-verdalia-border rounded-xl shadow-xl overflow-hidden animate-fade-in">
                                <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                  <Search className="w-3.5 h-3.5 text-gray-400 ml-1" />
                                  <input
                                    type="text"
                                    autoFocus
                                    value={phoneSearch}
                                    onChange={(e) => setPhoneSearch(e.target.value)}
                                    placeholder="Rechercher code..."
                                    className="w-full bg-transparent text-xs py-1 outline-none text-gray-800 placeholder-gray-400"
                                  />
                                </div>

                                <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
                                  {filteredPhoneCodes.map((c, i) => (
                                    <button
                                      key={`${c.code}-${i}`}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          phoneCountryCode: c.code,
                                          phoneNumber: "",
                                        }));
                                        setPhoneDropdownOpen(false);
                                        setPhoneSearch("");
                                      }}
                                      className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-verdalia-beige/60 text-left ${
                                        formData.phoneCountryCode === c.code
                                          ? "bg-verdalia-beige font-bold text-verdalia-olive"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      <span className="flex items-center gap-2.5">
                                        <CountryFlag iso={c.iso} flag={c.flag} />
                                        <span className="font-bold">{c.code}</span>
                                        <span className="text-gray-500 truncate max-w-[100px]">
                                          {c.name}
                                        </span>
                                      </span>
                                      <span className="text-[10px] text-gray-400">
                                        {c.phoneLen} chiffres
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Numeric Only Input */}
                          <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={formData.phoneNumber}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            className={`flex-1 px-3.5 py-2.5 text-xs bg-white border border-verdalia-border rounded-r-lg focus:outline-none transition-colors ${
                              isPhoneValid === true
                                ? "border-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300"
                                : "focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive"
                            }`}
                            placeholder={`Numéro (${selectedPhoneCountry.phoneLen} chiffres max)`}
                            maxLength={selectedPhoneCountry.phoneLen}
                          />
                        </div>
                      </div>

                      {/* Product Interest */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark mb-1">
                          {f.productInterest} *
                        </label>
                        <select
                          required
                          value={formData.productInterest}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              productInterest: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-verdalia-border rounded-lg focus:outline-none focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive cursor-pointer"
                        >
                          <option value="Organic Olive Oil">Huile d’olive biologique (Bio)</option>
                          <option value="Extra Virgin Olive Oil">Huile d’olive extra vierge (EVOO)</option>
                          <option value="Refined Olive Oil">Huile d’olive raffinée</option>
                          <option value="Olive Pomace Oil">Huile de grignons d'olive</option>
                          <option value="Multiple Grades / Bulk Supply">Multiples grades / Approvisionnement continu</option>
                          <option value="Other">Autre cahier des charges spécifique</option>
                        </select>
                      </div>
                    </div>

                    {/* Quantity & Destination Country / Port */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark mb-1">
                          {f.estimatedQuantity}
                        </label>
                        <input
                          type="text"
                          value={formData.quantity}
                          onChange={(e) =>
                            setFormData({ ...formData, quantity: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-verdalia-border rounded-lg focus:outline-none focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive"
                          placeholder="ex: 1 x 20ft Flexitank (22,000L) / 10 cuves IBC"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark mb-1">
                          {f.destinationCountry}
                        </label>
                        <input
                          type="text"
                          value={formData.destinationCountry}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              destinationCountry: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-verdalia-border rounded-lg focus:outline-none focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive"
                          placeholder="ex: Port de Marseille, Hambourg, Houston..."
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark mb-1">
                        {f.message} *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-verdalia-border rounded-lg focus:outline-none focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive resize-none"
                        placeholder="Spécifications techniques, Incoterms souhaités (FOB / CIF), planning prévisionnel d'enlèvement..."
                      ></textarea>
                    </div>

                    {/* Upload File with Instant Image Preview */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark mb-1">
                        {f.uploadFile} (Cahier des charges / Document / Image)
                      </label>

                      {!file ? (
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-verdalia-dark bg-verdalia-beige/60 hover:bg-verdalia-beige border border-verdalia-border rounded-lg cursor-pointer transition-colors shadow-sm">
                            <Upload className="w-4 h-4 text-verdalia-olive" />
                            <span>Choisir un fichier</span>
                            <input
                              type="file"
                              onChange={handleFileSelect}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                            />
                          </label>
                          <span className="text-[11px] text-verdalia-gray">
                            {f.uploadHint} (Max 10 Mo)
                          </span>
                        </div>
                      ) : (
                        /* Attached File Preview Card */
                        <div className="bg-white p-3 rounded-xl border border-verdalia-border flex items-center justify-between gap-3 shadow-sm">
                          <div className="flex items-center gap-3 min-w-0">
                            {filePreview ? (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                <Image
                                  src={filePreview}
                                  alt="Aperçu image"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-verdalia-beige/60 flex items-center justify-center flex-shrink-0 text-verdalia-olive">
                                <FileText className="w-6 h-6" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">
                                {file.name}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {(file.size / 1024).toFixed(1)} Ko • {file.type.startsWith("image/") ? "Image affichée" : "Document"}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors flex-shrink-0"
                            title="Supprimer la pièce jointe"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Privacy Consent */}
                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="page-consent"
                        required
                        checked={formData.privacyConsent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            privacyConsent: e.target.checked,
                          })
                        }
                        className="mt-1 h-4 w-4 rounded border-verdalia-border text-verdalia-olive focus:ring-verdalia-olive cursor-pointer"
                      />
                      <label
                        htmlFor="page-consent"
                        className="text-xs text-verdalia-gray leading-relaxed cursor-pointer"
                      >
                        {f.privacyConsent}
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting || isEmailValid === false}
                        className={`w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm ${
                          isEmailValid === false
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "btn-primary hover:shadow-md"
                        }`}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{f.submitting}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>{f.submitBtn}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
