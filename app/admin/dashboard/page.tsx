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
      fetch("/api/admin/messages").then((r) => r.json()),
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/certifications").then((r) => r.json()),
      fetch("/api/admin/publications").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Chiffre d'Affaires */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Chiffre d&apos;Affaires ({selectedCurrency === "ALL" ? "Tous" : selectedCurrency})
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-verdalia-dark mt-1">
                {currencyStats.revenue.toLocaleString()}{" "}
                <span className="text-sm font-semibold text-gray-500">
                  {selectedCurrency === "ALL" ? "Total" : selectedCurrency}
                </span>
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                {currencyStats.count} commande(s) conclue(s)
              </p>
            </div>
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-lg bg-emerald-50 text-verdalia-olive flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
          </div>

          {/* Total Encaissé / Paid */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/20 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Total Flous Encaissé ({selectedCurrency === "ALL" ? "Tous" : selectedCurrency})
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
                {currencyStats.paid.toLocaleString()}{" "}
                <span className="text-sm font-semibold text-emerald-600">
                  {selectedCurrency === "ALL" ? "Total" : selectedCurrency}
                </span>
              </p>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                Paiements validés
              </p>
            </div>
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
          </div>

          {/* Reste Flous */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-amber-100 bg-gradient-to-br from-white to-amber-50/20 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Reste Flous (À Recouvrer)
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-700 mt-1">
                {currencyStats.remaining.toLocaleString()}{" "}
                <span className="text-sm font-semibold text-amber-600">
                  {selectedCurrency === "ALL" ? "Total" : selectedCurrency}
                </span>
              </p>
              <p className="text-[11px] text-amber-600 mt-1 font-medium">
                Créances clients en cours
              </p>
            </div>
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
          </div>

          {/* Clients B2B */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Clients B2B Actifs
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-verdalia-dark mt-1">
                {orderStats?.totalClients ?? 0}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Avec Matricule Fiscal (MF)
              </p>
            </div>
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-6">Réf & Date</th>
                  <th className="py-3 px-6">Client & Matricule Fiscal</th>
                  <th className="py-3 px-6">Produit & Quantité</th>
                  <th className="py-3 px-6 text-right">Montant Total</th>
                  <th className="py-3 px-6 text-right">Flous Payé</th>
                  <th className="py-3 px-6 text-right">Reste Flous</th>
                  <th className="py-3 px-6 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((o) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
