"use client";

import React, { useState, useEffect } from "react";
import { SiteSettings } from "@/lib/types";
import { useAdminI18n } from "@/lib/i18n/admin-context";
import { Users, Save, CheckCircle, Plus, Trash2 } from "lucide-react";

export default function ContactsManagementPage() {
  const { adminDict } = useAdminI18n();
  const t = adminDict.contactsPage;
  const c = adminDict.common;
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.siteSettings) {
          setSettings(data.siteSettings);
        }
      })
      .catch((err) => console.error("Error loading settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteSettings: settings }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("site-settings-updated"));
        }
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      alert("Error saving contact details.");
    } finally {
      setSaving(false);
    }
  };

  const updatePartner = (index: number, field: string, val: string) => {
    if (!settings) return;
    const newPartners = [...settings.partners];
    newPartners[index] = { ...newPartners[index], [field]: val };
    setSettings({ ...settings, partners: newPartners });
  };

  if (loading || !settings) {
    return (
      <div className="py-20 text-center text-xs text-gray-500">
        {c.loading}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-verdalia-dark">
            {t.title}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {t.subtitle}
          </p>
        </div>
      </div>

      {success && (
        <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{c.savedSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Company Information */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-serif text-base font-bold text-verdalia-dark">
              General Company Identity & Coordinates
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) =>
                  setSettings({ ...settings, company_name: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Company Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Country of Operation
              </label>
              <input
                type="text"
                value={settings.country}
                onChange={(e) =>
                  setSettings({ ...settings, country: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                General Email
              </label>
              <input
                type="email"
                value={settings.general_email}
                onChange={(e) =>
                  setSettings({ ...settings, general_email: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                General Phone
              </label>
              <input
                type="text"
                value={settings.general_phone}
                onChange={(e) =>
                  setSettings({ ...settings, general_phone: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                WhatsApp Support
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded"
              />
            </div>
          </div>
        </div>

        {/* Partners & Executive Directors */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-serif text-base font-bold text-verdalia-dark">
              Leadership & Executive Partners
            </h3>
            <p className="text-xs text-gray-500">
              Displayed in About Us, Contact page, and Footer.
            </p>
          </div>

          <div className="space-y-6">
            {settings.partners.map((partner, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-verdalia-olive">Partner #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!settings) return;
                      const newPartners = settings.partners.filter((_, i) => i !== index);
                      setSettings({ ...settings, partners: newPartners });
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                    title="Remove Partner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Partner Name
                    </label>
                    <input
                      type="text"
                      value={partner.name}
                      onChange={(e) =>
                        updatePartner(index, "name", e.target.value)
                      }
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Official Role
                    </label>
                    <input
                      type="text"
                      value={partner.role}
                      onChange={(e) =>
                        updatePartner(index, "role", e.target.value)
                      }
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={partner.phone}
                      onChange={(e) =>
                        updatePartner(index, "phone", e.target.value)
                      }
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={partner.email}
                      onChange={(e) =>
                        updatePartner(index, "email", e.target.value)
                      }
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                if (!settings) return;
                setSettings({
                  ...settings,
                  partners: [
                    ...settings.partners,
                    {
                      name: "",
                      role: "",
                      phone: "",
                      whatsapp: "",
                      email: "",
                      notes: "",
                    },
                  ],
                });
              }}
              className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-verdalia-olive rounded-lg text-xs font-semibold text-gray-500 hover:text-verdalia-olive transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Partner</span>
            </button>
          </div>
        </div>

        {/* Social Links & Online Presence */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-serif text-base font-bold text-verdalia-dark">
              Social Links & Online Presence
            </h3>
            <p className="text-xs text-gray-500">
              Customize links and toggle active/inactive status. Active links appear in the website footer under the Contact section.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* LinkedIn */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">LinkedIn</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] font-semibold text-gray-500">
                    {settings.social_links?.linkedin_enabled !== false ? "Active" : "Inactive"}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.social_links?.linkedin_enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social_links: {
                          ...settings.social_links,
                          linkedin_enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-verdalia-olive rounded cursor-pointer accent-verdalia-olive"
                  />
                </label>
              </div>
              <input
                type="url"
                value={settings.social_links?.linkedin || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: {
                      ...settings.social_links,
                      linkedin: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded"
                placeholder="https://linkedin.com/company/verdalia"
              />
            </div>

            {/* Instagram */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">Instagram</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] font-semibold text-gray-500">
                    {settings.social_links?.instagram_enabled !== false ? "Active" : "Inactive"}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.social_links?.instagram_enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social_links: {
                          ...settings.social_links,
                          instagram_enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-verdalia-olive rounded cursor-pointer accent-verdalia-olive"
                  />
                </label>
              </div>
              <input
                type="url"
                value={settings.social_links?.instagram || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: {
                      ...settings.social_links,
                      instagram: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded"
                placeholder="https://instagram.com/verdalia"
              />
            </div>

            {/* Facebook */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">Facebook</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] font-semibold text-gray-500">
                    {settings.social_links?.facebook_enabled !== false ? "Active" : "Inactive"}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.social_links?.facebook_enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social_links: {
                          ...settings.social_links,
                          facebook_enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-verdalia-olive rounded cursor-pointer accent-verdalia-olive"
                  />
                </label>
              </div>
              <input
                type="url"
                value={settings.social_links?.facebook || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: {
                      ...settings.social_links,
                      facebook: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded"
                placeholder="https://facebook.com/verdalia"
              />
            </div>

            {/* YouTube */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">YouTube</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] font-semibold text-gray-500">
                    {settings.social_links?.youtube_enabled !== false ? "Active" : "Inactive"}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.social_links?.youtube_enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social_links: {
                          ...settings.social_links,
                          youtube_enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-verdalia-olive rounded cursor-pointer accent-verdalia-olive"
                  />
                </label>
              </div>
              <input
                type="url"
                value={settings.social_links?.youtube || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: {
                      ...settings.social_links,
                      youtube: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded"
                placeholder="https://youtube.com/@verdalia"
              />
            </div>

            {/* Direct Email Link */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">Email Officiel (Icon & Link)</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] font-semibold text-gray-500">
                    {settings.social_links?.email_enabled !== false ? "Active" : "Inactive"}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.social_links?.email_enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social_links: {
                          ...settings.social_links,
                          email_enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-verdalia-olive rounded cursor-pointer accent-verdalia-olive"
                  />
                </label>
              </div>
              <input
                type="email"
                value={settings.general_email || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general_email: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded"
                placeholder="contact@verdalia.com"
              />
            </div>

            {/* WhatsApp Direct */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">WhatsApp (Icon & Link)</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[11px] font-semibold text-gray-500">
                    {settings.social_links?.whatsapp_enabled !== false ? "Active" : "Inactive"}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.social_links?.whatsapp_enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social_links: {
                          ...settings.social_links,
                          whatsapp_enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-verdalia-olive rounded cursor-pointer accent-verdalia-olive"
                  />
                </label>
              </div>
              <input
                type="text"
                value={settings.social_links?.whatsapp || settings.whatsapp || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whatsapp: e.target.value,
                    social_links: {
                      ...settings.social_links,
                      whatsapp: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded"
                placeholder="+216 53 228 867"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Contact Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
