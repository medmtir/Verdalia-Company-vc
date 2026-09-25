"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n/context";
import dynamic from 'next/dynamic';
const QuoteModal = dynamic(() => import('@/components/ui/QuoteModal').then(m => m.QuoteModal), { ssr: false });
import { Product } from "@/lib/types";
import {
  ArrowLeft,
  ShieldCheck,
  Package,
  Droplet,
  FileCheck,
  CheckCircle,
  Truck,
  Sparkles,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { dict, locale, dir } = useI18n();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/products?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
        }
      })
      .catch((err) => console.error("Error loading product:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-verdalia-offwhite text-verdalia-dark" dir={dir}>
        <Header />
        <div className="flex-grow flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-verdalia-olive border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-verdalia-offwhite text-verdalia-dark" dir={dir}>
        <Header />
        <div className="flex-grow max-w-3xl mx-auto px-4 py-32 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-sm text-verdalia-gray mb-8">
            The requested olive oil category does not exist or has been modified.
          </p>
          <Link href="/products" className="btn-primary">
            ← Return to Product Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const t = product.translations[locale] || product.translations.en;

  return (
    <div className="min-h-screen flex flex-col bg-verdalia-offwhite text-verdalia-dark" dir={dir}>
      <Header />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-verdalia-gray hover:text-verdalia-olive uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Olive Oils</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
            {/* Product Image */}
            <div className="lg:col-span-6 sticky top-28">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-luxury border border-verdalia-border bg-verdalia-beige/30">
                <Image
                  src={product.image_url}
                  alt={t.name}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-verdalia-dark/90 text-verdalia-gold text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded">
                  Certified Export Quality
                </div>
              </div>
            </div>

            {/* Product Details & Specifications */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <div className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive mb-2">
                  {product.specs.origin}
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-verdalia-dark leading-tight mb-4">
                  {t.name}
                </h1>
                <p className="text-base text-verdalia-gray leading-relaxed">
                  {t.full_description || t.short_description}
                </p>
              </div>

              {/* Technical Specifications Table */}
              <div className="bg-white rounded-xl border border-verdalia-border overflow-hidden shadow-card">
                <div className="px-6 py-4 bg-verdalia-beige/40 border-b border-verdalia-border flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold text-verdalia-dark uppercase tracking-wider">
                    Technical Specifications
                  </h3>
                  <FileCheck className="w-4 h-4 text-verdalia-olive" />
                </div>

                <div className="divide-y divide-verdalia-border text-xs">
                  <div className="px-6 py-3.5 flex justify-between">
                    <span className="font-medium text-verdalia-gray">Acidity Level</span>
                    <span className="font-bold text-verdalia-olive">
                      {product.specs.acidity}
                    </span>
                  </div>
                  <div className="px-6 py-3.5 flex justify-between">
                    <span className="font-medium text-verdalia-gray">Olive Variety</span>
                    <span className="font-semibold text-verdalia-dark">
                      {product.specs.variety}
                    </span>
                  </div>
                  <div className="px-6 py-3.5 flex justify-between">
                    <span className="font-medium text-verdalia-gray">Extraction Method</span>
                    <span className="font-semibold text-verdalia-dark">
                      {product.specs.extraction}
                    </span>
                  </div>
                  <div className="px-6 py-3.5 flex justify-between">
                    <span className="font-medium text-verdalia-gray">Country of Origin</span>
                    <span className="font-semibold text-verdalia-dark">
                      {product.specs.origin}
                    </span>
                  </div>
                  <div className="px-6 py-3.5 flex justify-between">
                    <span className="font-medium text-verdalia-gray">Minimum Order (MOQ)</span>
                    <span className="font-semibold text-verdalia-dark">
                      {product.specs.moq}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formats */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-verdalia-dark mb-3">
                  Available Formats & Export Packaging
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {t.formats?.map((fmt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded bg-white border border-verdalia-border text-xs text-verdalia-dark"
                    >
                      <Package className="w-4 h-4 text-verdalia-gold flex-shrink-0" />
                      <span>{fmt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="p-6 bg-verdalia-beige/60 rounded-xl border border-verdalia-border space-y-4">
                <h4 className="font-serif text-lg font-bold text-verdalia-dark">
                  Ready to Import {t.name}?
                </h4>
                <p className="text-xs text-verdalia-gray">
                  Contact our export department for current market pricing, forward contracts, and laboratory certificate samples.
                </p>
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="w-full btn-primary py-3.5 text-xs font-bold tracking-widest uppercase"
                >
                  Request Commercial Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultProduct={t.name}
      />
    </div>
  );
}
