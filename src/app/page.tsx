"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wrench,
  Code,
  Paintbrush,
  Share2,
  ArrowRight,
  Users,
  Shield,
  Zap,
  Lock,
  Terminal,
  ServerOff,
  CheckCircle,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { APP_VERSION } from "../utils/version";

export default function LandingPage() {
  const router = useRouter();
  const [workspaceInput, setWorkspaceInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const updateTheme = (isDarkTheme: boolean) => {
        if (isDarkTheme) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };

      updateTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => {
        updateTheme(e.matches);
      };

      mediaQuery.addEventListener("change", handler);
      return () => {
        mediaQuery.removeEventListener("change", handler);
        document.documentElement.classList.remove("dark");
      };
    }
  }, []);

  const handleCreateWorkspace = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    router.push(`/ws/${randomId}`);
  };

  const handleJoinWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceInput.trim()) {
      router.push(`/ws/${workspaceInput.trim().toLowerCase()}`);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden relative w-full">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 w-full">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[160px]" />
        <div className="absolute top-[30%] right-[-20%] w-[60%] h-[70%] bg-indigo-500/5 dark:bg-indigo-900/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[70%] h-[60%] bg-purple-500/5 dark:bg-purple-900/10 rounded-full blur-[160px]" />
      </div>

      {/* Full-width Header */}
      <header className="w-full px-4 sm:px-8 md:px-12 py-5 flex justify-between items-center z-10 border-b border-slate-200 dark:border-slate-900 bg-white/70 dark:bg-slate-950/60 backdrop-blur-md sticky top-0">
        <div className="flex items-center space-x-12">
          <Link href="/" className="flex items-center focus:outline-none">
            <img src="/logo-long.png" alt="Formify Logo" className="h-8 md:h-9 object-contain" />
          </Link>
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <a href="#workspace-hub" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Workspace Hub</a>
            <a href="#features-bento" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Platform Features</a>
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={handleCreateWorkspace}
            className="py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-blue-900/10 dark:shadow-blue-900/20 focus:outline-none"
          >
            Launch Studio
          </button>
          <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">v{APP_VERSION}</span>
        </div>
      </header>

      {/* Full-width Split Hero Section */}
      <main className="w-full flex-1 z-10 flex flex-col">
        {/* Row 1: Hero split text & preview */}
        <section className="w-full px-4 sm:px-8 md:px-12 py-16 lg:py-24 border-b border-slate-200 dark:border-slate-900/60 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-extrabold text-blue-605 dark:text-blue-400 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-ping mr-1" />
              <span>WebRTC Serverless Collaboration Ready</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              Form Generation & Styling{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                IDE
              </span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed">
              An enterprise-grade visual form engine. Generate bidirectional schemas, customize themes with CSS variables, sync configurations in real-time with WebRTC, and export clean components instantly.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleCreateWorkspace}
                className="py-4 px-8 bg-blue-600 hover:bg-blue-550 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-bold rounded-2xl cursor-pointer flex items-center space-x-2.5 transition-all shadow-lg shadow-blue-600/15 dark:shadow-blue-600/25 hover:shadow-blue-500/35 focus:outline-none"
              >
                <span>Create New Workspace</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              <a
                href="#workspace-hub"
                className="py-4 px-8 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-800 hover:text-blue-600 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 text-sm font-bold rounded-2xl cursor-pointer transition-colors focus:outline-none text-center"
              >
                Join Collaborative Room
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-900/60">
              <div>
                <span className="block text-2xl font-bold text-slate-900 dark:text-white font-mono">0ms</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Database Lag</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-slate-900 dark:text-white font-mono">100%</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Client-Side</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-slate-900 dark:text-white font-mono">5 Presets</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Visual Themes</span>
              </div>
            </div>
          </div>

          {/* Right side: visual mockup box (full width component) */}
          <div className="lg:col-span-6 w-full h-full flex items-center justify-center">
            <div className="w-full bg-gradient-to-tr from-white to-slate-100/50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl dark:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
              
              {/* Header simulation */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 mb-6">
                <span className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                  <span>Formify Live Editor</span>
                </span>
                <span>schema_valid: true</span>
              </div>

              {/* Form schema simulator */}
              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
                  <div className="h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse" />
                  <div className="h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center px-3 space-x-2">
                      <div className="h-3 w-3 bg-blue-500 rounded-full" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                    </div>
                    <div className="h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center px-3 space-x-2">
                      <div className="h-3 w-3 bg-slate-205 dark:bg-slate-800 rounded-full" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                    </div>
                  </div>
                </div>

                <div className="h-10 bg-blue-600 rounded-xl w-full flex items-center justify-center font-bold text-xs mt-6 text-white cursor-pointer shadow-lg shadow-blue-600/10">
                  Submit Mock Entry
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Row 2: Hub controls (Create/Join Workspace) - Edge-to-edge width */}
        <section id="workspace-hub" className="w-full px-4 sm:px-8 md:px-12 py-16 border-b border-slate-200 dark:border-slate-900/60 bg-slate-100/30 dark:bg-slate-950/20">
          <div className="text-left space-y-2 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Formify Hub</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Launch a fresh project workspace or connect to an active live sync room.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Creator Canvas */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl flex flex-col justify-between hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all group shadow-sm dark:shadow-none">
              <div className="space-y-4">
                <div className="p-3 bg-blue-500/10 text-blue-650 dark:text-blue-400 rounded-xl w-fit">
                  <Wrench className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Workspace</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Start with a clean schema. Drag elements visually, customize dynamic theme variables (radii, grid columns, shadows, text weights), check inputs, and export raw React+Tailwind component code blocks.
                </p>
              </div>
              <button
                onClick={handleCreateWorkspace}
                className="mt-6 py-3 px-6 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all text-slate-700 dark:text-white focus:outline-none"
              >
                <span>Create Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Multiplayer Join */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl flex flex-col justify-between hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all group shadow-sm dark:shadow-none">
              <div className="space-y-4">
                <div className="p-3 bg-purple-500/10 text-purple-650 dark:text-purple-400 rounded-xl w-fit">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Collaborate / Peer Sync</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Join a teammate's active room. All edits, CSS tweaks, and schema updates are synchronized in real-time between browsers via WebRTC signaling.
                </p>
              </div>
              <form onSubmit={handleJoinWorkspace} className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={workspaceInput}
                  onChange={(e) => setWorkspaceInput(e.target.value)}
                  placeholder="Enter Room code (e.g. y8g9t)"
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-purple-500 rounded-xl text-xs font-semibold focus:outline-none placeholder-slate-400 dark:placeholder-slate-650 text-purple-600 dark:text-purple-300 font-mono text-center uppercase tracking-widest flex-1"
                />
                <button
                  type="submit"
                  disabled={!workspaceInput.trim()}
                  className="py-3 px-6 bg-purple-600 hover:bg-purple-550 dark:bg-purple-600 dark:hover:bg-purple-500 disabled:opacity-40 text-xs font-bold rounded-xl cursor-pointer text-white focus:outline-none transition-colors"
                >
                  Join Room
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Row 3: Bento grid features - Edge-to-edge */}
        <section id="features-bento" className="w-full px-4 sm:px-8 md:px-12 py-16 lg:py-24">
          <div className="text-left space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Platform Capabilities</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Everything needed to model, export, and ship responsive form inputs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento item 1 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-6 rounded-2xl space-y-4 hover:border-slate-300 dark:hover:border-slate-800 transition-colors shadow-sm dark:shadow-none">
              <div className="text-blue-600 dark:text-blue-500 bg-blue-500/10 p-2.5 rounded-xl w-fit">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Local-First Sandbox</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero data resides on remote databases. Everything stays on the client, utilizing sandbox storage configurations for maximum compliance.
              </p>
            </div>

            {/* Bento item 2 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-6 rounded-2xl space-y-4 hover:border-slate-300 dark:hover:border-slate-800 transition-colors shadow-sm dark:shadow-none">
              <div className="text-indigo-600 dark:text-indigo-500 bg-indigo-500/10 p-2.5 rounded-xl w-fit">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Instant WebRTC Live</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Stream edits peer-to-peer. Perfect for pair programming form fields, verifying styling rules, and sharing live setups.
              </p>
            </div>

            {/* Bento item 3 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-6 rounded-2xl space-y-4 hover:border-slate-300 dark:hover:border-slate-800 transition-colors shadow-sm dark:shadow-none">
              <div className="text-purple-600 dark:text-purple-500 bg-purple-500/10 p-2.5 rounded-xl w-fit">
                <Code className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tailwind & CSS Variables</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Compiles configuration metrics into clean CSS properties or React component structures with zero dependencies.
              </p>
            </div>

            {/* Bento item 4 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-6 rounded-2xl space-y-4 hover:border-slate-300 dark:hover:border-slate-800 transition-colors shadow-sm dark:shadow-none">
              <div className="text-pink-600 dark:text-pink-500 bg-pink-500/10 p-2.5 rounded-xl w-fit">
                <Paintbrush className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">5 Workspace Presets</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Switch workspaces between Light, Dark, Matrix, Midnight, and Corporate theme layouts depending on preferences.
              </p>
            </div>

            {/* Bento item 5 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-6 rounded-2xl space-y-4 hover:border-slate-300 dark:hover:border-slate-800 transition-colors shadow-sm dark:shadow-none">
              <div className="text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 p-2.5 rounded-xl w-fit">
                <Terminal className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono">Bi-Directional JSON Sync</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Visual modifications map straight to CodeMirror schema definitions, complete with real-time JSON format validations.
              </p>
            </div>

            {/* Bento item 6 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-6 rounded-2xl space-y-4 hover:border-slate-300 dark:hover:border-slate-800 transition-colors shadow-sm dark:shadow-none">
              <div className="text-amber-600 dark:text-amber-500 bg-amber-500/10 p-2.5 rounded-xl w-fit">
                <ServerOff className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono">CSV & JSON Log Exporter</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Log test submissions immediately in local memory. Search log databases, clear history, or download CSV files for Excel/analytics.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Full-width Footer */}
      <footer className="w-full px-4 sm:px-8 md:px-12 py-10 border-t border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-slate-950/40 z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Formify Studio Pro. Open-source, client-side utility.
          </div>
          <div className="flex space-x-8 font-semibold text-slate-600 dark:text-slate-400">
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-white transition-colors">About Us</Link>
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-white transition-colors">Contact Details</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
