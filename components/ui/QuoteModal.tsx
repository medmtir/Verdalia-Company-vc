"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import {
  X,
  CheckCircle,
  AlertCircle,
  Upload,
  Loader2,
  ChevronDown,
  Search,
  FileText,
  FileCheck,
  Check,
} from "lucide-react";

export interface CountryData {
  name: string;
  nameFr: string;
  nameAr: string;
  code: string;
  flag: string;
  iso: string;
  phoneLen: number;
}

export const COUNTRIES: CountryData[] = [
  { name: "Tunisia", nameFr: "Tunisie", nameAr: "تونس", code: "+216", flag: "🇹🇳", iso: "tn", phoneLen: 8 },
  { name: "France", nameFr: "France", nameAr: "فرنسا", code: "+33", flag: "🇫🇷", iso: "fr", phoneLen: 9 },
  { name: "Italy", nameFr: "Italie", nameAr: "إيطاليا", code: "+39", flag: "🇮🇹", iso: "it", phoneLen: 10 },
  { name: "Spain", nameFr: "Espagne", nameAr: "إسبانيا", code: "+34", flag: "🇪🇸", iso: "es", phoneLen: 9 },
  { name: "Germany", nameFr: "Allemagne", nameAr: "ألمانيا", code: "+49", flag: "🇩🇪", iso: "de", phoneLen: 11 },
  { name: "United States", nameFr: "États-Unis", nameAr: "الولايات المتحدة", code: "+1", flag: "🇺🇸", iso: "us", phoneLen: 10 },
  { name: "United Kingdom", nameFr: "Royaume-Uni", nameAr: "المملكة المتحدة", code: "+44", flag: "🇬🇧", iso: "gb", phoneLen: 10 },
  { name: "Canada", nameFr: "Canada", nameAr: "كندا", code: "+1", flag: "🇨🇦", iso: "ca", phoneLen: 10 },
  { name: "Saudi Arabia", nameFr: "Arabie Saoudite", nameAr: "المملكة العربية السعودية", code: "+966", flag: "🇸🇦", iso: "sa", phoneLen: 9 },
  { name: "United Arab Emirates", nameFr: "Émirats Arabes Unis", nameAr: "الإمارات", code: "+971", flag: "🇦🇪", iso: "ae", phoneLen: 9 },
  { name: "Algeria", nameFr: "Algérie", nameAr: "الجزائر", code: "+213", flag: "🇩🇿", iso: "dz", phoneLen: 9 },
  { name: "Morocco", nameFr: "Maroc", nameAr: "المغرب", code: "+212", flag: "🇲🇦", iso: "ma", phoneLen: 9 },
  { name: "Libya", nameFr: "Libye", nameAr: "ليبيا", code: "+218", flag: "🇱🇾", iso: "ly", phoneLen: 9 },
  { name: "Egypt", nameFr: "Égypte", nameAr: "مصر", code: "+20", flag: "🇪🇬", iso: "eg", phoneLen: 10 },
  { name: "Turkey", nameFr: "Turquie", nameAr: "تركيا", code: "+90", flag: "🇹🇷", iso: "tr", phoneLen: 10 },
  { name: "China", nameFr: "Chine", nameAr: "الصين", code: "+86", flag: "🇨🇳", iso: "cn", phoneLen: 11 },
  { name: "Japan", nameFr: "Japon", nameAr: "اليابان", code: "+81", flag: "🇯🇵", iso: "jp", phoneLen: 10 },
  { name: "South Korea", nameFr: "Corée du Sud", nameAr: "كوريا الجنوبية", code: "+82", flag: "🇰🇷", iso: "kr", phoneLen: 10 },
  { name: "India", nameFr: "Inde", nameAr: "الهند", code: "+91", flag: "🇮🇳", iso: "in", phoneLen: 10 },
  { name: "Brazil", nameFr: "Brésil", nameAr: "البرازيل", code: "+55", flag: "🇧🇷", iso: "br", phoneLen: 11 },
  { name: "Mexico", nameFr: "Mexique", nameAr: "المكسيك", code: "+52", flag: "🇲🇽", iso: "mx", phoneLen: 10 },
  { name: "Netherlands", nameFr: "Pays-Bas", nameAr: "هولندا", code: "+31", flag: "🇳🇱", iso: "nl", phoneLen: 9 },
  { name: "Belgium", nameFr: "Belgique", nameAr: "بلجيكا", code: "+32", flag: "🇧🇪", iso: "be", phoneLen: 9 },
  { name: "Switzerland", nameFr: "Suisse", nameAr: "سويسرا", code: "+41", flag: "🇨🇭", iso: "ch", phoneLen: 9 },
  { name: "Sweden", nameFr: "Suède", nameAr: "السويد", code: "+46", flag: "🇸🇪", iso: "se", phoneLen: 9 },
  { name: "Norway", nameFr: "Norvège", nameAr: "النرويج", code: "+47", flag: "🇳🇴", iso: "no", phoneLen: 8 },
  { name: "Poland", nameFr: "Pologne", nameAr: "بولندا", code: "+48", flag: "🇵🇱", iso: "pl", phoneLen: 9 },
  { name: "Portugal", nameFr: "Portugal", nameAr: "البرتغال", code: "+351", flag: "🇵🇹", iso: "pt", phoneLen: 9 },
  { name: "Greece", nameFr: "Grèce", nameAr: "اليونان", code: "+30", flag: "🇬🇷", iso: "gr", phoneLen: 10 },
  { name: "Australia", nameFr: "Australie", nameAr: "أستراليا", code: "+61", flag: "🇦🇺", iso: "au", phoneLen: 9 },
  { name: "Qatar", nameFr: "Qatar", nameAr: "قطر", code: "+974", flag: "🇶🇦", iso: "qa", phoneLen: 8 },
  { name: "Kuwait", nameFr: "Koweït", nameAr: "الكويت", code: "+965", flag: "🇰🇼", iso: "kw", phoneLen: 8 },
  { name: "Oman", nameFr: "Oman", nameAr: "عُمان", code: "+968", flag: "🇴🇲", iso: "om", phoneLen: 8 },
  { name: "Jordan", nameFr: "Jordanie", nameAr: "الأردن", code: "+962", flag: "🇯🇴", iso: "jo", phoneLen: 9 },
  { name: "Lebanon", nameFr: "Liban", nameAr: "لبنان", code: "+961", flag: "🇱🇧", iso: "lb", phoneLen: 8 },
  { name: "Russia", nameFr: "Russie", nameAr: "روسيا", code: "+7", flag: "🇷🇺", iso: "ru", phoneLen: 10 },
  { name: "South Africa", nameFr: "Afrique du Sud", nameAr: "جنوب أفريقيا", code: "+27", flag: "🇿🇦", iso: "za", phoneLen: 9 },
];

export const CountryFlag: React.FC<{ iso: string; flag?: string; className?: string }> = ({
  iso,
  flag,
  className = "w-5 h-3.5",
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  if (imgFailed || !iso) {
    return <span className="text-base leading-none">{flag || "🌐"}</span>;
  }
  return (
    <span className="inline-flex items-center justify-center flex-shrink-0">
      <img
        src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w80/${iso.toLowerCase()}.png 2x`}
        alt={iso}
        className={`${className} object-cover rounded shadow-xs border border-black/10`}
        loading="lazy"
        onError={() => setImgFailed(true)}
      />
    </span>
  );
};

export const PRODUCT_IMAGES: Record<string, string> = {
  "Organic Olive Oil": "/images/products/olive-bio.jpg",
  "Extra Virgin Olive Oil": "/images/products/extra-vierge.jpg",
  "Refined Olive Oil": "/images/products/raffine.jpg",
  "Olive Pomace Oil": "/images/products/grignons.jpg",
  "Multiple Grades / Bulk Supply": "/images/facility/storage-tanks.jpg",
  "Other": "/images/facility/storage-tanks.jpg",
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  defaultProduct = "",
}) => {
  const { dict, dir, locale } = useI18n();
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
    productInterest: defaultProduct || "Organic Olive Oil",
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Update default product if prop changes
  useEffect(() => {
    if (defaultProduct) {
      setFormData((prev) => ({ ...prev, productInterest: defaultProduct }));
    }
  }, [defaultProduct]);

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
    if (!formData.email.trim()) return null; // not touched / empty
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

  if (!isOpen || !mounted) return null;

  const handlePhoneChange = (val: string) => {
    // Numbers only restriction
    const digitsOnly = val.replace(/\D/g, "");
    // Restrict to country phone length
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

    // Instant validation check before submit
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

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-verdalia-dark/70 backdrop-blur-md animate-fade-in"
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      dir={dir}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-verdalia-offwhite rounded-2xl shadow-2xl border border-verdalia-border">
        {/* Header with Product Banner Preview */}
        <div className="sticky top-0 z-20 bg-verdalia-offwhite/95 backdrop-blur border-b border-verdalia-border">
          {productImage && !submitted && (
            <div className="relative w-full h-28 sm:h-36 overflow-hidden bg-verdalia-dark">
              <Image
                src={productImage}
                alt={formData.productInterest}
                fill
                priority
                className="object-cover object-center opacity-90 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-verdalia-offwhite via-verdalia-dark/40 to-transparent" />
              <div className="absolute bottom-2 left-6 bg-verdalia-dark/85 backdrop-blur-sm text-verdalia-gold text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-md border border-verdalia-gold/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-verdalia-gold animate-pulse"></span>
                <span>{formData.productInterest}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-6 py-3.5">
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-verdalia-dark">
                {f.title}
              </h3>
              <p className="text-xs text-verdalia-gray">{f.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-verdalia-gray hover:text-verdalia-dark hover:bg-verdalia-beige rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            /* ====================================================
               SUCCESS SCREEN WITH ATTACHED IMAGE/FILE PREVIEW
               ==================================================== */
            <div className="py-6 text-center animate-fade-in space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-serif text-2xl font-bold text-verdalia-dark mb-1">
                  Inquiry Received Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-verdalia-gray max-w-md mx-auto">
                  {f.successMessage}
                </p>
              </div>

              {/* Submitted Details Recap */}
              <div className="bg-white p-5 rounded-xl border border-verdalia-border shadow-sm text-left max-w-lg mx-auto text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-medium">Demandeur:</span>
                  <span className="font-bold text-verdalia-dark">
                    {submittedData?.fullName} ({submittedData?.companyName})
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-medium">Pays & Contact:</span>
                  <span className="font-semibold text-verdalia-dark flex items-center gap-2">
                    <CountryFlag iso={submittedData?.countryIso || "tn"} flag={submittedData?.countryFlag} />
                    <span>{submittedData?.country}</span>
                    <span className="text-gray-300">•</span>
                    <span>{submittedData?.fullPhone || submittedData?.email}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-400 font-medium">Produit ciblé:</span>
                  <span className="font-bold text-verdalia-olive">
                    {submittedData?.productInterest} {submittedData?.quantity ? `(${submittedData?.quantity})` : ""}
                  </span>
                </div>

                {/* Uploaded File / Image Preview on Success */}
                {submittedData?.fileName && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Fichier / Spécification envoyé :
                    </span>
                    {submittedData?.fileIsImage && submittedData?.filePreviewUrl ? (
                      <div className="relative w-full h-44 rounded-lg overflow-hidden border border-verdalia-border bg-gray-50 flex items-center justify-center shadow-inner">
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
                    onClose();
                  }}
                  className="btn-primary px-8 py-3 text-xs"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* ====================================================
               INTERACTIVE RFQ FORM
               ==================================================== */
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="e.g. Jean Dupont"
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
                  id="modal-consent"
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
                  htmlFor="modal-consent"
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
                    f.submitBtn
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
