import React, { useState, useEffect } from "react";
import JsonEditor from "./components/JsonEditor";
import FormGenerator from "./components/FormGenerator";
import VisualBuilder from "./components/VisualBuilder";
import ThemeCustomizer from "./components/ThemeCustomizer";
import TemplatesGallery from "./components/TemplatesGallery";
import SubmissionsDashboard, { SubmissionEntry } from "./components/SubmissionsDashboard";
import CodeExporter from "./components/CodeExporter";
import validateSchema from "./utils/schemaValidation";
import { ThemeSettings } from "./utils/codeGenerators";
import { GlobalThemeMode, themeMap } from "./utils/appTheme";
import { useP2PSync } from "./utils/p2pSync";
import { useRouter } from "next/navigation";
import { APP_VERSION } from "./utils/version";
import {
  Code,
  Wrench,
  Paintbrush,
  Layers,
  Eye,
  Inbox,
  ArrowUpRight,
  Share2,
  Check,
  Settings,
  Radio,
  ArrowLeft,
  Plus,
  Minus,
  Users
} from "lucide-react";

// Clean canvas schema as default for new workspaces
const cleanDefaultSchema = {
  formTitle: "New Form",
  formDescription: "Please fill out this form.",
  fields: []
};

const defaultTheme: ThemeSettings = {
  primaryColor: "indigo",
  borderRadius: "md",
  layout: "1-col",
  shadow: "md"
};

interface AppProps {
  workspaceId?: string;
}

const App: React.FC<AppProps> = ({ workspaceId }) => {
  const router = useRouter();

  // Storage keys isolated by Workspace ID
  const schemaStorageKey = workspaceId ? `formify_schema_${workspaceId}` : "formify_schema";
  const submissionsStorageKey = workspaceId ? `formify_submissions_${workspaceId}` : "formify_submissions";
  const themeStorageKey = workspaceId ? `formify_theme_${workspaceId}` : "formify_theme";
  const globalThemeStorageKey = workspaceId ? `formify_global_theme_${workspaceId}` : "formify_global_theme";
  const roomNameStorageKey = workspaceId ? `formify_room_name_${workspaceId}` : "formify_room_name";
  const fontFamStorageKey = workspaceId ? `formify_font_fam_${workspaceId}` : "formify_font_fam";
  const fontScaleStorageKey = workspaceId ? `formify_font_scale_${workspaceId}` : "formify_font_scale";

  // States
  const [jsonSchema, setJsonSchema] = useState(JSON.stringify(cleanDefaultSchema, null, 2));
  const [schema, setSchema] = useState(cleanDefaultSchema);
  const [error, setError] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("My Form Workspace");
  
  // Tabs active state
  const [leftTab, setLeftTab] = useState<"visual" | "json" | "theme" | "templates">("visual");
  const [rightTab, setRightTab] = useState<"preview" | "submissions" | "code">("preview");

  // Styling customizer variables
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultTheme);

  // Global Theme Mode State
  const [globalTheme, setGlobalTheme] = useState<GlobalThemeMode>("light");
  const themeTokens = themeMap[globalTheme];

  // Typography Options State
  const [fontFamily, setFontFamily] = useState<"sans" | "mono" | "serif">("sans");
  const [fontScale, setFontScale] = useState<number>(1.0);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [stagedTheme, setStagedTheme] = useState<GlobalThemeMode>("light");
  const [stagedFont, setStagedFont] = useState<"sans" | "mono" | "serif">("sans");
  const [stagedScale, setStagedScale] = useState<number>(1.0);
  const [isWorkspaceInitialized, setIsWorkspaceInitialized] = useState(true);

  // Submissions Log state
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);

  // Share URL state
  const [shareCopied, setShareCopied] = useState(false);
  const [justPushed, setJustPushed] = useState(false);

  // P2P WebRTC Live sync hook integration
  const {
    status: p2pStatus,
    peerId: p2pPeerId,
    connectedPeers,
    initPeerJS,
    disconnect: disconnectP2P,
    push: pushP2P
  } = useP2PSync(
    workspaceId || "default",
    schema,
    (remoteSchema) => {
      setSchema(remoteSchema);
      setJsonSchema(JSON.stringify(remoteSchema, null, 2));
      try {
        validateSchema(remoteSchema);
        setError(null);
      } catch (e) {
        setError((e as Error).message);
      }
    }
  );

  const handlePushP2P = () => {
    pushP2P();
    setJustPushed(true);
    setTimeout(() => setJustPushed(false), 2000);
  };

  // Load submissions, theme, and schema on load
  useEffect(() => {
    // 1. Schema load (fallback to cleanDefaultSchema if not found)
    try {
      const storedSchema = localStorage.getItem(schemaStorageKey);
      if (storedSchema) {
        const parsed = JSON.parse(storedSchema);
        validateSchema(parsed);
        setSchema(parsed);
        setJsonSchema(storedSchema);
        setIsWorkspaceInitialized(true);
      } else {
        setSchema(cleanDefaultSchema);
        setJsonSchema(JSON.stringify(cleanDefaultSchema, null, 2));
        setIsWorkspaceInitialized(false);
      }
    } catch (e) {
      console.error("Failed to load schema", e);
    }

    // 2. Submissions load
    try {
      const storedSubmissions = localStorage.getItem(submissionsStorageKey);
      if (storedSubmissions) {
        setSubmissions(JSON.parse(storedSubmissions));
      }
    } catch (e) {
      console.error("Failed to load submissions", e);
    }

    // 3. Theme & Typography load
    try {
      const storedTheme = localStorage.getItem(themeStorageKey);
      if (storedTheme) {
        setThemeSettings(JSON.parse(storedTheme));
      }
      const storedGlobalTheme = localStorage.getItem(globalThemeStorageKey);
      if (storedGlobalTheme) {
        setGlobalTheme(storedGlobalTheme as GlobalThemeMode);
      }
      const storedRoomName = localStorage.getItem(roomNameStorageKey);
      if (storedRoomName) {
        setRoomName(storedRoomName);
      }
      const storedFont = localStorage.getItem(fontFamStorageKey);
      if (storedFont) {
        setFontFamily(storedFont as any);
      }
      const storedScale = localStorage.getItem(fontScaleStorageKey);
      if (storedScale) {
        setFontScale(parseFloat(storedScale));
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  }, [schemaStorageKey, submissionsStorageKey, themeStorageKey, globalThemeStorageKey, roomNameStorageKey, fontFamStorageKey, fontScaleStorageKey]);

  // Handle JSON Text Editor changes
  const handleJsonChange = (value: string) => {
    setJsonSchema(value);
    if (value.trim() === "") {
      setError("Schema cannot be empty.");
      return;
    }
    try {
      const parsed = JSON.parse(value);
      validateSchema(parsed);
      setSchema(parsed);
      setError(null);
      localStorage.setItem(schemaStorageKey, value);
      setIsWorkspaceInitialized(true);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  // Handle Visual Editor changes
  const handleVisualChange = (updatedSchema: any) => {
    setSchema(updatedSchema);
    const jsonStr = JSON.stringify(updatedSchema, null, 2);
    setJsonSchema(jsonStr);
    try {
      validateSchema(updatedSchema);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
    localStorage.setItem(schemaStorageKey, jsonStr);
    setIsWorkspaceInitialized(true);
  };

  // Load a preset template
  const handleLoadTemplate = (templateSchema: any) => {
    handleVisualChange(templateSchema);
    setLeftTab("visual");
  };

  // Theme change hooks
  const handleThemeSettingsChange = (updatedSettings: ThemeSettings) => {
    setThemeSettings(updatedSettings);
    localStorage.setItem(themeStorageKey, JSON.stringify(updatedSettings));
  };

  const handleGlobalThemeChange = (mode: GlobalThemeMode) => {
    setGlobalTheme(mode);
    localStorage.setItem(globalThemeStorageKey, mode);
  };

  const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRoomName(val);
    localStorage.setItem(roomNameStorageKey, val);
  };

  // Submissions operations
  const handleSubmitSubmission = (data: Record<string, any>) => {
    const newEntry: SubmissionEntry = {
      id: "sub_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      data
    };
    const updated = [newEntry, ...submissions];
    setSubmissions(updated);
    localStorage.setItem(submissionsStorageKey, JSON.stringify(updated));
  };

  const handleDeleteSubmission = (id: string) => {
    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    localStorage.setItem(submissionsStorageKey, JSON.stringify(updated));
  };

  const handleClearAllSubmissions = () => {
    if (window.confirm("Are you sure you want to permanently clear all submissions?")) {
      setSubmissions([]);
      localStorage.removeItem(submissionsStorageKey);
    }
  };

  // Generate shareable URL
  const handleShareLink = () => {
    try {
      const minified = JSON.stringify(schema);
      const encoded = btoa(unescape(encodeURIComponent(minified)));
      const shareUrl = `${window.location.origin}/ws/${workspaceId || "default"}?s=${encoded}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      });
    } catch (e) {
      alert("Failed to generate share link.");
    }
  };

  // Settings Modal controls
  const openSettings = () => {
    setStagedTheme(globalTheme);
    setStagedFont(fontFamily);
    setStagedScale(fontScale);
    setIsSettingsOpen(true);
  };

  const applySettings = () => {
    setGlobalTheme(stagedTheme);
    setFontFamily(stagedFont);
    setFontScale(stagedScale);
    localStorage.setItem(globalThemeStorageKey, stagedTheme);
    localStorage.setItem(fontFamStorageKey, stagedFont);
    localStorage.setItem(fontScaleStorageKey, stagedScale.toString());
    setIsSettingsOpen(false);
  };

  const adjustStagedScale = (direction: "inc" | "dec") => {
    if (direction === "inc" && stagedScale < 1.5) {
      setStagedScale(parseFloat((stagedScale + 0.1).toFixed(1)));
    } else if (direction === "dec" && stagedScale > 0.8) {
      setStagedScale(parseFloat((stagedScale - 0.1).toFixed(1)));
    }
  };

  const tabBtnClass = (tabId: string, isActive: boolean) => `flex items-center space-x-1.5 pb-2.5 pt-1.5 px-4 text-xs font-bold border-b-2 cursor-pointer transition-all focus:outline-none ${
    isActive
      ? themeTokens.tabActive
      : themeTokens.tabInactive
  }`;

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden ${themeTokens.bg}`}>
      {/* Header toolbar */}
      <header className={`flex-shrink-0 border-b px-6 py-3 flex items-center justify-between shadow-sm z-20 ${themeTokens.header}`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/")}
            className={`p-1.5 rounded-lg border ${themeTokens.border} hover:bg-black/5 cursor-pointer focus:outline-none text-gray-500`}
            title="Return to Home Screen"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center space-x-3.5">
            <img src="/logo.png" alt="Formify Logo" className="h-8 flex-shrink-0" />
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary}`}>
              v{APP_VERSION}
            </span>
            {/* Inline Editable Room Name */}
            <input
              type="text"
              value={roomName}
              onChange={handleRoomNameChange}
              className={`px-2.5 py-1 bg-transparent hover:bg-black/5 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-lg text-sm font-semibold focus:outline-none transition-all ${themeTokens.inputText}`}
              title="Click to rename workspace"
            />
            {isWorkspaceInitialized ? (
              <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-500/25 flex-shrink-0">
                Saved Alphanumeric
              </span>
            ) : (
              <button
                onClick={() => {
                  localStorage.setItem(schemaStorageKey, JSON.stringify(schema));
                  setIsWorkspaceInitialized(true);
                }}
                className="text-[9px] bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border border-amber-500/25 flex-shrink-0 cursor-pointer animate-pulse focus:outline-none"
                title="Workspace not created in LocalStorage. Click to initialize."
              >
                Draft (Click to Init)
              </button>
            )}
          </div>
        </div>

        {/* Global Toolbar Options */}
        <div className="flex items-center space-x-3">
          {/* P2P Multiplayer Sync Status Badge */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 border ${themeTokens.border} ${themeTokens.inputBg} rounded-xl text-xs font-bold`}>
            {p2pStatus === "disconnected" && (
              <button
                onClick={initPeerJS}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 cursor-pointer focus:outline-none"
                title="Enable multiplayer peer-to-peer real-time sync"
              >
                <Radio className="h-4.5 w-4.5 animate-pulse" />
                <span>Go Live (P2P)</span>
              </button>
            )}
            {p2pStatus === "connecting" && (
              <span className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                <div className="h-3 w-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </span>
            )}
            {(p2pStatus === "hosting" || p2pStatus === "joined") && (
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500 absolute" />
                  <span className="font-extrabold capitalize text-[10px] tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    {p2pStatus}
                  </span>
                </span>
                
                {connectedPeers.length > 0 && (
                  <span className={`flex items-center space-x-1 font-mono text-[10px] ${themeTokens.textSecondary}`}>
                    <Users className="h-3.5 w-3.5" />
                    <span>{connectedPeers.length} peer(s)</span>
                  </span>
                )}

                <button
                  onClick={handlePushP2P}
                  disabled={justPushed}
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all cursor-pointer focus:outline-none ${
                    justPushed
                      ? "bg-emerald-500 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  }`}
                  title="Push current local changes to all connected peers"
                >
                  {justPushed ? "Pushed!" : "Push"}
                </button>

                <button
                  onClick={disconnectP2P}
                  className="text-red-500 hover:text-red-650 cursor-pointer focus:outline-none text-[10px] font-extrabold underline decoration-dotted"
                >
                  Disconnect
                </button>
              </div>
            )}
            {p2pStatus === "error" && (
              <span className="text-red-600 font-extrabold text-[10px] flex items-center space-x-1.5">
                <span>P2P Offline</span>
                <button onClick={initPeerJS} className="underline text-blue-500 focus:outline-none">Retry</button>
              </span>
            )}
          </div>

          {/* Settings gear icon */}
          <button
            onClick={openSettings}
            className={`p-2 rounded-xl border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary} hover:${themeTokens.text} cursor-pointer focus:outline-none transition-all shadow-sm`}
            title="Open Workspace Settings"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>

          <button
            onClick={handleShareLink}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-xl text-xs font-bold cursor-pointer transition-colors focus:outline-none"
          >
            {shareCopied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Share Workspace</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container Dashboard */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Workspace (55%) */}
        <div className={`w-full md:w-[55%] flex flex-col border-r overflow-hidden ${themeTokens.sidebar}`}>
          {/* Tabs header */}
          <div className={`flex-shrink-0 flex border-b bg-black/5 px-4 pt-2 ${themeTokens.border}`}>
            {[
              { id: "visual", name: "Visual Builder", icon: Wrench },
              { id: "json", name: "JSON Editor", icon: Code },
              { id: "theme", name: "Theme Customizer", icon: Paintbrush },
              { id: "templates", name: "Templates Gallery", icon: Layers }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLeftTab(tab.id as any)}
                  className={tabBtnClass(tab.id, leftTab === tab.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Left panel rendering */}
          <div className="flex-1 overflow-hidden relative">
            {leftTab === "visual" && (
              <VisualBuilder schema={schema} themeTokens={themeTokens} onSchemaChange={handleVisualChange} />
            )}
            {leftTab === "json" && (
              <JsonEditor value={jsonSchema} themeTokens={themeTokens} onChange={handleJsonChange} error={error} />
            )}
            {leftTab === "theme" && (
              <ThemeCustomizer
                settings={themeSettings}
                themeTokens={themeTokens}
                globalTheme={globalTheme}
                onChange={handleThemeSettingsChange}
                onGlobalThemeChange={handleGlobalThemeChange}
              />
            )}
            {leftTab === "templates" && (
              <TemplatesGallery themeTokens={themeTokens} onSelectTemplate={handleLoadTemplate} />
            )}
          </div>
        </div>

        {/* Right Side: Form Render and Output Dashboard (45%) */}
        <div className={`w-full md:w-[45%] flex flex-col overflow-hidden`}>
          {/* Tabs header */}
          <div className={`flex-shrink-0 flex border-b bg-black/5 px-4 pt-2 ${themeTokens.border}`}>
            {[
              { id: "preview", name: "Live Preview", icon: Eye },
              { id: "submissions", name: "Submissions Log", icon: Inbox, badge: submissions.length },
              { id: "code", name: "Export Code", icon: ArrowUpRight }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRightTab(tab.id as any)}
                  className={tabBtnClass(tab.id, rightTab === tab.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="text-[10px] bg-blue-500 text-white font-extrabold px-1.5 py-0.5 rounded-full ml-1 animate-scale-up">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right panel rendering */}
          <div className="flex-1 overflow-hidden relative">
            {rightTab === "preview" && (
              <FormGenerator
                schema={schema}
                theme={themeSettings}
                themeTokens={themeTokens}
                fontFamily={fontFamily}
                fontScale={fontScale}
                onSubmitSubmission={handleSubmitSubmission}
              />
            )}
            {rightTab === "submissions" && (
              <SubmissionsDashboard
                submissions={submissions}
                themeTokens={themeTokens}
                onDeleteSubmission={handleDeleteSubmission}
                onClearAllSubmissions={handleClearAllSubmissions}
              />
            )}
            {rightTab === "code" && (
              <CodeExporter schema={schema} theme={themeSettings} themeTokens={themeTokens} />
            )}
          </div>
        </div>
      </div>

      {/* Footer status bar */}
      <footer className={`flex-shrink-0 border-t px-6 py-2 flex items-center justify-between text-[11px] z-20 ${themeTokens.footer}`}>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">
            Fields Count: <span className="font-bold opacity-85">{schema.fields?.length || 0}</span>
          </span>
          <span className="font-semibold">
            Submissions Logged: <span className="font-bold opacity-85">{submissions.length}</span>
          </span>
          {workspaceId && (
            <span className="font-semibold text-blue-500 font-mono select-all">
              Workspace ID: {workspaceId}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Validation Status:</span>
          {error ? (
            <span className="text-red-650 font-bold bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded flex items-center space-x-1 animate-pulse border border-red-200/30">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              <span>Invalid Configuration</span>
            </span>
          ) : (
            <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded flex items-center space-x-1 border border-emerald-200/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Schema Fully Valid</span>
            </span>
          )}
        </div>
      </footer>

      {/* Settings Modal Component */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className={`rounded-2xl max-w-md w-full flex flex-col shadow-2xl overflow-hidden border ${themeTokens.border} ${themeTokens.modalBg} animate-scale-up`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${themeTokens.border} flex justify-between items-center bg-black/5`}>
              <div>
                <h4 className={`text-sm font-bold ${themeTokens.text}`}>Settings</h4>
                <p className={`text-[11px] ${themeTokens.textSecondary}`}>
                  Personalize appearance & typography
                </p>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className={`text-xs hover:opacity-80 transition-all font-semibold ${themeTokens.textSecondary}`}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5 overflow-y-auto max-h-[70vh]">
              {/* Section 1: Themes */}
              <div className="space-y-2">
                <span className={`block text-[11px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>Theme</span>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: "dark", name: "Dark", color: "bg-gray-900 border-gray-800" },
                    { id: "light", name: "Light", color: "bg-white border-gray-200" },
                    { id: "matrix", name: "Matrix", color: "bg-black border-emerald-500/30" },
                    { id: "midnight", name: "Midnight", color: "bg-[#0b132b] border-[#3a506b]/40" },
                    { id: "corporate", name: "Corporate", color: "bg-slate-50 border-slate-350" }
                  ].map((t) => {
                    const isStaged = stagedTheme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setStagedTheme(t.id as GlobalThemeMode)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer focus:outline-none ${
                          isStaged
                            ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/35"
                            : `${themeTokens.border} ${themeTokens.inputBg} hover:border-gray-400`
                        }`}
                        title={t.name}
                      >
                        <div className={`h-6 w-8 rounded border shadow-inner flex items-center justify-center ${t.color}`}>
                          <span className={`text-[8px] font-bold ${t.id === "light" ? "text-gray-900" : t.id === "matrix" ? "text-emerald-400" : t.id === "midnight" ? "text-cyan-400" : t.id === "corporate" ? "text-slate-800" : "text-gray-100"}`}>Aa</span>
                        </div>
                        <span className={`text-[9px] font-semibold mt-1 truncate w-full ${isStaged ? "text-blue-550 font-bold" : themeTokens.textSecondary}`}>
                          {t.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Typography Style */}
              <div className="space-y-3">
                <span className={`block text-[11px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>Typography</span>
                
                {/* Font Family Sub-section */}
                <div className="space-y-1.5">
                  <span className={`block text-[10px] font-semibold ${themeTokens.textSecondary}`}>Font Family</span>
                  <div className="space-y-2">
                    {[
                      { id: "sans", name: "Sans Serif", desc: "Geist Sans — clean & modern", font: "font-sans" },
                      { id: "mono", name: "Monospace", desc: "Geist Mono — developer terminal", font: "font-mono" },
                      { id: "serif", name: "Serif", desc: "Georgia — technical literature", font: "font-serif" }
                    ].map((f) => {
                      const isStaged = stagedFont === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setStagedFont(f.id as any)}
                          className={`w-full flex items-center justify-between py-2 px-3 rounded-xl border text-left text-xs transition-all cursor-pointer focus:outline-none ${
                            isStaged
                              ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/25 text-blue-600 font-medium"
                              : `${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary} hover:border-gray-400`
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className={`font-semibold ${f.font} ${isStaged ? 'text-blue-600' : themeTokens.text}`}>{f.name}</span>
                            <span className="text-[10px] opacity-75">{f.desc}</span>
                          </div>
                          {isStaged && <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Font Scale Sub-section */}
                <div className="space-y-1.5">
                  <span className={`block text-[10px] font-semibold ${themeTokens.textSecondary}`}>Font Scale</span>
                  <div className={`flex items-center justify-between p-2 rounded-xl border ${themeTokens.border} ${themeTokens.inputBg}`}>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => adjustStagedScale("dec")}
                        disabled={stagedScale <= 0.8}
                        className={`p-1.5 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 rounded-lg text-gray-500 cursor-pointer focus:outline-none border ${themeTokens.border}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className={`text-xs font-bold w-12 text-center ${themeTokens.text}`}>
                        {stagedScale.toFixed(1)}x
                      </span>
                      <button
                        onClick={() => adjustStagedScale("inc")}
                        disabled={stagedScale >= 1.5}
                        className={`p-1.5 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 rounded-lg text-gray-500 cursor-pointer focus:outline-none border ${themeTokens.border}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => setStagedScale(1.0)}
                      disabled={stagedScale === 1.0}
                      className={`px-3 py-1 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 rounded-lg text-xs font-bold cursor-pointer focus:outline-none border ${themeTokens.border} ${themeTokens.textSecondary}`}
                    >
                      Default
                    </button>
                  </div>

                  {/* Micro Preview Box */}
                  <div className={`border ${themeTokens.border} rounded-xl p-2.5 bg-black/5 text-center`}>
                    <p 
                      style={{ fontSize: `calc(0.875rem * ${stagedScale})` }} 
                      className={`transition-all leading-relaxed ${stagedFont === 'mono' ? 'font-mono' : stagedFont === 'serif' ? 'font-serif' : 'font-sans'} ${themeTokens.text}`}
                    >
                      Preview text scaling
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className={`px-6 py-4 border-t ${themeTokens.border} flex justify-end space-x-2 bg-black/5`}>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className={`px-4 py-2 border ${themeTokens.border} text-xs font-bold ${themeTokens.text} ${themeTokens.inputBg} rounded-xl cursor-pointer focus:outline-none`}
              >
                Cancel
              </button>
              <button
                onClick={applySettings}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl cursor-pointer focus:outline-none shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
