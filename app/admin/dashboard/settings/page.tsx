"use client";

import React, { useState, useEffect } from "react";
import { useAdminI18n } from "@/lib/i18n/admin-context";
import { ShieldCheck, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { adminDict } = useAdminI18n();
  const t = adminDict.settingsPage;
  const c = adminDict.common;
  const [admin, setAdmin] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.admin) setAdmin(data.admin);
      })
      .catch(() => {});
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change password.");
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Error updating credentials.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-verdalia-dark">
          {t.title}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {t.subtitle}
        </p>
      </div>

      {/* Account Info Box */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-full bg-verdalia-olive/10 flex items-center justify-center text-verdalia-olive">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-verdalia-dark">
              Active Administrator Session
            </h3>
            <p className="text-xs text-gray-400">
              Role: {admin?.role || "superadmin"} • Email: {admin?.email || "admin@verdalia.com"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">
              Admin Name
            </span>
            <span className="font-bold text-verdalia-dark">
              {admin?.name || "Verdalia Executive"}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">
              Last Login Time
            </span>
            <span className="font-semibold text-gray-600">
              {admin?.last_login
                ? new Date(admin.last_login).toLocaleString()
                : "Active now"}
            </span>
          </div>
        </div>
      </div>

      {/* Password Change Box */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="font-serif text-base font-bold text-verdalia-dark">
            Update Security Password
          </h3>
          <p className="text-xs text-gray-500">
            Ensure your password contains at least 8 characters with numbers and symbols.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
            <span>Password has been securely updated!</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:border-verdalia-olive"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              New Password *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:border-verdalia-olive"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:border-verdalia-olive"
              placeholder="••••••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{c.saving}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{t.updateBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
