"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { VerdaliaLogo } from "@/components/ui/VerdaliaLogo";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import dynamic from 'next/dynamic';
const QuoteModal = dynamic(() => import('@/components/ui/QuoteModal').then(m => m.QuoteModal), { ssr: false });
import { Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const { dict } = useI18n();
  const n = dict.nav;
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: n.home },
    { href: "/about", label: n.about },
    { href: "/products", label: n.products },
    { href: "/export", label: n.export },
    { href: "/certifications", label: n.certifications },
    { href: "/contact", label: n.contact },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-verdalia-offwhite/95 backdrop-blur-md shadow-sm border-b border-verdalia-border/70 py-3"
            : "bg-verdalia-offwhite/85 backdrop-blur-sm border-b border-verdalia-border/40 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <VerdaliaLogo variant="header" href="/" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold tracking-wider uppercase transition-colors relative py-1 ${
                    isActive
                      ? "text-verdalia-olive font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-verdalia-olive"
                      : "text-verdalia-dark hover:text-verdalia-olive"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSelector />
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="btn-primary py-2.5 px-5 text-xs tracking-wider"
            >
              {n.requestQuote}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-3">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-verdalia-dark hover:text-verdalia-olive hover:bg-verdalia-beige/50 rounded transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-verdalia-border bg-verdalia-offwhite/98 backdrop-blur-xl px-4 py-5 shadow-2xl animate-fade-in space-y-4">
            <nav className="flex flex-col space-y-1.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-xs font-bold tracking-wider uppercase py-3 px-4 rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-verdalia-olive text-white shadow-sm"
                        : "text-verdalia-dark hover:bg-verdalia-beige/60 hover:text-verdalia-olive"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-verdalia-gold"></span>
                    ) : (
                      <span className="text-gray-300 text-xs font-mono">›</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-verdalia-border/60 space-y-3">
              <div className="pb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-verdalia-olive mb-1.5 block">
                  Langue / Language
                </span>
                <LanguageSelector variant="mobile" />
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setQuoteModalOpen(true);
                }}
                className="w-full btn-primary py-3.5 text-xs font-bold uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
              >
                <span>{n.requestQuote}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </>
  );
};
