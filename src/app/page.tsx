"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wrench,
  Code,
  Paintbrush,
  ArrowRight,
  Users,
  Shield,
  Zap,
  Lock,
  Terminal,
  ServerOff,
  Plus,
  RotateCcw,
  FileJson,
  Eye,
  Activity,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { APP_VERSION } from "../utils/version";

interface MockField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
}

export default function LandingPage() {
  const router = useRouter();
  const [workspaceInput, setWorkspaceInput] = useState("");
  const [mounted, setMounted] = useState(false);

  // Live Sandbox interactive states
  const [previewAccent, setPreviewAccent] = useState<"blue" | "violet" | "emerald" | "amber" | "rose">("blue");
  const [previewRadius, setPreviewRadius] = useState<"none" | "md" | "xl" | "full">("xl");
  const [previewShadow, setPreviewShadow] = useState<"none" | "md" | "lg">("md");
  const [mockFields, setMockFields] = useState<MockField[]>([
    { id: "fullName", label: "Full Name", type: "text", placeholder: "Jane Doe" },
    { id: "email", label: "Email Address", type: "email", placeholder: "jane.doe@example.com" }
  ]);
  const [demoActiveTab, setDemoActiveTab] = useState<"preview" | "schema">("preview");

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

  // Live Sandbox interactions
  const handleAddMockField = () => {
    if (mockFields.length >= 4) return;
    const additionalFields = [
      { id: "role", label: "Target Role", type: "select", options: ["Frontend Dev", "Backend Dev", "UI Designer"] },
      { id: "newsletter", label: "Subscribe to key updates", type: "checkbox" }
    ];
    const nextField = additionalFields[mockFields.length - 2];
    if (nextField) {
      setMockFields([...mockFields, nextField]);
    }
  };

  const handleResetMockDemo = () => {
    setMockFields([
      { id: "fullName", label: "Full Name", type: "text", placeholder: "Jane Doe" },
      { id: "email", label: "Email Address", type: "email", placeholder: "jane.doe@example.com" }
    ]);
    setPreviewAccent("blue");
    setPreviewRadius("xl");
    setPreviewShadow("md");
  };

  if (!mounted) return null;

  // Sandbox dynamic classes mapping
  const accentClasses = {
    blue: "bg-blue-600 border-blue-500 text-blue-600 focus:border-blue-500 focus:ring-blue-500/20",
    violet: "bg-violet-600 border-violet-500 text-violet-600 focus:border-violet-500 focus:ring-violet-500/20",
    emerald: "bg-emerald-600 border-emerald-500 text-emerald-600 focus:border-emerald-500 focus:ring-emerald-500/20",
    amber: "bg-amber-500 border-amber-450 text-amber-500 focus:border-amber-500 focus:ring-amber-500/20",
    rose: "bg-rose-600 border-rose-500 text-rose-600 focus:border-rose-500 focus:ring-rose-500/20"
  };

  const buttonAccentClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25",
    violet: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25",
    emerald: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25",
    amber: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25",
    rose: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25"
  };

  const textAccentClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    violet: "text-violet-600 dark:text-violet-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-500 dark:text-amber-400",
    rose: "text-rose-600 dark:text-rose-400"
  };

  const radiusClasses = {
    none: "rounded-none",
    md: "rounded-md",
    xl: "rounded-xl",
    full: "rounded-3xl"
  };

  const inputRadiusClasses = {
    none: "rounded-none",
    md: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full"
  };

  const shadowClasses = {
    none: "shadow-none border-slate-200 dark:border-slate-800",
    md: "shadow-md border-slate-200/80 dark:border-slate-800/80",
    lg: "shadow-xl border-slate-200/50 dark:border-slate-700/50"
  };

  const mockSchemaJson = JSON.stringify(
    {
      formTitle: "Live Sandbox Form",
      theme: {
        accent: previewAccent,
        borderRadius: previewRadius,
        shadowDensity: previewShadow
      },
      fields: mockFields.map(f => ({
        id: f.id,
        label: f.label,
        type: f.type,
        required: true,
        placeholder: f.placeholder,
        options: f.options
      }))
    },
    null,
    2
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden relative w-full">
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50 z-0" />

      {/* Dynamic Background Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 w-full">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[50%] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[25%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-900/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[40%] bg-purple-500/5 dark:bg-purple-900/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      {/* Sticky Premium Navbar */}
      <header className="w-full px-4 sm:px-8 md:px-12 py-4 flex justify-between items-center z-20 border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 shadow-sm">
        <div className="flex items-center space-x-10">
          <Link href="/" className="flex items-center focus:outline-none">
            <img src="/logo-long.png" alt="Formify Logo" className="h-8 md:h-9 object-contain" />
          </Link>
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <a href="#workspace-hub" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Workspace Hub</a>
            <a href="#features-bento" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Platform Features</a>
          </nav>
        </div>
        <div className="flex items-center space-x-5">
          <span className="hidden md:inline text-xs font-mono font-semibold text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-0.5 rounded">v{APP_VERSION}</span>
          <button
            onClick={handleCreateWorkspace}
            className="py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 focus:outline-none hover:scale-[1.02] active:scale-[0.98]"
          >
            Launch Studio
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full flex-1 z-10 flex flex-col">
        <section className="w-full px-4 sm:px-8 md:px-12 py-16 lg:py-24 border-b border-slate-200 dark:border-slate-900/60 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-ping mr-1" />
              <span>Real-Time P2P WebRTC Dynamic IDE</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Form Generation <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                IDE & Stylist
              </span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
              An enterprise-grade visual workspace. Build bidirectional schemas, customize themes live, collaborate instantly via WebRTC signaling, and export React+Tailwind code immediately.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleCreateWorkspace}
                className="p-2 md:py-4 md:px-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-505 text-white text-sm font-bold rounded-2xl cursor-pointer flex items-center space-x-3 transition-all shadow-lg shadow-blue-500/15 dark:shadow-blue-900/25 hover:shadow-blue-500/35 focus:outline-none hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Create Workspace</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              <a
                href="#workspace-hub"
                className="p-2 md:py-4 md:px-8 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-blue-600 dark:hover:text-white hover:border-slate-350 dark:hover:border-slate-700 text-sm font-bold rounded-2xl cursor-pointer transition-all focus:outline-none text-center hover:scale-[1.02] active:scale-[0.98]"
              >
                Join Collaborative Room
              </a>
            </div>

            {/* Micro Stats (Refined Typography) */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-900/60 max-w-lg">
              <div>
                <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">
                  <span className="font-mono">0</span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ml-0.5">ms</span>
                </span>
                <span className="text-[10px] uppercase font-extrabold text-slate-500 dark:text-slate-400 tracking-wider">Database Lag</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">
                  <span className="font-mono">100</span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ml-0.5">%</span>
                </span>
                <span className="text-[10px] uppercase font-extrabold text-slate-500 dark:text-slate-400 tracking-wider">Client-Side</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-slate-900 dark:text-white">
                  <span className="font-mono">5</span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ml-1">Presets</span>
                </span>
                <span className="text-[10px] uppercase font-extrabold text-slate-500 dark:text-slate-400 tracking-wider">Visual Themes</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Sandbox Demo (Right) */}
          <div className="lg:col-span-6 w-full flex flex-col justify-center">
            <div className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden relative backdrop-blur-md">
              
              {/* Sandbox Top Tab Bar */}
              <div className="flex justify-between items-center px-6 py-4 bg-slate-100/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-900">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="hidden md:inline text-xs font-mono font-semibold ml-2 text-slate-500 dark:text-slate-400">interactive_sandbox.js</span>
                </div>
                <div className="flex bg-slate-200/60 dark:bg-slate-900 rounded-lg p-0.5">
                  <button
                    onClick={() => setDemoActiveTab("preview")}
                    className={`flex items-center space-x-1.5 px-3 py-1 text-[11px] font-bold rounded-md transition-all focus:outline-none ${
                      demoActiveTab === "preview"
                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    <span>Live Preview</span>
                  </button>
                  <button
                    onClick={() => setDemoActiveTab("schema")}
                    className={`flex items-center space-x-1.5 px-3 py-1 text-[11px] font-bold rounded-md transition-all focus:outline-none ${
                      demoActiveTab === "schema"
                        ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <FileJson className="h-3 w-3" />
                    <span>Schema JSON</span>
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[380px]">
                
                {/* Sandbox Controls (Left inside card) */}
                <div className="md:col-span-5 space-y-5 text-left border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-5 md:pb-0 md:pr-6">
                  {/* Accent Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center">
                      <Sparkles className={`h-3 w-3 mr-1 ${textAccentClasses[previewAccent]}`} />
                      <span>Form Theme Color</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(["blue", "violet", "emerald", "amber", "rose"] as const).map(color => (
                        <button
                          key={color}
                          onClick={() => setPreviewAccent(color)}
                          className={`h-6 w-6 rounded-full cursor-pointer focus:outline-none border-2 transition-all ${
                            previewAccent === color
                              ? "scale-110 border-slate-600 dark:border-white ring-2 ring-blue-500/20"
                              : "border-transparent"
                          } ${
                            color === "blue"
                              ? "bg-blue-600"
                              : color === "violet"
                              ? "bg-violet-600"
                              : color === "emerald"
                              ? "bg-emerald-600"
                              : color === "amber"
                              ? "bg-amber-500"
                              : "bg-rose-600"
                          }`}
                          title={`Select ${color} accent`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Corners Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Border Corner Radius
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg">
                      {(["none", "md", "xl"] as const).map(r => (
                        <button
                          key={r}
                          onClick={() => setPreviewRadius(r)}
                          className={`text-[9px] font-bold py-1 px-1.5 rounded-md uppercase tracking-wider focus:outline-none transition-all ${
                            previewRadius === r
                              ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Demo Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleAddMockField}
                      disabled={mockFields.length >= 4}
                      className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:hover:bg-slate-100 dark:disabled:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-white"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Form Input</span>
                    </button>

                    <button
                      onClick={handleResetMockDemo}
                      className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-950 text-[10px] font-bold rounded-lg border border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-350 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset Sandbox</span>
                    </button>
                  </div>
                </div>

                {/* Sandbox Display (Right inside card) */}
                <div className="md:col-span-7 flex flex-col justify-center text-left">
                  {demoActiveTab === "preview" ? (
                    <div className={`w-full bg-slate-50 dark:bg-slate-950 p-5 border ${shadowClasses[previewShadow]} ${radiusClasses[previewRadius]} transition-all duration-300 relative`}>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                        <span>Demo Dynamic Form</span>
                        <span className={`h-1.5 w-1.5 rounded-full ${previewAccent === 'amber' ? 'bg-amber-500' : previewAccent === 'emerald' ? 'bg-emerald-600' : previewAccent === 'violet' ? 'bg-violet-600' : previewAccent === 'rose' ? 'bg-rose-600' : 'bg-blue-600'} animate-pulse`} />
                      </h4>
                      <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
                        {mockFields.map(f => (
                          <div key={f.id} className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{f.label}</label>
                            {f.type === "text" || f.type === "email" ? (
                              <input
                                type={f.type}
                                placeholder={f.placeholder}
                                className={`w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${inputRadiusClasses[previewRadius]} ${
                                  previewAccent === "blue"
                                    ? "focus:border-blue-500 focus:ring-blue-500/20"
                                    : previewAccent === "violet"
                                    ? "focus:border-violet-500 focus:ring-violet-500/20"
                                    : previewAccent === "emerald"
                                    ? "focus:border-emerald-500 focus:ring-emerald-500/20"
                                    : previewAccent === "amber"
                                    ? "focus:border-amber-500 focus:ring-amber-550/20"
                                    : "focus:border-rose-500 focus:ring-rose-500/20"
                                }`}
                                disabled
                              />
                            ) : f.type === "select" ? (
                              <select
                                className={`w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 transition-all ${inputRadiusClasses[previewRadius]} ${
                                  previewAccent === "blue"
                                    ? "focus:border-blue-500 focus:ring-blue-500/20"
                                    : previewAccent === "violet"
                                    ? "focus:border-violet-500 focus:ring-violet-500/20"
                                    : previewAccent === "emerald"
                                    ? "focus:border-emerald-500 focus:ring-emerald-500/20"
                                    : previewAccent === "amber"
                                    ? "focus:border-amber-500 focus:ring-amber-500/20"
                                    : "focus:border-rose-500 focus:ring-rose-500/20"
                                }`}
                                disabled
                              >
                                {f.options?.map(opt => <option key={opt}>{opt}</option>)}
                              </select>
                            ) : (
                              <div className="flex items-center space-x-2 pt-1">
                                <input
                                  type="checkbox"
                                  className={`h-4.5 w-4.5 border-slate-300 dark:border-slate-800 focus:ring-0 ${
                                    previewAccent === "blue"
                                      ? "text-blue-600 focus:ring-blue-500/20"
                                      : previewAccent === "violet"
                                      ? "text-violet-600 focus:ring-violet-500/20"
                                      : previewAccent === "emerald"
                                      ? "text-emerald-600 focus:ring-emerald-500/20"
                                      : previewAccent === "amber"
                                      ? "text-amber-500 focus:ring-amber-500/20"
                                      : "text-rose-600 focus:ring-rose-500/20"
                                  }`}
                                  disabled
                                  checked
                                />
                                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-350">{f.label}</span>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <button
                          className={`w-full py-2.5 px-4 text-xs font-bold transition-all shadow-md mt-4 cursor-pointer focus:outline-none flex items-center justify-center space-x-1.5 ${inputRadiusClasses[previewRadius]} ${buttonAccentClasses[previewAccent]}`}
                          disabled
                        >
                          <span>Submit Registration</span>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-slate-900/90 dark:bg-slate-950 p-4 border border-slate-800 rounded-xl overflow-hidden flex flex-col relative group">
                      <div className="text-[10px] font-mono text-slate-500 absolute top-2 right-3 uppercase select-none">Read-Only View</div>
                      <pre className="font-mono text-[10px] text-emerald-400 overflow-y-auto max-h-[300px] leading-relaxed flex-1 w-full select-all">
                        <code>{mockSchemaJson}</code>
                      </pre>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Row 2: Hub controls (Create/Join Workspace) */}
        <section id="workspace-hub" className="w-full px-4 sm:px-8 md:px-12 py-20 border-b border-slate-200 dark:border-slate-900/60 bg-slate-100/20 dark:bg-slate-950/20 relative">
          <div className="max-w-xl text-left space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Workspace Hub</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Launch a decentralized layout project in browser localstorage, or establish an instant WebRTC sync room with a teammate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            
            {/* Visual Canvas Builder Card */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900/80 p-8 sm:p-10 rounded-3xl flex flex-col justify-between hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 group shadow-sm hover:shadow-md">
              <div className="space-y-5">
                <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  <Wrench className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Fresh Dynamic Workspace</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Start mapping components in a sandboxed visual grid editor. Modify CSS variables (gaps, colors, corners, shadow profiles), organize fields, validate layouts, and copy React outputs immediately.
                </p>
              </div>
              <button
                onClick={handleCreateWorkspace}
                className="mt-8 py-3.5 px-6 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all text-slate-700 dark:text-white focus:outline-none hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Create Workspace</span>
                <ArrowRight className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Multiplayer Join Card */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900/80 p-8 sm:p-10 rounded-3xl flex flex-col justify-between hover:border-purple-500/40 dark:hover:border-purple-500/40 transition-all duration-300 group shadow-sm hover:shadow-md">
              <div className="space-y-5">
                <div className="p-3 bg-purple-500/10 text-purple-650 dark:text-purple-400 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Multiplayer / Live Sync</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Connect straight to a teammate's active editor room. Visual settings, layout schemas, and custom inputs are synchronized directly between browsers using PeerJS WebRTC Data Channels.
                </p>
              </div>
              <form onSubmit={handleJoinWorkspace} className="mt-8 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={workspaceInput}
                  onChange={(e) => setWorkspaceInput(e.target.value)}
                  placeholder="Enter Room Code (e.g. z9h1f)"
                  className="px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 rounded-xl text-xs font-semibold focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 text-purple-600 dark:text-purple-300 font-mono text-center uppercase tracking-widest flex-1 focus:ring-1 focus:ring-purple-550/20"
                />
                <button
                  type="submit"
                  disabled={!workspaceInput.trim()}
                  className="py-3.5 px-6 bg-purple-600 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-500 disabled:opacity-45 text-xs font-bold rounded-xl cursor-pointer text-white focus:outline-none transition-colors hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100"
                >
                  Join Room
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* Row 3: Bento grid features */}
        <section id="features-bento" className="w-full px-4 sm:px-8 md:px-12 py-20 lg:py-24 relative">
          <div className="max-w-xl text-left space-y-3 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Platform Capabilities</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Accelerate developer workflows with zero servers. Drag fields, style responsive layouts, and download output components instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento item 1 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-8 rounded-3xl space-y-5 hover:border-slate-350 dark:hover:border-slate-800 transition-all duration-300 shadow-sm hover:shadow-md group">
              <div className="text-blue-600 dark:text-blue-400 bg-blue-500/10 p-3 rounded-2xl w-fit group-hover:scale-105 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Local-First Sandbox</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero data resides on remote databases. Everything stays on the client, utilizing sandboxed browser LocalStorage settings for complete compliance and absolute privacy.
              </p>
            </div>

            {/* Bento item 2 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-8 rounded-3xl space-y-5 hover:border-slate-350 dark:hover:border-slate-800 transition-all duration-300 shadow-sm hover:shadow-md group">
              <div className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 p-3 rounded-2xl w-fit group-hover:scale-105 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Instant WebRTC Sync</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Stream edits directly peer-to-peer. Perfect for pair-programming custom dynamic forms, coordinating visual variables, and reviewing schemas instantly.
              </p>
            </div>

            {/* Bento item 3 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-8 rounded-3xl space-y-5 hover:border-slate-350 dark:hover:border-slate-800 transition-all duration-300 shadow-sm hover:shadow-md group">
              <div className="text-purple-600 dark:text-purple-400 bg-purple-500/10 p-3 rounded-2xl w-fit group-hover:scale-105 transition-transform">
                <Code className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">CSS Vars & Tailwind</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Compiles interactive layout changes into standard CSS styles or clean React+Tailwind component code blocks. One-click copy, zero configuration lag.
              </p>
            </div>

            {/* Bento item 4 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-8 rounded-3xl space-y-5 hover:border-slate-350 dark:hover:border-slate-800 transition-all duration-300 shadow-sm hover:shadow-md group">
              <div className="text-pink-600 dark:text-pink-400 bg-pink-500/10 p-3 rounded-2xl w-fit group-hover:scale-105 transition-transform">
                <Paintbrush className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">5 Visual Preset Layouts</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Toggle your workspaces seamlessly. Choose between crisp Light mode, dark coder theme, Matrix Green, Midnight Navy, and Corporate Gray style settings.
              </p>
            </div>

            {/* Bento item 5 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-8 rounded-3xl space-y-5 hover:border-slate-350 dark:hover:border-slate-800 transition-all duration-300 shadow-sm hover:shadow-md group">
              <div className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-2xl w-fit group-hover:scale-105 transition-transform">
                <Terminal className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-mono">Dynamic JSON Sync</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Visual card modifications sync in real-time with the schema editor. Build fields visually, tweak the JSON schema directly, and see layout changes update live.
              </p>
            </div>

            {/* Bento item 6 */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-900/80 p-8 rounded-3xl space-y-5 hover:border-slate-350 dark:hover:border-slate-800 transition-all duration-300 shadow-sm hover:shadow-md group">
              <div className="text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3 rounded-2xl w-fit group-hover:scale-105 transition-transform">
                <ServerOff className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-mono">Local CSV/JSON Exporter</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Record submissions locally in browser memory. View dynamic log tables, clear data logs, or download CSV files for analytical modeling and databases.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Full-width Footer */}
      <footer className="w-full px-4 sm:px-8 md:px-12 py-12 border-t border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-slate-950/40 z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Formify Studio Pro. Decentralized client-side developer utility.
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
