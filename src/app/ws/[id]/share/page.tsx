"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useP2PSync } from "../../../../utils/p2pSync";
import { themeMap, GlobalThemeMode } from "../../../../utils/appTheme";
import { ThemeSettings } from "../../../../utils/codeGenerators";
import FormGenerator from "../../../../components/FormGenerator";
import { ArrowLeft, Radio, AlertCircle, Check, Globe } from "lucide-react";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

const defaultTheme: ThemeSettings = {
  primaryColor: "indigo",
  borderRadius: "md",
  layout: "1-col",
  shadow: "md"
};

export default function FormSharePage({ params }: SharePageProps) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.id;
  const router = useRouter();

  // Storage keys for guest cache
  const cacheSchemaKey = `formify_guest_schema_${workspaceId}`;
  const cacheThemeKey = `formify_guest_theme_${workspaceId}`;
  const cacheFontKey = `formify_guest_font_fam_${workspaceId}`;
  const cacheScaleKey = `formify_guest_font_scale_${workspaceId}`;
  const cacheGlobalThemeKey = `formify_guest_global_theme_${workspaceId}`;

  // Local state initialized from cache or defaults
  const [schema, setSchema] = useState<any>(null);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultTheme);
  const [fontFamily, setFontFamily] = useState<"sans" | "mono" | "serif">("sans");
  const [fontScale, setFontScale] = useState<number>(1.0);
  const [globalTheme, setGlobalTheme] = useState<GlobalThemeMode>("light");

  // IP collection and fill restrictions state
  const [clientIp, setClientIp] = useState<string>("N/A");
  const [fillMode, setFillMode] = useState<"single" | "multi">("multi");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [guestSubmittedData, setGuestSubmittedData] = useState<any>(null);

  // Fetch client IP on mount
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setClientIp(data.ip || "N/A"))
      .catch((err) => {
        console.warn("Failed to fetch IP via ipify, trying fallback...", err);
        fetch("https://ipapi.co/json/")
          .then((res) => res.json())
          .then((data) => setClientIp(data.ip || "N/A"))
          .catch((e) => console.error("All IP lookups failed", e));
      });
  }, []);

  // Read fill mode from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (mode === "single" || mode === "multi") {
      setFillMode(mode);
    }
  }, []);

  // Check if form was already submitted in single-fill mode
  useEffect(() => {
    if (fillMode === "single") {
      const stored = localStorage.getItem(`formify_submitted_data_${workspaceId}`);
      if (stored) {
        setHasSubmitted(true);
        setGuestSubmittedData(JSON.parse(stored));
      }
    } else {
      setHasSubmitted(false);
    }
  }, [fillMode, workspaceId]);

  // Load from local cache on mount
  useEffect(() => {
    try {
      const cachedSchema = localStorage.getItem(cacheSchemaKey);
      if (cachedSchema) setSchema(JSON.parse(cachedSchema));

      const cachedTheme = localStorage.getItem(cacheThemeKey);
      if (cachedTheme) setThemeSettings(JSON.parse(cachedTheme));

      const cachedFont = localStorage.getItem(cacheFontKey);
      if (cachedFont) setFontFamily(cachedFont as any);

      const cachedScale = localStorage.getItem(cacheScaleKey);
      if (cachedScale) setFontScale(parseFloat(cachedScale));

      const cachedGlobalTheme = localStorage.getItem(cacheGlobalThemeKey);
      if (cachedGlobalTheme) setGlobalTheme(cachedGlobalTheme as GlobalThemeMode);
    } catch (e) {
      console.error("Failed to load guest cache settings", e);
    }
  }, [workspaceId]);

  // Global Text Resizing Scale Effect
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [fontScale]);

  // Setup P2P connection as guest
  const {
    status: p2pStatus,
    initPeerJS,
    disconnect,
    submitForm
  } = useP2PSync(
    workspaceId,
    {}, // guest has no local schema to broadcast
    (remoteState) => {
      // Sync all editor state properties from host
      if (remoteState.schema) {
        setSchema(remoteState.schema);
        localStorage.setItem(cacheSchemaKey, JSON.stringify(remoteState.schema));
      }
      if (remoteState.theme) {
        setThemeSettings(remoteState.theme);
        localStorage.setItem(cacheThemeKey, JSON.stringify(remoteState.theme));
      }
      if (remoteState.fontFamily) {
        setFontFamily(remoteState.fontFamily);
        localStorage.setItem(cacheFontKey, remoteState.fontFamily);
      }
      if (remoteState.fontScale) {
        setFontScale(remoteState.fontScale);
        localStorage.setItem(cacheScaleKey, remoteState.fontScale.toString());
      }
      if (remoteState.globalTheme) {
        setGlobalTheme(remoteState.globalTheme);
        localStorage.setItem(cacheGlobalThemeKey, remoteState.globalTheme);
      }
    },
    undefined,
    true // isGuest = true
  );

  // Initialize P2P connection on mount
  useEffect(() => {
    initPeerJS();
    return () => {
      disconnect();
    };
  }, [workspaceId]);

  const themeTokens = themeMap[globalTheme] || themeMap.light;
  const fontFamClass =
    fontFamily === "mono" ? "font-mono" : fontFamily === "serif" ? "font-serif" : "font-sans";

  const handleFormSubmit = (data: Record<string, any>) => {
    // Broadcast the submission back to the host with client IP metadata
    const submissionPayload = {
      id: "sub_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      ip: clientIp,
      data: data
    };
    submitForm(submissionPayload);

    // If single fill constraints are active, persist locally to block future submissions
    if (fillMode === "single") {
      localStorage.setItem(`formify_submitted_data_${workspaceId}`, JSON.stringify(data));
      setHasSubmitted(true);
      setGuestSubmittedData(data);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${themeTokens.bg} ${fontFamClass}`}>
      {/* Top Status Banner */}
      <div className="flex-shrink-0 z-20">
        {p2pStatus === "disconnected" && (
          <div className="bg-red-500/10 border-b border-red-500/25 px-4 py-2.5 text-center text-xs font-semibold text-red-600 dark:text-red-400 flex items-center justify-center space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              Workspace offline. Submissions cannot be synced. The form owner must open Formify Studio to receive entries.
            </span>
          </div>
        )}
      </div>

      {/* Main layout body */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative">
        {/* Workspace Brand Header */}
        <div className="w-full max-w-2xl flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <img src="/logo.png" alt="Formify Logo" className="h-6 sm:h-7 opacity-85" />
            <span className={`text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary}`}>
              Form Portal
            </span>
          </div>
          
          {p2pStatus === "joined" ? (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20 rounded-full flex items-center space-x-1.5 shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>Live Synced</span>
            </span>
          ) : p2pStatus === "connecting" ? (
            <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 px-2.5 py-1 border border-yellow-500/20 rounded-full flex items-center space-x-1.5 shadow-sm animate-pulse">
              <div className="h-2 w-2 border border-yellow-500 border-t-transparent rounded-full animate-spin" />
              <span>Connecting...</span>
            </span>
          ) : (
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 border border-red-500/20 rounded-full flex items-center space-x-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>Offline</span>
            </span>
          )}
        </div>

        {/* Form Mode Toggle Selector for guest convenience */}
        <div className="w-full max-w-2xl mb-5 flex justify-between items-center bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-gray-200 dark:border-gray-800/80">
          <span className={`text-[10px] uppercase font-bold tracking-wider ${themeTokens.textSecondary} flex items-center space-x-1`}>
            <Globe className="h-3.5 w-3.5 text-blue-500" />
            <span>Submission Mode</span>
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => setFillMode("multi")}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                fillMode === "multi"
                  ? "bg-blue-600 text-white shadow-sm"
                  : `text-gray-500 hover:text-gray-700 dark:hover:text-gray-300`
              }`}
            >
              Multifill
            </button>
            <button
              onClick={() => setFillMode("single")}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                fillMode === "single"
                  ? "bg-blue-600 text-white shadow-sm"
                  : `text-gray-500 hover:text-gray-700 dark:hover:text-gray-300`
              }`}
            >
              Single Fill
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-center">
          {hasSubmitted ? (
            <div className={`w-full p-8 rounded-2xl border ${themeTokens.border} ${themeTokens.card} text-center shadow-lg max-w-md mx-auto relative overflow-hidden animate-fade-in`}>
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4 animate-scale-up">
                <Check className="h-6 w-6" />
              </div>
              <h3 className={`text-md font-bold ${themeTokens.text}`}>Already Submitted</h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${themeTokens.textSecondary}`}>
                You have already filled out this form. This form is configured to only allow a single response.
              </p>
              {guestSubmittedData && (
                <div className={`mt-5 w-full text-left border rounded-xl p-3.5 text-xs font-mono max-h-48 overflow-y-auto ${themeTokens.inputBg} ${themeTokens.inputText} ${themeTokens.border} shadow-inner`}>
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b pb-1">Your Submitted Response</span>
                  {Object.entries(guestSubmittedData).map(([k, v]) => {
                    const field = schema?.fields?.find((f: any) => f.id === k);
                    const displayName = field?.label || k;
                    return (
                      <div key={k} className="truncate py-0.5">
                        <span className="opacity-55">{displayName}:</span> {String(v)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : schema ? (
            <FormGenerator
              schema={schema}
              theme={themeSettings}
              themeTokens={themeTokens}
              fontFamily={fontFamily}
              fontScale={fontScale}
              onSubmitSubmission={handleFormSubmit}
              fillMode={fillMode}
            />
          ) : (
            <div className={`w-full p-8 rounded-2xl border ${themeTokens.border} ${themeTokens.card} text-center shadow-lg max-w-md mx-auto`}>
              <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <h3 className={`text-md font-bold ${themeTokens.text}`}>Waiting for form details...</h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${themeTokens.textSecondary}`}>
                We are establishing a connection with the editor workspace host to load the form.
              </p>
            </div>
          )}
        </div>

        {/* Footer branding */}
        <div className={`mt-8 text-center text-[10px] font-bold ${themeTokens.textSecondary} flex-shrink-0 opacity-55`}>
          Powered by Formify Studio &bull; Serverless P2P
        </div>
      </div>
    </div>
  );
}
