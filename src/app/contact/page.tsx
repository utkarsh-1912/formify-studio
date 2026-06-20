"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, MessageSquare, ArrowLeft, Building2 } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white overflow-y-auto relative">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex justify-between items-center z-10 border-b border-slate-900">
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-all focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>
        <div className="flex items-center space-x-3">
          <img src="/logo-long.png" alt="Formify Logo" className="h-8" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl w-full mx-auto px-6 py-16 z-10 flex-1 flex flex-col justify-center space-y-12">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center p-2.5 bg-indigo-600/10 text-indigo-400 rounded-2xl mb-2">
            <Building2 className="h-7 w-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Contact Formify Studio</h2>
          <p className="text-sm text-slate-450 max-w-xl mx-auto leading-relaxed">
            Reach out to our core team for enterprise licensing, technical support, or partnership inquiries.
          </p>
        </div>

        {/* Contact Details Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card 1: General Enquiries */}
          <a
            href="mailto:hello@formify-studio.com"
            className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl hover:border-blue-500/40 hover:bg-slate-900/60 transition-all flex items-start space-x-4 group cursor-pointer focus:outline-none shadow-sm"
          >
            <div className="p-3 bg-blue-600/10 text-blue-450 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">General Enquiries</span>
              <span className="block text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                hello@formify-studio.com
              </span>
              <span className="block text-xs text-slate-450 mt-1">
                Reach out for billing, general support, or licensing.
              </span>
            </div>
          </a>

          {/* Card 2: Support */}
          <a
            href="mailto:support@formify-studio.com"
            className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl hover:border-purple-500/40 hover:bg-slate-900/60 transition-all flex items-start space-x-4 group cursor-pointer focus:outline-none shadow-sm"
          >
            <div className="p-3 bg-purple-600/10 text-purple-450 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Technical Support</span>
              <span className="block text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                support@formify-studio.com
              </span>
              <span className="block text-xs text-slate-450 mt-1">
                Get assistance regarding custom schema validations or WebRTC.
              </span>
            </div>
          </a>

          {/* Card 3: Location */}
          <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex items-start space-x-4 shadow-sm">
            <div className="p-3 bg-emerald-600/10 text-emerald-450 rounded-xl">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Corporate HQ</span>
              <span className="block text-sm font-semibold text-white">
                Formify Studio Inc.
              </span>
              <span className="block text-xs text-slate-400 mt-1 leading-relaxed">
                100 Pine Street, Suite 1200,<br />
                San Francisco, CA 94111
              </span>
            </div>
          </div>

          {/* Card 4: Phone */}
          <a
            href="tel:+14155550199"
            className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl hover:border-pink-500/40 hover:bg-slate-900/60 transition-all flex items-start space-x-4 group cursor-pointer focus:outline-none shadow-sm"
          >
            <div className="p-3 bg-pink-600/10 text-pink-450 rounded-xl group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Call Us</span>
              <span className="block text-sm font-semibold text-white group-hover:text-pink-400 transition-colors">
                +1 (415) 555-0199
              </span>
              <span className="block text-xs text-slate-450 mt-1">
                Available Monday - Friday, 9:00 AM - 5:00 PM PST.
              </span>
            </div>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-655 border-t border-slate-900/60 z-10">
        &copy; {new Date().getFullYear()} Formify Studio.
      </footer>
    </div>
  );
}
