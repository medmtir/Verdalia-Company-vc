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
} from "lucide-react";
import { ContactMessage, Product, Certification, Publication } from "@/lib/types";
import { useAdminI18n } from "@/lib/i18n/admin-context";

export default function DashboardOverviewPage() {
  const { adminDict } = useAdminI18n();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/messages").then((r) => r.json()),
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/certifications").then((r) => r.json()),
      fetch("/api/admin/publications").then((r) => r.json()),
    ])
      .then(([msgData, prodData, certData, pubData]) => {
        if (msgData?.messages) setMessages(msgData.messages);
        if (prodData?.products) setProducts(prodData.products);
        if (certData?.certifications) setCertifications(certData.certifications);
        if (pubData?.publications) setPublications(pubData.publications);
      })
      .catch((err) => console.error("Error fetching overview data:", err))
      .finally(() => setLoading(false));
  }, []);

  const unreadMessages = messages.filter((m) => m.status === "unread");
  const recentMessages = messages.slice(0, 5);

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

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/messages"
            className="btn-primary py-2 sm:py-2.5 px-3.5 sm:px-4 text-xs font-bold uppercase tracking-wider w-full sm:w-auto text-center"
          >
            {adminDict.overview.reviewInquiries(unreadMessages.length)}
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
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
