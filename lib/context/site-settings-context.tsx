"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface SocialLinks {
  linkedin?: string;
  linkedin_enabled?: boolean;
  instagram?: string;
  instagram_enabled?: boolean;
  facebook?: string;
  facebook_enabled?: boolean;
  youtube?: string;
  youtube_enabled?: boolean;
  email_enabled?: boolean;
}

interface Partner {
  name: string;
  role: string;
  phone?: string;
  email?: string;
  subtitle?: string;
}

export interface SiteSettingsInitialData {
  general_email?: string;
  general_phone?: string;
  social_links?: SocialLinks;
  partners?: Partner[];
}

interface SiteSettingsData {
  generalEmail: string;
  generalPhone: string;
  socialLinks: SocialLinks;
  partners: Partner[];
  refresh: () => Promise<void>;
}

const DEFAULT_PARTNERS: Partner[] = [
  {
    name: "Iheb Boussalem",
    role: "Managing Director & Partner",
    phone: "+216 53 228 867",
    email: "Bousalemiheb8@gmail.com",
  },
  {
    name: "Aymen Braham",
    role: "Sales Manager & Partner",
    phone: "+216 98 462 421",
    email: "aymen_braham@outlook.fr",
  },
  {
    name: "Badie Amarie",
    role: "Purchasing Manager & Partner • Amari Mill",
    phone: "+216 26 540 868",
    email: "amari.badi31989@gmail.com",
  },
];

const SiteSettingsContext = createContext<SiteSettingsData>({
  generalEmail: "contact@verdalia.com",
  generalPhone: "+216 53 228 867",
  socialLinks: { linkedin: "https://linkedin.com", linkedin_enabled: true, email_enabled: true },
  partners: DEFAULT_PARTNERS,
  refresh: async () => {},
});

export const SiteSettingsProvider: React.FC<{
  initialData?: SiteSettingsInitialData;
  children: React.ReactNode;
}> = ({ initialData, children }) => {
  // Use server-provided data immediately — no loading state, no client fetch needed
  const [generalEmail, setGeneralEmail] = useState(
    initialData?.general_email || "contact@verdalia.com"
  );
  const [generalPhone, setGeneralPhone] = useState(
    initialData?.general_phone || "+216 53 228 867"
  );
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(
    initialData?.social_links || {
      linkedin: "https://linkedin.com",
      linkedin_enabled: true,
      email_enabled: true,
    }
  );
  const [partners, setPartners] = useState<Partner[]>(
    initialData?.partners && initialData.partners.length > 0
      ? initialData.partners
      : DEFAULT_PARTNERS
  );

  // Manual refresh (used after admin edits)
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();

      if (
        data?.siteSettings?.partners &&
        Array.isArray(data.siteSettings.partners) &&
        data.siteSettings.partners.length > 0
      ) {
        setPartners(data.siteSettings.partners);
      }
      if (data?.siteSettings?.general_email) {
        setGeneralEmail(data.siteSettings.general_email);
      }
      if (data?.siteSettings?.general_phone) {
        setGeneralPhone(data.siteSettings.general_phone);
      }
      if (data?.siteSettings?.social_links) {
        setSocialLinks(data.siteSettings.social_links);
      }
    } catch {
      // Use current values on error
    }
  }, []);

  // No useEffect fetch! Data comes from server via initialData.

  return (
    <SiteSettingsContext.Provider
      value={{
        generalEmail,
        generalPhone,
        socialLinks,
        partners,
        refresh,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export function useSiteSettings(): SiteSettingsData {
  return useContext(SiteSettingsContext);
}
