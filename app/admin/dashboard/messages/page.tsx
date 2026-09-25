"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ContactMessage } from "@/lib/types";
import { useAdminI18n } from "@/lib/i18n/admin-context";
import {
  Mail,
  Search,
  Filter,
  CheckCircle,
  Archive,
  Trash2,
  Paperclip,
  ExternalLink,
  Phone,
  Building,
  MapPin,
  Clock,
  X,
  FileText,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Flame,
} from "lucide-react";

export default function MessagesManagementPage() {
  const { adminDict } = useAdminI18n();
  const t = adminDict.messagesPage;
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  // Luxury Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: "trash" | "permanent" | "empty_trash";
    messageId?: string;
    companyOrName?: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
    actionType: "trash",
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchMessages = () => {
    setLoading(true);
    fetch("/api/admin/messages")
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.error("Error loading messages:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelectMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setNotes(msg.notes || "");
    if (msg.status === "unread") {
      updateStatus(msg.id, "read");
    }
  };

  const updateStatus = async (
    id: string,
    status: ContactMessage["status"],
    customNotes?: string
  ) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          notes: customNotes !== undefined ? customNotes : notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, status, notes: customNotes ?? notes } : m
          )
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) =>
            prev ? { ...prev, status, notes: customNotes ?? notes } : null
          );
        }
      }
    } catch (err) {
      console.error("Error updating message status:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Restore message from trash
  const handleRestore = async (id: string) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "restore" }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: "read", deleted_at: undefined } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) =>
            prev ? { ...prev, status: "read", deleted_at: undefined } : null
          );
        }
      }
    } catch (err) {
      console.error("Error restoring message:", err);
    }
  };

  // Open Luxury Delete Confirmation Popup
  const openDeleteConfirm = (msg: ContactMessage, permanent = false) => {
    if (permanent) {
      setConfirmModal({
        isOpen: true,
        title: "Supprimer définitivement ?",
        description: `Attention : la demande de ${msg.full_name} (${msg.company_name}) sera effacée de manière irréversible. Les pièces jointes et les notes associées seront définitivement détruites.`,
        actionType: "permanent",
        messageId: msg.id,
        companyOrName: `${msg.full_name} - ${msg.company_name}`,
      });
    } else {
      setConfirmModal({
        isOpen: true,
        title: "Déplacer vers la corbeille ?",
        description: `La demande commerciale de ${msg.full_name} (${msg.company_name}) sera déplacée dans la corbeille. Elle y restera accessible pendant 7 jours avant sa suppression automatique définitive. Vous pouvez la restaurer à tout moment.`,
        actionType: "trash",
        messageId: msg.id,
        companyOrName: `${msg.full_name} - ${msg.company_name}`,
      });
    }
  };

  // Open Empty Trash Confirm
  const openEmptyTrashConfirm = () => {
    const count = messages.filter((m) => m.status === "trash").length;
    setConfirmModal({
      isOpen: true,
      title: "Vider toute la corbeille ?",
      description: `Êtes-vous sûr de vouloir supprimer définitivement les ${count} élément(s) actuellement dans la corbeille ? Cette action est irréversible.`,
      actionType: "empty_trash",
    });
  };

  // Execute Confirmed Delete Action
  const handleExecuteConfirm = async () => {
    setActionLoading(true);
    try {
      if (confirmModal.actionType === "empty_trash") {
        const res = await fetch("/api/admin/messages?action=empty_trash", {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          setMessages((prev) => prev.filter((m) => m.status !== "trash"));
          if (selectedMessage?.status === "trash") {
            setSelectedMessage(null);
          }
        }
      } else if (confirmModal.actionType === "permanent" && confirmModal.messageId) {
        const res = await fetch(
          `/api/admin/messages?id=${confirmModal.messageId}&permanent=true`,
          { method: "DELETE" }
        );
        const data = await res.json();
        if (data.success) {
          setMessages((prev) => prev.filter((m) => m.id !== confirmModal.messageId));
          if (selectedMessage?.id === confirmModal.messageId) {
            setSelectedMessage(null);
          }
        }
      } else if (confirmModal.actionType === "trash" && confirmModal.messageId) {
        const res = await fetch(`/api/admin/messages?id=${confirmModal.messageId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === confirmModal.messageId
                ? { ...m, status: "trash", deleted_at: new Date().toISOString() }
                : m
            )
          );
          if (selectedMessage?.id === confirmModal.messageId) {
            setSelectedMessage(null);
          }
        }
      }
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setActionLoading(false);
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };

  // Remaining 7-day countdown helper
  const getRemainingTime = (deletedAt?: string) => {
    if (!deletedAt) return "7 jours";
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - new Date(deletedAt).getTime();
    const remainingMs = Math.max(0, SEVEN_DAYS_MS - elapsed);
    const totalHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}j ${hours}h restantes`;
    if (hours > 0) return `${hours}h ${mins}m restantes`;
    return `${mins} min restantes`;
  };

  // Filter messages based on status tab & search query
  const filtered = messages
    .filter((m) => {
      if (statusFilter === "all") {
        return m.status !== "trash"; // All active inbox messages
      }
      return m.status === statusFilter;
    })
    .filter((m) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.full_name.toLowerCase().includes(q) ||
        m.company_name.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.product_interest.toLowerCase().includes(q)
      );
    });

  const activeInquiriesCount = messages.filter((m) => m.status !== "trash").length;
  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const contactedCount = messages.filter((m) => m.status === "contacted").length;
  const archivedCount = messages.filter((m) => m.status === "archived").length;
  const trashCount = messages.filter((m) => m.status === "trash").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-verdalia-dark">
            {t.title}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusFilter === "trash" && trashCount > 0 && (
            <button
              onClick={openEmptyTrashConfirm}
              className="py-2 px-3.5 text-xs font-semibold rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{t.emptyTrash(trashCount)}</span>
            </button>
          )}

          <button
            onClick={fetchMessages}
            className="btn-secondary py-2 px-4 text-xs font-semibold self-start sm:self-auto"
          >
            {t.refresh}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: t.tabAll, count: activeInquiriesCount },
            { id: "unread", label: t.tabUnread, count: unreadCount },
            { id: "contacted", label: t.tabContacted, count: contactedCount },
            { id: "archived", label: t.tabArchived, count: archivedCount },
            { id: "trash", label: t.tabTrash, count: trashCount, isTrash: true },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? tab.isTrash
                    ? "bg-red-700 text-white shadow-sm"
                    : "bg-verdalia-olive text-white shadow-sm"
                  : tab.isTrash
                  ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-100"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.isTrash && <Trash2 className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  statusFilter === tab.id
                    ? "bg-white/20 text-white"
                    : tab.isTrash
                    ? "bg-red-200 text-red-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-verdalia-olive"
          />
        </div>
      </div>

      {/* Trash Warning Banner when inside Corbeille tab */}
      {statusFilter === "trash" && (
        <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              <strong>{t.trashNoticeTitle}</strong> {t.trashNoticeDesc}
            </span>
          </div>
        </div>
      )}

      {/* Messages Table & Mobile Cards */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-500">
            {t.loading}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-xs text-gray-500">
            {statusFilter === "trash"
              ? t.emptyTrashText
              : t.noMatches}
          </div>
        ) : (
          <>
            {/* Mobile Card View (md:hidden) */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 transition-colors cursor-pointer active:bg-gray-50 ${
                    msg.status === "unread" ? "bg-amber-50/40" : "bg-white"
                  } ${msg.status === "trash" ? "bg-red-50/20" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {msg.status === "unread" && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                        )}
                        <p className="font-bold text-gray-900 text-sm truncate">
                          {msg.full_name}
                        </p>
                      </div>
                      <p className="text-gray-500 text-xs truncate mt-0.5">
                        {msg.company_name} {msg.country ? `• ${msg.country}` : ""}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                        msg.status === "unread"
                          ? "bg-amber-100 text-amber-800"
                          : msg.status === "contacted"
                          ? "bg-blue-100 text-blue-800"
                          : msg.status === "archived"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-verdalia-dark font-medium bg-gray-50 p-2.5 rounded-lg mb-2.5 border border-gray-100">
                    <span className="truncate">{msg.product_interest}</span>
                    <span className="text-gray-400 text-[11px] font-normal flex-shrink-0 ml-2">
                      {msg.quantity || "Non spécifié"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                      {msg.attachment_url && (
                        <span className="inline-flex items-center gap-1 text-verdalia-olive font-bold">
                          <Paperclip className="w-3 h-3" />
                          <span>Fichier</span>
                        </span>
                      )}
                    </div>
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statusFilter === "trash" ? (
                        <>
                          <button
                            onClick={() => handleRestore(msg.id)}
                            className="p-1.5 text-verdalia-olive hover:bg-emerald-50 rounded"
                            title={t.restore}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(msg, true)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                            title={t.permanentDelete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openDeleteConfirm(msg, false)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title={t.moveToTrash}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5">{t.thCompany}</th>
                  <th className="px-6 py-3.5">{t.thProduct}</th>
                  <th className="px-6 py-3.5">{t.thDestination}</th>
                  <th className="px-6 py-3.5">{t.thAttachment}</th>
                  <th className="px-6 py-3.5">{t.thStatus}</th>
                  {statusFilter === "trash" ? (
                    <th className="px-6 py-3.5 text-amber-700">{t.thAutoPurge}</th>
                  ) : (
                    <th className="px-6 py-3.5">{t.thDate}</th>
                  )}
                  <th className="px-6 py-3.5 text-right">{t.thActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`cursor-pointer hover:bg-verdalia-offwhite transition-colors ${
                      msg.status === "unread" ? "bg-amber-50/40 font-semibold" : ""
                    } ${msg.status === "trash" ? "bg-red-50/20" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{msg.full_name}</p>
                      <p className="text-gray-500 text-[11px]">
                        {msg.company_name} • {msg.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-verdalia-dark font-medium">
                        {msg.product_interest}
                      </p>
                      <p className="text-gray-400 text-[11px]">
                        {msg.quantity || "Non spécifié"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800">{msg.country}</p>
                      <p className="text-gray-400 text-[11px]">
                        {msg.destination_country || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {msg.attachment_url ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-verdalia-olive font-bold">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>Fichier</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          msg.status === "unread"
                            ? "bg-amber-100 text-amber-800"
                            : msg.status === "contacted"
                            ? "bg-blue-100 text-blue-800"
                            : msg.status === "archived"
                            ? "bg-gray-100 text-gray-500"
                            : msg.status === "trash"
                            ? "bg-red-100 text-red-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {msg.status === "trash"
                          ? t.statusTrash
                          : msg.status === "unread"
                          ? t.statusUnread
                          : msg.status === "contacted"
                          ? t.statusContacted
                          : msg.status === "archived"
                          ? t.statusArchived
                          : t.statusRead}
                      </span>
                    </td>

                    {/* Date or 7-day Timer */}
                    {statusFilter === "trash" ? (
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[11px] font-semibold">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>{getRemainingTime(msg.deleted_at)}</span>
                        </span>
                      </td>
                    ) : (
                      <td className="px-6 py-4 text-gray-400 text-[11px]">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </td>
                    )}

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right">
                      {msg.status === "trash" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestore(msg.id);
                            }}
                            className="p-1.5 text-verdalia-olive hover:bg-verdalia-beige rounded transition-colors"
                            title={t.restore}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteConfirm(msg, true);
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title={t.permanentDelete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteConfirm(msg, false);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title={t.moveToTrash}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>

      {/* ====================================================
          LUXURY VERDALIA THEME DELETE CONFIRMATION POPUP
          ==================================================== */}
      {mounted && confirmModal.isOpen && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-verdalia-dark/75 backdrop-blur-md animate-fade-in"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="relative w-full max-w-md bg-verdalia-offwhite rounded-t-2xl sm:rounded-2xl shadow-2xl border border-verdalia-border overflow-hidden">
            {/* Header with Luxury Brand Accent */}
            <div className="bg-[#172B13] p-5 sm:p-6 text-white text-center relative">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-verdalia-gold/20 text-verdalia-gold border border-verdalia-gold/40 mb-3 shadow-inner">
                {confirmModal.actionType === "permanent" || confirmModal.actionType === "empty_trash" ? (
                  <ShieldAlert className="w-7 h-7 text-amber-400" />
                ) : (
                  <Trash2 className="w-7 h-7 text-verdalia-gold" />
                )}
              </div>

              <h3 className="font-serif text-xl font-bold tracking-tight">
                {confirmModal.title}
              </h3>
              <p className="text-[11px] text-verdalia-light uppercase tracking-widest mt-1">
                VERDALIA SECURITY PROTOCOL
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-xs text-verdalia-gray leading-relaxed space-y-3">
              <p>{confirmModal.description}</p>

              {confirmModal.actionType === "trash" && (
                <div className="p-3 bg-verdalia-beige/60 rounded-lg border border-verdalia-border text-[11px] text-verdalia-dark flex items-center gap-2">
                  <Clock className="w-4 h-4 text-verdalia-gold flex-shrink-0" />
                  <span>
                    Un compte à rebours de <strong>7 jours</strong> sera activé. La demande sera définitivement purgée après ce délai.
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-white border-t border-verdalia-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                disabled={actionLoading}
                className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t.modalCancel}
              </button>

              <button
                type="button"
                onClick={handleExecuteConfirm}
                disabled={actionLoading}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 text-white shadow-md ${
                  confirmModal.actionType === "permanent" || confirmModal.actionType === "empty_trash"
                    ? "bg-red-700 hover:bg-red-800"
                    : "bg-[#203A1A] hover:bg-verdalia-olive"
                }`}
              >
                {actionLoading ? t.modalProcessing : t.modalConfirm}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Message Detail Modal */}
      {mounted && selectedMessage && createPortal(
        <div
          className="fixed inset-0 z-[99998] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
            {/* Mobile Sheet Drag Handle Indicator */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-1">
              <span className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-verdalia-dark">
                  Commercial Inquiry Details
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500">
                  ID: {selectedMessage.id.slice(0, 8)}... • Received on{" "}
                  {new Date(selectedMessage.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-xs">
              {/* Buyer Information Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 p-3.5 sm:p-4 bg-verdalia-offwhite rounded-lg border border-verdalia-border">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Full Name
                  </span>
                  <span className="font-bold text-verdalia-dark text-sm">
                    {selectedMessage.full_name}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Company
                  </span>
                  <span className="font-semibold text-verdalia-dark">
                    {selectedMessage.company_name}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Country
                  </span>
                  <span className="font-semibold text-verdalia-dark">
                    {selectedMessage.country}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="font-semibold text-verdalia-olive hover:underline break-all"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Phone / WhatsApp
                  </span>
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="font-semibold text-verdalia-dark hover:underline"
                  >
                    {selectedMessage.phone || "Non renseigné"}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Destination Port
                  </span>
                  <span className="font-semibold text-verdalia-dark">
                    {selectedMessage.destination_country || "Non spécifié"}
                  </span>
                </div>
              </div>

              {/* Requirement Details */}
              <div className="p-3.5 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                  <span className="font-bold text-verdalia-dark text-sm">
                    Product: {selectedMessage.product_interest}
                  </span>
                  <span className="text-verdalia-olive font-semibold">
                    Volume: {selectedMessage.quantity || "Non spécifié"}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Message / Client Specifications:
                  </span>
                  <p className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded border border-gray-200">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* File Attachment */}
              {selectedMessage.attachment_url && (
                <div className="p-3.5 sm:p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Paperclip className="w-5 h-5 text-amber-700 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-amber-900 text-xs">
                          Spécification / Document joint
                        </p>
                        <p className="text-[10px] text-amber-700">
                          Pièce jointe envoyée par le client
                        </p>
                      </div>
                    </div>
                    <a
                      href={selectedMessage.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary py-1.5 px-3 text-xs inline-flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Ouvrir / Télécharger</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Inline Image Preview */}
                  {(selectedMessage.attachment_url.startsWith("data:image/") ||
                    /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(selectedMessage.attachment_url) ||
                    selectedMessage.attachment_url.includes("supabase.co/storage")) && (
                    <div className="relative w-full h-44 sm:h-56 rounded-lg overflow-hidden border border-amber-200 bg-white flex items-center justify-center shadow-inner">
                      <img
                        src={selectedMessage.attachment_url}
                        alt="Pièce jointe envoyée"
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-verdalia-dark mb-1">
                  Private Internal Notes (Commercial follow-up):
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Sent proforma invoice #2026-089. Client requests sample of Organic Chemlali."
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:border-verdalia-olive"
                ></textarea>
                <button
                  onClick={() =>
                    updateStatus(selectedMessage.id, selectedMessage.status, notes)
                  }
                  disabled={updating}
                  className="mt-1.5 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded"
                >
                  Save Internal Note
                </button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {selectedMessage.status === "trash" ? (
                <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleRestore(selectedMessage.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-verdalia-olive text-white hover:bg-verdalia-dark transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurer vers Inbox</span>
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(selectedMessage, true)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer définitivement</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] font-bold uppercase text-gray-400 mr-1">
                      Statut:
                    </span>
                    <button
                      onClick={() => updateStatus(selectedMessage.id, "unread")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                        selectedMessage.status === "unread"
                          ? "bg-amber-500 text-white font-bold"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      Unread
                    </button>
                    <button
                      onClick={() => updateStatus(selectedMessage.id, "contacted")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                        selectedMessage.status === "contacted"
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      Contacted
                    </button>
                    <button
                      onClick={() => updateStatus(selectedMessage.id, "archived")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                        selectedMessage.status === "archived"
                          ? "bg-gray-700 text-white font-bold"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Archived
                    </button>
                  </div>

                  <button
                    onClick={() => openDeleteConfirm(selectedMessage, false)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center justify-center gap-1 py-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Mettre à la corbeille</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
