"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { VerdaliaLogo } from "@/components/ui/VerdaliaLogo";
import {
  AdminI18nProvider,
  useAdminI18n,
} from "@/lib/i18n/admin-context";
import { LOCALES, LOCALE_METAS } from "@/lib/i18n/config";
import {
  LayoutDashboard,
  Mail,
  Package,
  Award,
  FileText,
  Home,
  Info,
  Ship,
  Image as ImageIcon,
  Users,
  Search,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell,
  BellRing,
  Globe,
  ChevronDown,
} from "lucide-react";

function AdminDashboardInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adminLocale, setAdminLocale, adminDict } = useAdminI18n();
  const currentMeta = LOCALE_METAS[adminLocale];
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [toastNotification, setToastNotification] = useState<{
    id: string;
    name: string;
    company: string;
    product: string;
  } | null>(null);

  const lastUnreadCountRef = React.useRef<number | null>(null);
  const notifRef = React.useRef<HTMLDivElement>(null);

  // Play subtle high-end chime when a new request arrives
  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {}
  };

  const checkMessages = () => {
    fetch("/api/admin/messages")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.unreadCount !== undefined) {
          // If unread count increased, trigger sound and toast!
          if (
            lastUnreadCountRef.current !== null &&
            data.unreadCount > lastUnreadCountRef.current
          ) {
            playNotificationSound();
            const latest = data.messages?.find((m: any) => m.status === "unread");
            if (latest) {
              setToastNotification({
                id: latest.id,
                name: latest.full_name,
                company: latest.company_name,
                product: latest.product_interest,
              });
            }
          }
          lastUnreadCountRef.current = data.unreadCount;
          setUnreadCount(data.unreadCount);
        }
        if (data.messages) {
          // Keep only non-trash recent messages for the notifications list
          setRecentInquiries(
            data.messages.filter((m: any) => m.status !== "trash").slice(0, 5)
          );
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    checkMessages();

    // Check auth status
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated) {
          setAdminUser(data.admin);
        }
      })
      .catch(() => {});

    // Polling every 12 seconds for new incoming RFQs
    const interval = setInterval(checkMessages, 12000);
    return () => clearInterval(interval);
  }, [pathname, router]);

  // Lock Admin Dashboard strictly to LTR and English
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  }, [pathname]);

  // Close notifications dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-dismiss toast after 6 seconds
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => setToastNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const menuItems = [
    {
      href: "/admin/dashboard",
      label: adminDict.sidebar.overview,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/dashboard/messages",
      label: adminDict.sidebar.messages,
      icon: Mail,
      badge: unreadCount,
    },
    {
      href: "/admin/dashboard/products",
      label: adminDict.sidebar.products,
      icon: Package,
    },
    {
      href: "/admin/dashboard/certifications",
      label: adminDict.sidebar.certifications,
      icon: Award,
    },
    {
      href: "/admin/dashboard/publications",
      label: adminDict.sidebar.publications,
      icon: FileText,
    },
    {
      href: "/admin/dashboard/homepage",
      label: adminDict.sidebar.homepage,
      icon: Home,
    },
    {
      href: "/admin/dashboard/about",
      label: adminDict.sidebar.about,
      icon: Info,
    },
    {
      href: "/admin/dashboard/export",
      label: adminDict.sidebar.export,
      icon: Ship,
    },
    {
      href: "/admin/dashboard/media",
      label: adminDict.sidebar.media,
      icon: ImageIcon,
    },
    {
      href: "/admin/dashboard/contacts",
      label: adminDict.sidebar.contacts,
      icon: Users,
    },
    {
      href: "/admin/dashboard/seo",
      label: adminDict.sidebar.seo,
      icon: Search,
    },
    {
      href: "/admin/dashboard/settings",
      label: adminDict.sidebar.settings,
      icon: Settings,
    },
  ];

  return (
    <div
      dir="ltr"
      style={{ direction: "ltr" }}
      className="h-screen flex bg-gray-100 text-gray-800 overflow-hidden"
    >
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-[#172B13] text-white border-r border-[#24421D] flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand header with Logo & Company Name */}
        <div className="p-6 border-b border-[#24421D] flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 p-1 flex items-center justify-center border border-[#24421D] flex-shrink-0">
              <Image
                src="/images/verdalia-logo.jpg"
                alt="Verdalia Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wider text-white group-hover:text-verdalia-gold transition-colors leading-none">
                VERDALIA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-verdalia-light font-medium mt-1">
                {adminDict.sidebar.companyTag}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-verdalia-olive text-white shadow-sm font-bold"
                    : "text-gray-300 hover:bg-[#203A1A] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-verdalia-gold" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-black rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout footer */}
        <div className="p-4 border-t border-[#24421D] bg-[#12220F]">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">
                {adminUser?.name || "Verdalia Admin"}
              </p>
              <p className="text-[10px] text-verdalia-light truncate">
                {adminUser?.email || "admin@verdalia.com"}
              </p>
            </div>
            <span className="p-1 rounded bg-verdalia-olive/30 text-verdalia-gold">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-red-300 hover:text-red-100 hover:bg-red-950/40 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{adminDict.sidebar.signOut}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>
          <div className="relative w-72 bg-[#172B13] text-white flex flex-col h-full z-10">
            <div className="p-5 border-b border-[#24421D] flex items-center justify-between">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 group"
              >
                <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white/10 p-1 flex items-center justify-center border border-[#24421D] flex-shrink-0">
                  <Image
                    src="/images/verdalia-logo.jpg"
                    alt="Verdalia Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-base font-bold tracking-wider text-white leading-none">
                    VERDALIA
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-verdalia-light font-medium mt-1">
                    {adminDict.sidebar.companyTag}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide ${
                      isActive
                        ? "bg-verdalia-olive text-white font-bold"
                        : "text-gray-300 hover:bg-[#203A1A]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-verdalia-gold" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-black rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#24421D]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-red-300 hover:bg-red-950/40 rounded"
              >
                <LogOut className="w-4 h-4" />
                <span>{adminDict.sidebar.signOut}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar - Fixed permanently at top on scroll */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between sticky top-0 z-30 flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-sm sm:text-lg font-bold text-verdalia-dark truncate">
              {adminDict.header.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Admin Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-verdalia-dark tracking-wider uppercase hover:text-verdalia-olive transition-colors rounded hover:bg-verdalia-beige/60 border border-gray-200 shadow-2xs"
                title="Changer la langue du panneau d'administration"
              >
                <Globe className="w-3.5 h-3.5 text-verdalia-olive flex-shrink-0" />
                <span className="font-bold">{currentMeta.code.toUpperCase()}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 text-gray-500 ${
                    langDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 py-1.5 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-fade-in max-w-[calc(100vw-1.5rem)]">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-gray-400 border-b border-gray-100">
                    Language / Langue
                  </div>
                  {LOCALES.map((code) => {
                    const meta = LOCALE_METAS[code];
                    const isSelected = adminLocale === code;
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          setAdminLocale(code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                          isSelected
                            ? "bg-verdalia-beige/60 text-verdalia-olive font-bold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{meta.flag === "TN" ? "🇹🇳" : meta.flag === "FR" ? "🇫🇷" : meta.flag === "GB" ? "🇬🇧" : meta.flag === "ES" ? "🇪🇸" : "🇮🇹"}</span>
                          <span>{meta.nativeLabel}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">
                          {meta.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative p-2 rounded-lg transition-colors ${
                  notificationsOpen
                    ? "bg-verdalia-beige text-verdalia-dark"
                    : "text-gray-500 hover:text-verdalia-dark hover:bg-gray-100"
                }`}
                title={adminDict.header.notifications}
                aria-label="Notifications"
              >
                {unreadCount > 0 ? (
                  <BellRing className="w-5 h-5 text-amber-600 animate-wiggle" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}

                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown - Responsive on mobile */}
              {notificationsOpen && (
                <div className="fixed sm:absolute inset-x-2 sm:inset-x-auto sm:right-0 top-14 sm:top-full mt-1 sm:mt-2 w-auto sm:w-96 max-w-[calc(100vw-1rem)] bg-white rounded-2xl sm:rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fade-in">
                  <div className="p-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-xs font-bold text-verdalia-dark">
                        {adminDict.header.recentNotifications}
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                          {adminDict.header.unreadCount(unreadCount)}
                        </span>
                      )}
                    </div>
                    <Link
                      href="/admin/dashboard/messages"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[11px] font-semibold text-verdalia-olive hover:underline"
                    >
                      {adminDict.header.viewAll}
                    </Link>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 text-xs">
                    {recentInquiries.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400">
                        {adminDict.header.noRecent}
                      </div>
                    ) : (
                      recentInquiries.map((inq: any) => (
                        <Link
                          key={inq.id}
                          href="/admin/dashboard/messages"
                          onClick={() => setNotificationsOpen(false)}
                          className={`block p-3.5 hover:bg-verdalia-offwhite transition-colors ${
                            inq.status === "unread" ? "bg-amber-50/50" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-bold text-gray-900 truncate">
                              {inq.full_name}
                            </span>
                            <span className="text-[10px] text-gray-400 flex-shrink-0">
                              {new Date(inq.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 truncate">
                            {inq.company_name} • {inq.country}
                          </p>
                          <p className="text-[11px] text-verdalia-olive font-medium mt-1 truncate">
                            📦 {inq.product_interest}
                          </p>
                        </Link>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                    <Link
                      href="/admin/dashboard/messages"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs font-semibold text-verdalia-dark hover:text-verdalia-olive transition-colors block py-1"
                    >
                      {adminDict.header.openInbox}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Live website link - Desktop pill & Mobile icon */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-verdalia-olive bg-verdalia-beige/60 hover:bg-verdalia-beige rounded border border-verdalia-border transition-colors"
            >
              <span>{adminDict.header.viewLiveWebsite}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/"
              target="_blank"
              className="sm:hidden p-2 text-verdalia-olive hover:bg-verdalia-beige/60 rounded-lg border border-gray-200 transition-colors"
              title={adminDict.header.viewLiveWebsite}
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Floating Toast Notification for New Incoming Requests - Responsive on mobile */}
        {toastNotification && (
          <div className="fixed top-14 sm:top-16 inset-x-3 sm:inset-x-auto sm:right-6 z-50 max-w-sm bg-[#172B13] text-white p-4 rounded-xl shadow-2xl border border-verdalia-gold/50 animate-bounce-short flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-verdalia-gold/20 flex items-center justify-center flex-shrink-0 text-verdalia-gold">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <p className="font-serif font-bold text-verdalia-gold text-sm">
                {adminDict.header.newInquiryToast}
              </p>
              <p className="font-semibold text-white truncate mt-0.5">
                {toastNotification.name} ({toastNotification.company})
              </p>
              <p className="text-gray-300 text-[11px] truncate">
                {toastNotification.product}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <Link
                  href="/admin/dashboard/messages"
                  onClick={() => setToastNotification(null)}
                  className="px-2.5 py-1 bg-verdalia-gold text-verdalia-dark font-bold text-[10px] rounded uppercase tracking-wider hover:bg-white transition-colors"
                >
                  {adminDict.header.viewAll}
                </Link>
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="p-1 text-gray-400 hover:text-white rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 bg-[#F8F7F4]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminI18nProvider>
      <AdminDashboardInner>{children}</AdminDashboardInner>
    </AdminI18nProvider>
  );
}
