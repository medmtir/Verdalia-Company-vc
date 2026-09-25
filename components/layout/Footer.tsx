"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { useSiteSettings } from "@/lib/context/site-settings-context";
import { VerdaliaLogo } from "@/components/ui/VerdaliaLogo";
import { Mail, Phone, MapPin, ShieldCheck, Globe, Linkedin } from "lucide-react";

export const Footer: React.FC = () => {
  const { dict } = useI18n();
  const f = dict.footer;
  const n = dict.nav;

  const { partners, generalEmail, generalPhone, socialLinks } = useSiteSettings();


  const certs = [
    { name: "BRC Food", file: "brc.svg" },
    { name: "ISO 22000", file: "iso22000.svg" },
    { name: "IFS Food", file: "ifs.svg" },
    { name: "Organic", file: "organic.svg" },
    { name: "Halal", file: "halal.svg" },
    { name: "Kosher", file: "kosher.svg" },
  ];

  return (
    <footer className="bg-[#192E15] text-[#E5E9E1] border-t border-[#26451F] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <VerdaliaLogo variant="footer" href="/" />
            <p className="text-xs text-verdalia-light leading-relaxed">
              Verdalia Company VC exports Tunisian olive oil in bulk —
              extra virgin, organic, refined and pomace — to importers and
              distributors abroad. We ship in citernes and industrial formats,
              not retail boxes or consumer packaging.
            </p>
            <div className="text-xs font-semibold text-verdalia-gold tracking-widest uppercase">
              {f.tagline}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-gold mb-4">
              {f.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {n.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {n.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {n.products}
                </Link>
              </li>
              <li>
                <Link
                  href="/export"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {n.export}
                </Link>
              </li>
              <li>
                <Link
                  href="/certifications"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {n.certifications}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {n.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Executive Leadership & Contacts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-gold mb-4">
              {f.leadership}
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-300">
              {partners.map((p, idx) => (
                <li
                  key={`${p.name}-${idx}`}
                  className={idx < partners.length - 1 ? "border-b border-[#26451F] pb-2" : ""}
                >
                  <p className="font-semibold text-white">{p.name}</p>
                  <p className="text-[11px] text-verdalia-light">{p.role}</p>
                  {p.phone && (
                    <a
                      href={`tel:${p.phone.replace(/\s+/g, "")}`}
                      className="text-verdalia-gold hover:underline text-[11px] block mt-0.5"
                    >
                      {p.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Office & Origin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-gold mb-4">
              {f.contactUs}
            </h4>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-verdalia-gold flex-shrink-0 mt-0.5" />
                <span>VERDALIA COMPANY VC • Tunisia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-verdalia-gold flex-shrink-0" />
                <a
                  href={`mailto:${generalEmail}`}
                  className="hover:text-verdalia-gold hover:underline transition-colors"
                >
                  {generalEmail}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-verdalia-gold flex-shrink-0" />
                <a
                  href={`tel:${generalPhone.replace(/\s+/g, "")}`}
                  className="hover:text-verdalia-gold hover:underline transition-colors"
                >
                  {generalPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-verdalia-gold flex-shrink-0" />
                <span>Export Focus: Worldwide</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-verdalia-gold flex-shrink-0" />
                <span>BRC • ISO 22000 • IFS • BIO • HALAL</span>
              </div>
            </div>

            {/* Social Media Links under Contact */}
            <div className="mt-4 pt-3 border-t border-[#26451F]">
              <span className="text-[10px] uppercase font-bold text-verdalia-gold tracking-widest block mb-2">
                Suivez-nous / Social Media
              </span>
              <div className="flex items-center gap-2">
                {socialLinks.linkedin_enabled !== false && socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-verdalia-olive text-gray-300 hover:text-white transition-all"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram_enabled !== false && socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-verdalia-olive text-gray-300 hover:text-white transition-all"
                    title="Instagram"
                  >
                    <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                )}
                {socialLinks.facebook_enabled !== false && socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-verdalia-olive text-gray-300 hover:text-white transition-all"
                    title="Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {socialLinks.youtube_enabled !== false && socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-red-700 text-gray-300 hover:text-white transition-all"
                    title="YouTube"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
                {socialLinks.email_enabled !== false && generalEmail && (
                  <a
                    href={`mailto:${generalEmail}`}
                    className="p-2 rounded-full bg-white/10 hover:bg-verdalia-olive text-gray-300 hover:text-white transition-all"
                    title="Direct Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Certifications preview in footer */}
            <div className="mt-4 pt-3 border-t border-[#26451F]">
              <div className="flex flex-wrap gap-2 items-center">
                {certs.map((c) => (
                  <div
                    key={c.name}
                    className="w-8 h-8 rounded-full bg-white/90 p-1 flex items-center justify-center"
                    title={c.name}
                  >
                    <Image
                      src={`/images/certs/${c.file}`}
                      alt={c.name}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-[#26451F] flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} VERDALIA COMPANY VC. {f.rightsReserved}</p>
          <div className="flex items-center gap-2">
            {socialLinks.linkedin_enabled !== false && socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-verdalia-olive text-gray-400 hover:text-white transition-all" title="LinkedIn">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {socialLinks.instagram_enabled !== false && socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-verdalia-olive text-gray-400 hover:text-white transition-all" title="Instagram">
                <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            )}
            {socialLinks.facebook_enabled !== false && socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-verdalia-olive text-gray-400 hover:text-white transition-all" title="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            {socialLinks.youtube_enabled !== false && socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-red-700 text-gray-400 hover:text-white transition-all" title="YouTube">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
            {socialLinks.email_enabled !== false && generalEmail && (
              <a href={`mailto:${generalEmail}`} className="p-2 rounded-full bg-white/10 hover:bg-verdalia-olive text-gray-400 hover:text-white transition-all" title="Email">
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
