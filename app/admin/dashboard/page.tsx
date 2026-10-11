"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Package,
  Award,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Receipt,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  Ship,
} from "lucide-react";
import { ContactMessage, Product, Certification, Publication, ClientOrder } from "@/lib/types";
import { useAdminI18n } from "@/lib/i18n/admin-context";

export default function DashboardOverviewPage() {
  const { adminDict } = useAdminI18n();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [clientOrders, setClientOrders] = useState<ClientOrder[]>([]);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/messages?_t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/admin/products?_t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/admin/certifications?_t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/admin/publications?_t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`/api/admin/orders?_t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([msgData, prodData, certData, pubData, ordersData]) => {
        if (msgData?.messages) setMessages(msgData.messages);
        if (prodData?.products) setProducts(prodData.products);
        if (certData?.certifications) setCertifications(certData.certifications);
        if (pubData?.publications) setPublications(pubData.publications);
        if (ordersData?.success) {
          setClientOrders(ordersData.orders || []);
          setOrderStats(ordersData.stats || null);
        }
      })
      .catch((err) => console.error("Error fetching overview data:", err))
      .finally(() => setLoading(false));
  }, []);

  const unreadMessages = messages.filter((m) => m.status === "unread");
  const recentMessages = messages.slice(0, 5);
  const recentOrders = clientOrders.slice(0, 5);

  const [selectedCurrency, setSelectedCurrency] = useState<"TND" | "EUR" | "USD" | "ALL">("TND");

  // Currency specific calculations for dashboard overview
  const currencyStats = React.useMemo(() => {
    const list = selectedCurrency === "ALL" ? clientOrders : clientOrders.filter((o) => o.currency === selectedCurrency);
    const rev = list.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
    const paid = list.reduce((s, o) => s + (Number(o.paid_amount) || 0), 0);
    const rem = list.reduce((s, o) => s + (Number(o.remaining_amount) || 0), 0);

    const tndCount = clientOrders.filter((o) => o.currency === "TND").length;
    const eurCount = clientOrders.filter((o) => o.currency === "EUR").length;
    const usdCount = clientOrders.filter((o) => o.currency === "USD").length;

    return {
      revenue: rev,
      paid,
      remaining: rem,
      count: list.length,
      tndCount,
      eurCount,
      usdCount,
    };
  }, [clientOrders, selectedCurrency]);

  // Delivery / Shipping specific calculations for dashboard overview
  const deliveryStats = React.useMemo(() => {
    const list = selectedCurrency === "ALL" ? clientOrders : clientOrders.filter((o) => o.currency === selectedCurrency);
    const activeOrders = list.filter((o) => !o.is_deleted && o.order_status !== "trash" && o.order_status !== "cancelled");
    const totalCount = activeOrders.length;

    let totalTons = 0;
    let deliveredTons = 0;
    let remainingTons = 0;

    let totalLitres = 0;
    let deliveredLitres = 0;
    let remainingLitres = 0;

    let totalOtherQty = 0;
    let deliveredOtherQty = 0;
    let remainingOtherQty = 0;

    let fullyDelivered = 0;
    let partiallyDelivered = 0;

    activeOrders.forEach((o) => {
      const totalQty = Number(o.quantity) || 0;
      const delQty = Number(o.delivered_quantity) || (o.delivery_installments || []).reduce((s, d) => s + Number(d.quantity || 0), 0);
      const remQty = Math.max(0, totalQty - delQty);
      const isFull = o.order_status === "delivered" || o.delivery_status === "fully_delivered" || (totalQty > 0 && delQty >= totalQty);

      if (isFull) {
        fullyDelivered++;
      } else if (o.delivery_status === "partially_delivered" || delQty > 0) {
        partiallyDelivered++;
      }

      const unitLower = (o.unit || "tonnes").toLowerCase().trim();
      if (unitLower.includes("tonne") || unitLower === "t") {
        totalTons += totalQty;
        deliveredTons += delQty;
        remainingTons += remQty;
      } else if (unitLower.includes("litre") || unitLower === "l") {
        totalLitres += totalQty;
        deliveredLitres += delQty;
        remainingLitres += remQty;
      } else {
        totalOtherQty += totalQty;
        deliveredOtherQty += delQty;
        remainingOtherQty += remQty;
      }
    });

    const pendingDelivery = Math.max(0, totalCount - fullyDelivered - partiallyDelivered);

    const totalQuantity = totalTons + totalLitres + totalOtherQty;
    const deliveredQuantity = deliveredTons + deliveredLitres + deliveredOtherQty;
    const remainingQuantity = remainingTons + remainingLitres + remainingOtherQty;

    const rate = totalCount > 0 ? Math.round((fullyDelivered / totalCount) * 100) : 0;
    const volumeRate = (totalTons > 0 ? totalTons : totalQuantity) > 0
      ? Math.min(100, Math.round(((totalTons > 0 ? deliveredTons : deliveredQuantity) / (totalTons > 0 ? totalTons : totalQuantity)) * 100))
      : 0;

    return {
      totalCount,
      fullyDelivered,
      partiallyDelivered,
      pendingDelivery,
      totalQuantity,
      deliveredQuantity,
      remainingQuantity,
      totalTons,
      deliveredTons,
      remainingTons,
      totalLitres,
      deliveredLitres,
      remainingLitres,
      rate,
      volumeRate,
      hasTons: totalTons > 0,
      hasLitres: totalLitres > 0,
    };
  }, [clientOrders, selectedCurrency]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-verdalia-olive">
            {adminDict.overview.tag}
          </span>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-verdalia-dark mt-1">
            {adminDict.overview.title}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {adminDict.overview.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/dashboard/clients"
            className="px-3.5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Receipt className="w-4 h-4 text-verdalia-olive" />
            <span>Clients & Commandes</span>
          </Link>
          <Link
            href="/admin/dashboard/messages"
            className="btn-primary py-2 sm:py-2.5 px-3.5 sm:px-4 text-xs font-bold uppercase tracking-wider w-full sm:w-auto text-center"
          >
            {adminDict.overview.reviewInquiries(unreadMessages.length)}
          </Link>
        </div>
      </div>

      {/* Commercial & Financial KPIs */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Performance Commerciale & Chiffre d&apos;Affaires
            </h3>
            {/* Devise Switcher Pills */}
            <div className="inline-flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCurrency("TND")}
                className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                  selectedCurrency === "TND"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>🇹🇳 TND</span>
                {currencyStats.tndCount > 0 && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {currencyStats.tndCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCurrency("EUR")}
                className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                  selectedCurrency === "EUR"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>🇪🇺 EUR</span>
                {currencyStats.eurCount > 0 && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
                    {currencyStats.eurCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCurrency("USD")}
                className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                  selectedCurrency === "USD"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>🇺🇸 USD</span>
                {currencyStats.usdCount > 0 && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                    {currencyStats.usdCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCurrency("ALL")}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  selectedCurrency === "ALL"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Tous
              </button>
            </div>
          </div>
          <Link
            href="/admin/dashboard/clients"
            className="text-xs font-bold text-verdalia-olive hover:underline flex items-center gap-1"
          >
            <span>Détail des Clients & Reste Flous</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {/* Chiffre d'Affaires */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 truncate">
                Chiffre d&apos;Affaires ({selectedCurrency === "ALL" ? "Tous" : selectedCurrency})
              </p>
              <p className="text-xl sm:text-2xl font-bold text-verdalia-dark mt-1 truncate">
                {currencyStats.revenue.toLocaleString()}{" "}
                <span className="text-xs font-semibold text-gray-500">
                  {selectedCurrency === "ALL" ? "Total" : selectedCurrency}
                </span>
              </p>
              <p className="text-[11px] text-gray-400 mt-1 truncate">
                {currencyStats.count} commande(s) conclue(s)
              </p>
            </div>
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-lg bg-emerald-50 text-verdalia-olive flex items-center justify-center flex-shrink-0 ml-2">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Total Encaissé / Paid */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/20 shadow-sm flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 truncate">
                Total Encaissé ({selectedCurrency === "ALL" ? "Tous" : selectedCurrency})
              </p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 truncate">
                {currencyStats.paid.toLocaleString()}{" "}
                <span className="text-xs font-semibold text-emerald-600">
                  {selectedCurrency === "ALL" ? "Total" : selectedCurrency}
                </span>
              </p>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium truncate">
                Paiements validés
              </p>
            </div>
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 ml-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Reste Flous */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-amber-100 bg-gradient-to-br from-white to-amber-50/20 shadow-sm flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 truncate">
                Reste Flous (À Recouvrer)
              </p>
              <p className="text-xl sm:text-2xl font-bold text-amber-700 mt-1 truncate">
                {currencyStats.remaining.toLocaleString()}{" "}
                <span className="text-xs font-semibold text-amber-600">
                  {selectedCurrency === "ALL" ? "Total" : selectedCurrency}
                </span>
              </p>
              <p className="text-[11px] text-amber-600 mt-1 font-medium truncate">
                Créances en cours
              </p>
            </div>
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 ml-2">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Commandes Livrées / Expéditions Maritimes (Boat / Ship) */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/25 shadow-sm flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-sky-800 truncate flex items-center gap-1">
                <span>Reste à Livrer (Expéditions)</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-sky-100 text-sky-800 font-extrabold">
                  {deliveryStats.volumeRate}% expédié
                </span>
              </p>
              <p className="text-xl sm:text-2xl font-bold text-sky-950 mt-1 truncate">
                {deliveryStats.remainingTons.toLocaleString()}{" "}
                <span className="text-xs font-semibold text-sky-700">
                  Tonne{deliveryStats.remainingTons > 1 ? "s" : ""}
                </span>
              </p>
              <div className="w-full bg-sky-100 rounded-full h-1.5 mt-2 overflow-hidden max-w-[140px]">
                <div
                  className="h-full bg-sky-600 rounded-full transition-all duration-500"
                  style={{ width: `${deliveryStats.volumeRate}%` }}
                />
              </div>
              <p className="text-[10px] text-sky-700 mt-1 font-medium truncate">
                {deliveryStats.deliveredTons > 0 || deliveryStats.totalTons > 0
                  ? `${deliveryStats.deliveredTons.toLocaleString()} / ${deliveryStats.totalTons.toLocaleString()} T livrées (${deliveryStats.fullyDelivered}/${deliveryStats.totalCount} cmds)`
                  : `${deliveryStats.pendingDelivery} commande(s) en attente`}
              </p>
            </div>
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 ml-2 shadow-2xs">
              <Ship className="w-5 h-5" />
            </div>
          </div>

          {/* Clients B2B */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 truncate">
                Clients B2B Actifs
              </p>
              <p className="text-xl sm:text-2xl font-bold text-verdalia-dark mt-1 truncate">
                {orderStats?.totalClients ?? 0}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 truncate">
                Avec Matricule Fiscal (MF)
              </p>
            </div>
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 ml-2">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Maritime Shipping & Delivery Quick Status Banner */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50/40 via-white to-emerald-50/30 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center flex-shrink-0">
              <Ship className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif text-xs sm:text-sm font-bold text-verdalia-dark">
                  Expéditions & Livraisons Maritimes
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  ⏳ Reste à livrer : {deliveryStats.remainingTons.toLocaleString()} Tonne{deliveryStats.remainingTons > 1 ? "s" : ""}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {deliveryStats.fullyDelivered} sur {deliveryStats.totalCount} commande(s) soldée(s)
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                Total commandé : <strong className="text-gray-800">{deliveryStats.totalTons.toLocaleString()} T</strong> • Déjà expédié : <strong className="text-emerald-700">{deliveryStats.deliveredTons.toLocaleString()} T</strong> • Reste en attente : <strong className="text-amber-800">{deliveryStats.remainingTons.toLocaleString()} T</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-extrabold border border-amber-300 flex items-center gap-1.5 text-[11px] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
              <span>Reste: {deliveryStats.remainingTons.toLocaleString()} T</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{deliveryStats.fullyDelivered} Livrée(s) 100%</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold border border-blue-200/80 flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>{deliveryStats.partiallyDelivered} En cours / Partiel</span>
            </span>
            <Link
              href="/admin/dashboard/clients"
              className="px-3 py-1 bg-[#1A3315] hover:bg-verdalia-olive text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto md:ml-0 shadow-2xs"
            >
              <Ship className="w-3 h-3 text-verdalia-gold" />
              <span>Gérer les livraisons</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {adminDict.overview.unreadInquiries}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-verdalia-dark mt-1">
              {unreadMessages.length}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {adminDict.overview.totalReceived(messages.length)}
            </p>
          </div>
          <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {adminDict.overview.activeProducts}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-verdalia-dark mt-1">
              {products.filter((p) => p.is_active).length}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {adminDict.overview.totalCatalog(products.length)}
            </p>
          </div>
          <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-lg bg-emerald-50 text-verdalia-olive flex items-center justify-center flex-shrink-0">
            <Package className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {adminDict.overview.certifications}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-verdalia-dark mt-1">
              {certifications.filter((c) => c.is_active).length}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {adminDict.overview.certifiedBodies(certifications.length)}
            </p>
          </div>
          <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {adminDict.overview.publications}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-verdalia-dark mt-1">
              {publications.filter((p) => p.status === "published").length}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {adminDict.overview.publishedArticles(publications.length)}
            </p>
          </div>
          <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Recent Commercial Inquiries Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-verdalia-dark">
              Recent Inquiries & RFQs
            </h3>
            <p className="text-xs text-gray-500">
              Prospective importers and commercial inquiries submitted through the website.
            </p>
          </div>
          <Link
            href="/admin/dashboard/messages"
            className="text-xs font-bold text-verdalia-olive hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500">
            No received inquiries yet. Messages submitted on the public website
            will automatically appear here.
          </div>
        ) : (
          <>
            {/* Mobile Card View (md:hidden) */}
            <div className="md:hidden divide-y divide-gray-100">
              {recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href="/admin/dashboard/messages"
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 text-sm truncate">{msg.full_name}</p>
                      <p className="text-gray-500 text-xs truncate">
                        {msg.company_name} • {msg.country}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                        msg.status === "unread"
                          ? "bg-amber-100 text-amber-800"
                          : msg.status === "contacted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-verdalia-dark bg-gray-50 p-2 rounded border border-gray-100 mt-2">
                    <span className="font-medium truncate">{msg.product_interest}</span>
                    <span className="text-gray-400 text-[11px] flex-shrink-0 ml-2">
                      {msg.quantity || "Non spécifié"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
                    <span>Dest: {msg.destination_country || "Not specified"}</span>
                    <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop Table View (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Sender & Company</th>
                    <th className="px-6 py-3">Product Interest</th>
                    <th className="px-6 py-3">Destination</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentMessages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{msg.full_name}</p>
                        <p className="text-gray-500">
                          {msg.company_name} • {msg.country}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-verdalia-dark">
                          {msg.product_interest}
                        </span>
                        {msg.quantity && (
                          <p className="text-gray-400 text-[11px]">{msg.quantity}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {msg.destination_country || "Not specified"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            msg.status === "unread"
                              ? "bg-amber-100 text-amber-800"
                              : msg.status === "contacted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-[11px]">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Recent Orders & Payments Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-verdalia-dark">
              Commandes B2B & Reste Flous
            </h3>
            <p className="text-xs text-gray-500">
              Dernières commandes enregistrées avec Matricule Fiscal, produits et montants à recouvrer.
            </p>
          </div>
          <Link
            href="/admin/dashboard/clients"
            className="text-xs font-bold text-verdalia-olive hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <span>Gérer Tous les Clients & Commandes ({clientOrders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500">
            Aucune commande enregistrée pour le moment.
          </div>
        ) : (
          <>
            {/* Mobile Card View (md:hidden) for Smartphone Screens */}
            <div className="md:hidden divide-y divide-gray-100">
              {recentOrders.map((o) => {
                const totalQty = Number(o.quantity) || 0;
                const deliveredQty = Number(o.delivered_quantity) || (o.delivery_installments || []).reduce((s, d) => s + Number(d.quantity || 0), 0);
                const percent = totalQty > 0 ? Math.min(100, Math.round((deliveredQty / totalQty) * 100)) : 0;
                const isFullyDelivered = o.order_status === "delivered" || o.delivery_status === "fully_delivered" || (totalQty > 0 && deliveredQty >= totalQty);

                return (
                  <Link
                    key={o.id}
                    href="/admin/dashboard/clients"
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Header: Ref, Date & Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{o.order_number}</span>
                        <span className="text-[11px] text-gray-400 block">{o.order_date}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.payment_status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : o.payment_status === "partial"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {o.payment_status === "paid" ? "Payé 100%" : o.payment_status === "partial" ? "Partiel (Reste)" : "En attente"}
                      </span>
                    </div>

                    {/* Client & MF */}
                    <div className="mb-2">
                      <p className="font-semibold text-gray-900 text-xs">{o.client_name}</p>
                      {o.client_tax_id ? (
                        <span className="inline-block px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-semibold mt-0.5">
                          MF: {o.client_tax_id}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">MF —</span>
                      )}
                    </div>

                    {/* Product & Qty */}
                    <div className="flex items-center justify-between text-xs text-verdalia-dark bg-gray-50 p-2 rounded border border-gray-100 mb-2">
                      <span className="font-medium truncate">{o.product_name}</span>
                      <span className="text-gray-500 text-[11px] flex-shrink-0 ml-2 font-semibold">
                        {o.quantity} {o.unit}
                      </span>
                    </div>

                    {/* Financial summary: Total / Paid / Remaining */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-gray-50/70 p-2 rounded-lg border border-gray-100 mb-2.5">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-gray-400 block">Total</span>
                        <span className="font-bold text-gray-900 text-[11px]">
                          {o.total_amount.toLocaleString()} {o.currency}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-emerald-600 block">Encaissé</span>
                        <span className="font-bold text-emerald-700 text-[11px]">
                          {o.paid_amount.toLocaleString()} {o.currency}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-amber-600 block">Reste</span>
                        <span className={`font-bold text-[11px] ${o.remaining_amount > 0 ? "text-amber-800" : "text-gray-400"}`}>
                          {o.remaining_amount.toLocaleString()} {o.currency}
                        </span>
                      </div>
                    </div>

                    {/* Maritime Delivery Progress with Ship Boat Icon */}
                    <div className="p-2 bg-sky-50/50 rounded-lg border border-sky-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-6 h-6 rounded bg-sky-100 text-sky-800 flex items-center justify-center flex-shrink-0">
                          <Ship className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-sky-900 block truncate">
                            {isFullyDelivered ? "Livrée à 100%" : deliveredQty > 0 ? "Partiellement Livrée" : "En attente navire"}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                            <span className="text-sky-700 font-medium">
                              {deliveredQty.toLocaleString()} / {totalQty.toLocaleString()} {o.unit}
                            </span>
                            {!isFullyDelivered && totalQty > deliveredQty && (
                              <span className="font-bold text-amber-900 bg-amber-100/80 px-1 py-0.2 rounded text-[9px]">
                                Reste: {(totalQty - deliveredQty).toLocaleString()} {o.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-20 bg-sky-200 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                        <div
                          className={`h-full rounded-full ${isFullyDelivered ? "bg-emerald-500" : "bg-sky-600"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Table View (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-6">Réf & Date</th>
                    <th className="py-3 px-6">Client & Matricule Fiscal</th>
                    <th className="py-3 px-6">Produit & Quantité</th>
                    <th className="py-3 px-6 text-right">Montant Total</th>
                    <th className="py-3 px-6 text-right">Flous Payé</th>
                    <th className="py-3 px-6 text-right">Reste Flous</th>
                    <th className="py-3 px-6 text-center">Paiement</th>
                    <th className="py-3 px-6 text-center">Livraison (Navire)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((o) => {
                    const totalQty = Number(o.quantity) || 0;
                    const deliveredQty = Number(o.delivered_quantity) || (o.delivery_installments || []).reduce((s, d) => s + Number(d.quantity || 0), 0);
                    const percent = totalQty > 0 ? Math.min(100, Math.round((deliveredQty / totalQty) * 100)) : 0;
                    const isFullyDelivered = o.order_status === "delivered" || o.delivery_status === "fully_delivered" || (totalQty > 0 && deliveredQty >= totalQty);

                    return (
                      <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-verdalia-dark">
                          {o.order_number}
                          <span className="block text-[11px] font-normal text-gray-400">{o.order_date}</span>
                        </td>
                        <td className="py-3.5 px-6">
                          <p className="font-semibold text-gray-900">{o.client_name}</p>
                          {o.client_tax_id ? (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-semibold mt-0.5">
                              MF: {o.client_tax_id}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">MF —</span>
                          )}
                        </td>
                        <td className="py-3.5 px-6">
                          <p className="font-semibold text-verdalia-olive">{o.product_name}</p>
                          <p className="text-[11px] text-gray-400">{o.quantity} {o.unit} • {o.packaging}</p>
                        </td>
                        <td className="py-3.5 px-6 text-right font-bold text-gray-900">
                          {o.total_amount.toLocaleString()} {o.currency}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <span className="font-bold text-emerald-700">
                            {o.paid_amount.toLocaleString()} {o.currency}
                          </span>
                          {o.payment_date && (
                            <span className="block text-[10px] text-gray-400">Payé le: {o.payment_date}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-right font-bold">
                          <span className={o.remaining_amount > 0 ? "text-amber-700" : "text-gray-400"}>
                            {o.remaining_amount.toLocaleString()} {o.currency}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              o.payment_status === "paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : o.payment_status === "partial"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {o.payment_status === "paid" ? "Payé 100%" : o.payment_status === "partial" ? "Partiel (Reste)" : "En attente"}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <div className="flex flex-col items-center gap-1 min-w-[110px]">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-sky-900">
                              <Ship className="w-3 h-3 text-sky-700" />
                              <span>{deliveredQty.toLocaleString()} / {totalQty.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-sky-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isFullyDelivered ? "bg-emerald-500" : "bg-sky-600"}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap justify-center text-[9px]">
                              <span className="text-gray-400 font-medium">
                                {isFullyDelivered ? "Livrée 100%" : `${percent}% expédié`}
                              </span>
                              {!isFullyDelivered && totalQty > deliveredQty && (
                                <span className="text-amber-800 font-bold bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                                  Reste: {(totalQty - deliveredQty).toLocaleString()} {o.unit}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/dashboard/products"
          className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-verdalia-olive transition-all group"
        >
          <Package className="w-6 h-6 text-verdalia-olive mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-serif text-base font-bold text-verdalia-dark">
            Manage Products
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Update acidity specs, packaging options, formats and multilingual
            descriptions.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/homepage"
          className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-verdalia-olive transition-all group"
        >
          <TrendingUp className="w-6 h-6 text-verdalia-olive mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-serif text-base font-bold text-verdalia-dark">
            Edit Homepage Content
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Adjust headline, subtitle, hero CTAs, and trust badges without code
            edits.
          </p>
        </Link>

        <Link
          href="/admin/dashboard/seo"
          className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-verdalia-olive transition-all group"
        >
          <ShieldCheck className="w-6 h-6 text-verdalia-olive mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-serif text-base font-bold text-verdalia-dark">
            Multilingual SEO Keywords
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Configure organic search terms and meta descriptions for EN, FR, AR,
            ES, and IT.
          </p>
        </Link>
      </div>
    </div>
  );
}
