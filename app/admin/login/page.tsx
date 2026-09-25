"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { VerdaliaLogo } from "@/components/ui/VerdaliaLogo";
import { Lock, Mail, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="ltr"
      style={{ direction: "ltr" }}
      className="min-h-screen flex items-center justify-center bg-[#152511] px-4 py-12 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-15">
        <Image
          src="/images/facility/storage-tanks.jpg"
          alt="Atmospheric Grove"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-verdalia-border/60 overflow-hidden">
          {/* Brand Banner */}
          <div className="p-8 bg-[#1A3115] text-center border-b border-[#294B21] flex flex-col items-center">
            <div className="bg-white p-3 rounded-xl mb-3 shadow-md">
              <VerdaliaLogo variant="compact" href="" />
            </div>
            <h1 className="font-serif text-xl font-bold text-white tracking-wider">
              Management Portal
            </h1>
            <p className="text-[11px] text-verdalia-light uppercase tracking-widest mt-1">
              Protected Institutional CMS
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="flex items-start gap-2.5 p-3 mb-6 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark mb-1.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-verdalia-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-verdalia-offwhite border border-verdalia-border rounded-lg focus:outline-none focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive"
                    placeholder="admin@verdalia.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-verdalia-dark mb-1.5">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-verdalia-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-verdalia-offwhite border border-verdalia-border rounded-lg focus:outline-none focus:border-verdalia-olive focus:ring-1 focus:ring-verdalia-olive"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 rounded-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-verdalia-border/70 text-center">
              <p className="text-[11px] text-verdalia-gray">
                Verdalia Company VC • Secure Access Only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
