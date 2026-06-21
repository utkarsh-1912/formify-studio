"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useP2PSync } from "../../../../utils/p2pSync";
import { themeMap, GlobalThemeMode } from "../../../../utils/appTheme";
import { ThemeSettings } from "../../../../utils/codeGenerators";
import FormGenerator from "../../../../components/FormGenerator";
import { ArrowLeft, Radio, AlertCircle } from "lucide-react";

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
    // Broadcast the submission back to the host via WebRTC
    submitForm(data);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${themeTokens.bg} ${fontFamClass}`}>
      {/* Top Status Banner */}
      <div className="flex-shrink-0 z-20">
        {p2pStatus === "disconnected" && (
          <div className="bg-red-500/10 border-b border-red-500/25 px-4 py-2.5 text-center text-xs font-semibold text-red-650 dark:text-red-400 flex items-center justify-center space-x-2">
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
        <div className="w-full max-w-2xl flex items-center justify-between mb-6 flex-shrink-0">
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
            <span className="text-[10px] font-bold text-red-650 dark:text-red-400 bg-red-500/10 px-2.5 py-1 border border-red-500/20 rounded-full flex items-center space-x-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>Offline</span>
            </span>
          )}
        </div>

        {/* Content Box */}
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-center">
          {schema ? (
            <FormGenerator
              schema={schema}
              theme={themeSettings}
              themeTokens={themeTokens}
              fontFamily={fontFamily}
              fontScale={fontScale}
              onSubmitSubmission={handleFormSubmit}
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
