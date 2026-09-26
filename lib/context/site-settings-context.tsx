"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface SocialLinks {
  linkedin?: string;
  linkedin_enabled?: boolean;
  instagram?: string;
  instagram_enabled?: boolean;
  facebook?: string;
  facebook_enabled?: boolean;
  youtube?: string;
  youtube_enabled?: boolean;
  whatsapp?: string;
  whatsapp_enabled?: boolean;
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
  whatsapp?: string;
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

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  linkedin: "https://Linkedin.com/verdalia",
  linkedin_enabled: true,
  instagram: "https://instagram.com/verdalia",
  instagram_enabled: true,
  facebook: "https://facebook.com/verdalia",
  facebook_enabled: true,
  youtube: "https://youtube.com/@verdalia",
  youtube_enabled: false,
  whatsapp: "+216 53 228 867",
  whatsapp_enabled: true,
  email_enabled: true,
};

const SiteSettingsContext = createContext<SiteSettingsData>({
  generalEmail: "contact@verdalia.com",
  generalPhone: "+216 53 228 867",
  socialLinks: DEFAULT_SOCIAL_LINKS,
  partners: DEFAULT_PARTNERS,
  refresh: async () => {},
});

export const SiteSettingsProvider: React.FC<{
  initialData?: SiteSettingsInitialData;
  children: React.ReactNode;
}> = ({ initialData, children }) => {
  const [generalEmail, setGeneralEmail] = useState(
    initialData?.general_email || "contact@verdalia.com"
  );
  const [generalPhone, setGeneralPhone] = useState(
    initialData?.general_phone || "+216 53 228 867"
  );
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(
    initialData?.social_links
      ? {
          ...DEFAULT_SOCIAL_LINKS,
          ...initialData.social_links,
          whatsapp: initialData.social_links.whatsapp || initialData.whatsapp || "+216 53 228 867",
        }
      : DEFAULT_SOCIAL_LINKS
  );
  const [partners, setPartners] = useState<Partner[]>(
    initialData?.partners && initialData.partners.length > 0
      ? initialData.partners
      : DEFAULT_PARTNERS
  );

  // Sync state if initialData from server layout changes
  useEffect(() => {
    if (initialData) {
      if (initialData.general_email) setGeneralEmail(initialData.general_email);
      if (initialData.general_phone) setGeneralPhone(initialData.general_phone);
      if (initialData.social_links) {
        setSocialLinks({
          ...DEFAULT_SOCIAL_LINKS,
          ...initialData.social_links,
          whatsapp: initialData.social_links.whatsapp || initialData.whatsapp || "+216 53 228 867",
        });
      }
      if (initialData.partners && initialData.partners.length > 0) {
        setPartners(initialData.partners);
      }
    }
  }, [initialData]);

  // Real-time refresh from public site-settings endpoint
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/site-settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.siteSettings) {
          if (data.siteSettings.general_email) {
            setGeneralEmail(data.siteSettings.general_email);
          }
          if (data.siteSettings.general_phone) {
            setGeneralPhone(data.siteSettings.general_phone);
          }
          if (data.siteSettings.social_links) {
            setSocialLinks({
              ...DEFAULT_SOCIAL_LINKS,
              ...data.siteSettings.social_links,
              whatsapp: data.siteSettings.social_links.whatsapp || data.siteSettings.whatsapp || "+216 53 228 867",
            });
          }
          if (data.siteSettings.partners && Array.isArray(data.siteSettings.partners) && data.siteSettings.partners.length > 0) {
            setPartners(data.siteSettings.partners);
          }
        }
      }
    } catch {
      // Use current values on error
    }
  }, []);

  // Fetch latest settings on mount, and listen for updates
  useEffect(() => {
    refresh();

    const handleUpdate = () => {
      refresh();
    };

    window.addEventListener("site-settings-updated", handleUpdate);
    window.addEventListener("focus", handleUpdate);

    return () => {
      window.removeEventListener("site-settings-updated", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [refresh]);

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
