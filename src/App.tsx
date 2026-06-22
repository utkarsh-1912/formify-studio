import React, { useState, useEffect, useMemo } from "react";
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
  Users,
  Send,
  LogOut,
  AlertCircle,
  MoreVertical,
  Lock,
  Unlock,
  ExternalLink,
  Copy,
  BarChart3
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
  const [shareFillMode, setShareFillMode] = useState<"multi" | "single">("multi");
  const [justPushed, setJustPushed] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<"editor" | "preview">("editor");

  // Security Auth States
  const [hasEditPermission, setHasEditPermission] = useState(true);
  const [workspaceToken, setWorkspaceToken] = useState<string>("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [showSwitchBanner, setShowSwitchBanner] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // Combine workspace states into a single memoized state object for P2P Sync
  const p2pState = useMemo(() => ({
    schema,
    theme: themeSettings,
    fontFamily,
    fontScale,
    globalTheme,
    submissions
  }), [schema, themeSettings, fontFamily, fontScale, globalTheme, submissions]);

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
    p2pState,
    (remoteState) => {
      if (remoteState.schema) {
        setSchema(remoteState.schema);
        setJsonSchema(JSON.stringify(remoteState.schema, null, 2));
        try {
          validateSchema(remoteState.schema);
          setError(null);
        } catch (e) {
          setError((e as Error).message);
        }
      }
      if (remoteState.theme) {
        setThemeSettings(remoteState.theme);
        localStorage.setItem(themeStorageKey, JSON.stringify(remoteState.theme));
      }
      if (remoteState.fontFamily) {
        setFontFamily(remoteState.fontFamily);
        localStorage.setItem(fontFamStorageKey, remoteState.fontFamily);
      }
      if (remoteState.fontScale) {
        setFontScale(remoteState.fontScale);
        localStorage.setItem(fontScaleStorageKey, remoteState.fontScale.toString());
      }
      if (remoteState.globalTheme) {
        setGlobalTheme(remoteState.globalTheme);
        localStorage.setItem(globalThemeStorageKey, remoteState.globalTheme);
      }
      if (remoteState.submissions) {
        setSubmissions(remoteState.submissions);
        localStorage.setItem(submissionsStorageKey, JSON.stringify(remoteState.submissions));
      }
    },
    (remoteSubmission) => {
      const newEntry: SubmissionEntry = {
        id: remoteSubmission.id || "sub_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        timestamp: remoteSubmission.timestamp || new Date().toISOString(),
        data: remoteSubmission.data || remoteSubmission
      };
      setSubmissions((prev) => {
        const updated = [newEntry, ...prev];
        localStorage.setItem(submissionsStorageKey, JSON.stringify(updated));
        return updated;
      });
    }
  );

  const handlePushP2P = () => {
    pushP2P();
    setJustPushed(true);
    setTimeout(() => setJustPushed(false), 2000);
  };

  // Load submissions, theme, and schema on load
  useEffect(() => {
    // 0. Workspace Security Token Check
    const tokenKey = `formify_edit_token_${workspaceId || "default"}`;
    const storedToken = localStorage.getItem(tokenKey);

    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    let finalToken = storedToken || "";
    let hasEdit = false;

    if (urlToken) {
      // Token provided in URL query! Store it and unlock edit permission.
      localStorage.setItem(tokenKey, urlToken);
      finalToken = urlToken;
      hasEdit = true;
      setShowSwitchBanner(false);
    } else if (storedToken) {
      // Owner visiting without the token query in URL: Place in read-only preview mode, but show Switch banner
      hasEdit = false;
      setShowSwitchBanner(true);
    } else {
      // Guest visiting a view-only URL: strictly read-only, hide Switch banner
      hasEdit = false;
      setShowSwitchBanner(false);
      finalToken = "";
    }

    setWorkspaceToken(finalToken);
    setHasEditPermission(hasEdit);

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

  // Global Text Resizing Scale Effect
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [fontScale]);

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
      ip: "Local Preview",
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
      const shareUrl = `${window.location.origin}/ws/${workspaceId || "default"}/share`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      });
    } catch (e) {
      alert("Failed to generate share link.");
    }
  };

  const handleSwitchToEditMode = () => {
    const tokenKey = `formify_edit_token_${workspaceId || "default"}`;
    const storedToken = localStorage.getItem(tokenKey);
    if (storedToken) {
      const newUrl = `${window.location.pathname}?token=${storedToken}`;
      window.location.href = newUrl;
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
      {showSwitchBanner && (
        <div className="flex-shrink-0 bg-blue-600 text-white text-xs px-4 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between shadow-md z-30 animate-fade-in font-semibold">
          <span className="flex items-center space-x-1.5 font-sans">
            <Lock className="h-3.5 w-3.5 text-blue-200" />
            <span>You own this workspace. You are currently viewing in <strong>View-Only Mode</strong>.</span>
          </span>
          <button
            onClick={handleSwitchToEditMode}
            className="bg-white text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors font-bold cursor-pointer text-[10px] sm:text-xs"
          >
            Switch to Edit Mode
          </button>
        </div>
      )}
      {!hasEditPermission && !showSwitchBanner && (
        <div className="flex-shrink-0 bg-slate-800 text-white text-xs px-4 py-2 sm:px-6 sm:py-2.5 flex items-center shadow-md z-30 animate-fade-in font-semibold">
          <span className="flex items-center space-x-1.5 font-sans">
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            <span>Viewing in <strong>View-Only Mode</strong>. You cannot edit this workspace.</span>
          </span>
        </div>
      )}
      {/* Header toolbar */}
      <header className={`flex-shrink-0 border-b px-3 py-2 sm:px-6 sm:py-3 flex items-center justify-between shadow-sm z-20 ${themeTokens.header}`}>
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <button
            onClick={() => router.push("/")}
            className={`p-1 sm:p-1.5 rounded-lg border ${themeTokens.border} hover:bg-black/5 cursor-pointer focus:outline-none text-gray-500 flex-shrink-0`}
            title="Return to Home Screen"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3.5 min-w-0">
            <img src="/logo.png" alt="Formify Logo" className="h-6 sm:h-8 flex-shrink-0" />
            <span className={`hidden xs:inline-block text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary} flex-shrink-0`}>
              v{APP_VERSION}
            </span>
            {/* Inline Editable Room Name */}
            <input
              type="text"
              value={roomName}
              onChange={handleRoomNameChange}
              readOnly={!hasEditPermission}
              className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-transparent hover:bg-black/5 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-lg text-xs sm:text-sm font-semibold focus:outline-none transition-all max-w-[70px] xs:max-w-[110px] sm:max-w-xs truncate ${themeTokens.inputText} ${!hasEditPermission ? "cursor-not-allowed opacity-75" : ""}`}
              title={hasEditPermission ? "Click to rename workspace" : "Workspace Name (Read-Only)"}
            />
            {hasEditPermission ? (
              isWorkspaceInitialized ? (
                <span 
                  className="p-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm"
                  title="Workspace Saved in LocalStorage"
                >
                  <Check className="h-4 w-4" />
                </span>
              ) : (
                <button
                  onClick={() => {
                    localStorage.setItem(schemaStorageKey, JSON.stringify(schema));
                    setIsWorkspaceInitialized(true);
                  }}
                  className="p-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/25 rounded-lg flex-shrink-0 cursor-pointer animate-pulse focus:outline-none flex items-center justify-center shadow-sm"
                  title="Workspace not initialized in LocalStorage. Click to save."
                >
                  <AlertCircle className="h-4 w-4" />
                </button>
              )
            ) : (
              <span 
                className="p-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/25 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm"
                title="View-Only Mode Active"
              >
                <Lock className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>

        {/* Global Toolbar Options */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
          {/* P2P Multiplayer Sync Status Badge */}
          <div className={`flex items-center space-x-1.5 px-2 py-1.5 border ${themeTokens.border} ${themeTokens.inputBg} rounded-xl text-xs font-bold shadow-sm`}>
            {p2pStatus === "disconnected" && (
              <button
                onClick={initPeerJS}
                className="flex items-center text-gray-500 hover:text-blue-500 cursor-pointer focus:outline-none"
                title="Go Live (Enable multiplayer sync)"
              >
                <Radio className="h-4 w-4 animate-pulse" />
              </button>
            )}
            {p2pStatus === "connecting" && (
              <span className="flex items-center text-yellow-600 dark:text-yellow-400" title="Connecting to signaling server...">
                <div className="h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              </span>
            )}
            {(p2pStatus === "hosting" || p2pStatus === "joined") && (
              <div className="flex items-center space-x-2">
                <span 
                  className="flex items-center text-emerald-600 dark:text-emerald-400" 
                  title={`Multiplayer Active (${p2pStatus === "hosting" ? "Hosting Workspace" : "Joined Workspace"})`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </span>
                
                {connectedPeers.length > 0 && (
                  <span className="inline-flex items-center text-[10px] text-gray-500 font-mono" title={`${connectedPeers.length} active peer(s)`}>
                    <Users className="h-3.5 w-3.5 mr-0.5" />
                    <span>{connectedPeers.length}</span>
                  </span>
                )}

                <button
                  onClick={handlePushP2P}
                  disabled={justPushed}
                  className={`p-1 rounded transition-all cursor-pointer focus:outline-none flex items-center justify-center ${
                    justPushed
                      ? "bg-emerald-500 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  }`}
                  title="Push local changes to all connected peers"
                >
                  {justPushed ? <Check className="h-3 w-3" /> : <Send className="h-3 w-3" />}
                </button>

                <button
                  onClick={disconnectP2P}
                  className="p-1 text-red-500 hover:text-red-600 dark:hover:text-red-400 cursor-pointer focus:outline-none flex items-center"
                  title="Disconnect multiplayer sync"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {p2pStatus === "error" && (
              <span className="text-red-600 dark:text-red-400 font-extrabold text-[10px] flex items-center space-x-1" title="P2P Offline">
                <AlertCircle className="h-4 w-4" />
                <button onClick={initPeerJS} className="underline text-blue-500 focus:outline-none">Retry</button>
              </span>
            )}
          </div>

          {/* Settings gear icon */}
          {hasEditPermission && (
            <button
              onClick={openSettings}
              className={`p-1.5 rounded-xl border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary} hover:${themeTokens.text} cursor-pointer focus:outline-none transition-all shadow-sm flex-shrink-0`}
              title="Open Workspace Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}

          {/* 3-Dot Options Dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
              className={`p-1.5 rounded-xl border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary} hover:${themeTokens.text} cursor-pointer focus:outline-none transition-all shadow-sm flex items-center justify-center`}
              title="More Actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {isHeaderMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30 cursor-default" 
                  onClick={() => setIsHeaderMenuOpen(false)}
                />
                
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden z-40 animate-scale-up ${themeTokens.modalBg} ${themeTokens.border}`}>
                  <div className="py-1.5">
                    {hasEditPermission && (
                      <>
                        <button
                          onClick={() => {
                            setIsShareModalOpen(true);
                            setIsHeaderMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center space-x-2 hover:bg-black/5 transition-colors cursor-pointer ${themeTokens.text}`}
                        >
                          <Share2 className="h-3.5 w-3.5 text-blue-500" />
                          <span>Share & Embed</span>
                        </button>
                        <hr className={`my-1.5 border-t ${themeTokens.border}`} />
                      </>
                    )}

                    <a
                      href={`/ws/${workspaceId || "default"}/share`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center space-x-2 hover:bg-black/5 transition-colors cursor-pointer block ${themeTokens.text}`}
                      onClick={() => setIsHeaderMenuOpen(false)}
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Open Live Form</span>
                    </a>

                    <a
                      href={`/ws/${workspaceId || "default"}/analytics`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center space-x-2 hover:bg-black/5 transition-colors cursor-pointer block ${themeTokens.text}`}
                      onClick={() => setIsHeaderMenuOpen(false)}
                    >
                      <BarChart3 className="h-3.5 w-3.5 text-purple-500" />
                      <span>Open Analytics</span>
                    </a>

                    <a
                      href={`/ws/${workspaceId || "default"}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center space-x-2 hover:bg-black/5 transition-colors cursor-pointer block ${themeTokens.text}`}
                      onClick={() => setIsHeaderMenuOpen(false)}
                    >
                      <Code className="h-3.5 w-3.5 text-amber-500" />
                      <span>Preview Embed</span>
                    </a>

                    {showSwitchBanner && (
                      <>
                        <hr className={`my-1.5 border-t ${themeTokens.border}`} />
                        <button
                          onClick={() => {
                            handleSwitchToEditMode();
                            setIsHeaderMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center space-x-2 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer ${themeTokens.text}`}
                        >
                          <Unlock className="h-3.5 w-3.5 text-blue-500" />
                          <span>Unlock Editing</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile View Toggle Bar */}
      <div className="flex-shrink-0 md:hidden flex border-b bg-black/5">
        <button
          onClick={() => setMobileActiveTab("editor")}
          className={`flex-1 py-2 text-center text-xs font-bold border-b-2 cursor-pointer focus:outline-none transition-all ${
            mobileActiveTab === "editor"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Design & Edit
        </button>
        <button
          onClick={() => setMobileActiveTab("preview")}
          className={`flex-1 py-2 text-center text-xs font-bold border-b-2 cursor-pointer focus:outline-none transition-all ${
            mobileActiveTab === "preview"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Preview & Logs
        </button>
      </div>

      {/* Main Container Dashboard */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Workspace (55%) */}
        <div className={`w-full md:w-[55%] flex flex-col border-r overflow-hidden ${themeTokens.sidebar} ${
          mobileActiveTab === "editor" ? "flex" : "hidden md:flex"
        }`}>
          {/* Tabs header */}
          <div className={`flex-shrink-0 flex border-b bg-black/5 px-4 pt-2 overflow-x-auto whitespace-nowrap scrollbar-none ${themeTokens.border}`}>
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
                  className={`flex-shrink-0 whitespace-nowrap ${tabBtnClass(tab.id, leftTab === tab.id)}`}
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
              <VisualBuilder schema={schema} themeTokens={themeTokens} onSchemaChange={handleVisualChange} readOnly={!hasEditPermission} />
            )}
            {leftTab === "json" && (
              <JsonEditor value={jsonSchema} themeTokens={themeTokens} onChange={handleJsonChange} error={error} readOnly={!hasEditPermission} />
            )}
            {leftTab === "theme" && (
              <ThemeCustomizer
                settings={themeSettings}
                themeTokens={themeTokens}
                globalTheme={globalTheme}
                onChange={handleThemeSettingsChange}
                onGlobalThemeChange={handleGlobalThemeChange}
                readOnly={!hasEditPermission}
              />
            )}
            {leftTab === "templates" && (
              <TemplatesGallery themeTokens={themeTokens} onSelectTemplate={handleLoadTemplate} readOnly={!hasEditPermission} />
            )}
          </div>
        </div>

        {/* Right Side: Form Render and Output Dashboard (45%) */}
        <div className={`w-full md:w-[45%] flex flex-col overflow-hidden ${
          mobileActiveTab === "preview" ? "flex" : "hidden md:flex"
        }`}>
          {/* Tabs header */}
          <div className={`flex-shrink-0 flex border-b bg-black/5 px-4 pt-2 overflow-x-auto whitespace-nowrap scrollbar-none ${themeTokens.border}`}>
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
                  className={`flex-shrink-0 whitespace-nowrap ${tabBtnClass(tab.id, rightTab === tab.id)}`}
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
      <footer className={`flex-shrink-0 border-t px-4 py-2 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-0 text-[10px] sm:text-[11px] text-center sm:text-left z-20 ${themeTokens.footer}`}>
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4 font-semibold">
          <span>
            Fields: <span className="font-bold opacity-85">{schema.fields?.length || 0}</span>
          </span>
          <span className="opacity-30">|</span>
          <span>
            Submissions: <span className="font-bold opacity-85">{submissions.length}</span>
          </span>
          {workspaceId && (
            <>
              <span className="opacity-30">|</span>
              <span className="text-blue-500 font-mono select-all">
                ID: {workspaceId}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="font-semibold hidden xs:inline">Validation:</span>
          {error ? (
            <span className="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded flex items-center space-x-1 animate-pulse border border-red-200/30">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              <span>Invalid Configuration</span>
            </span>
          ) : (
            <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded flex items-center space-x-1 border border-emerald-200/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Schema Valid</span>
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
                    { id: "corporate", name: "Corporate", color: "bg-slate-50 border-slate-300" }
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
                        <span className={`text-[9px] font-semibold mt-1 truncate w-full ${isStaged ? "text-blue-600 font-bold" : themeTokens.textSecondary}`}>
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

      {/* Share & Embed Modal Component */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className={`rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden border ${themeTokens.border} ${themeTokens.modalBg} animate-scale-up`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${themeTokens.border} flex justify-between items-center bg-black/5`}>
              <div>
                <h4 className={`text-sm font-bold flex items-center space-x-1.5 ${themeTokens.text}`}>
                  <Share2 className="h-4.5 w-4.5 text-blue-500" />
                  <span>Share & Embed Workspace</span>
                </h4>
                <p className={`text-[11px] ${themeTokens.textSecondary}`}>
                  Access workspace links, live client forms, embed codes, and analytics.
                </p>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className={`text-xs hover:opacity-85 transition-all font-semibold ${themeTokens.textSecondary}`}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Section 1: Client Submission Link */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>
                    Public Submission Form (For Clients)
                  </span>
                  {copiedField === "shareForm" && (
                    <span className="text-[10px] text-emerald-500 font-bold animate-scale-up">Copied!</span>
                  )}
                </div>

                {/* Fill Mode Segmented Toggle */}
                <div className="flex items-center space-x-2 bg-slate-500/5 p-1 rounded-lg border border-slate-500/10 w-fit mb-2">
                  <button
                    onClick={() => setShareFillMode("multi")}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                      shareFillMode === "multi"
                        ? "bg-blue-600 text-white shadow-sm"
                        : `${themeTokens.textSecondary} hover:opacity-80`
                    }`}
                  >
                    Multifill Link
                  </button>
                  <button
                    onClick={() => setShareFillMode("single")}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                      shareFillMode === "single"
                        ? "bg-blue-600 text-white shadow-sm"
                        : `${themeTokens.textSecondary} hover:opacity-80`
                    }`}
                  >
                    Single Fill Link
                  </button>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/ws/${workspaceId || "default"}/share?mode=${shareFillMode}`}
                    className={`flex-1 p-2 border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.inputText} rounded-xl text-xs focus:outline-none select-all`}
                  />
                  <button
                    onClick={() => handleCopyToClipboard(`${window.location.origin}/ws/${workspaceId || "default"}/share?mode=${shareFillMode}`, "shareForm")}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-sm"
                    title="Copy Form Link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className={`text-[10px] ${themeTokens.textSecondary}`}>
                  {shareFillMode === "multi"
                    ? "Allows clients to submit multiple responses. Renders a 'Fill Form Again' button upon completion."
                    : "Restricts clients to a single response per browser using localStorage. Prevents form refills."
                  }
                </p>
              </div>

              {/* Section 2: IFrame Embed Code */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>
                    IFrame Widget HTML Embed Code
                  </span>
                  {copiedField === "shareIframe" && (
                    <span className="text-[10px] text-emerald-500 font-bold animate-scale-up">Copied!</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <textarea
                    readOnly
                    rows={2}
                    value={`<iframe src="${window.location.origin}/ws/${workspaceId || "default"}/view?mode=${shareFillMode}" width="100%" height="600px" style="border:none;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.05);"></iframe>`}
                    className={`flex-1 p-2 border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.inputText} rounded-xl text-xs font-mono resize-none focus:outline-none select-all`}
                  />
                  <button
                    onClick={() => handleCopyToClipboard(`<iframe src="${window.location.origin}/ws/${workspaceId || "default"}/view?mode=${shareFillMode}" width="100%" height="600px" style="border:none;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.05);"></iframe>`, "shareIframe")}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-sm"
                    title="Copy Embed Code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className={`text-[10px] ${themeTokens.textSecondary}`}>
                  Embed this responsive form widget directly in your website or blog pages.
                </p>
              </div>

              {/* Section 3: Analytics Link */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>
                    Public Analytics Dashboard Link
                  </span>
                  {copiedField === "shareAnalytics" && (
                    <span className="text-[10px] text-emerald-500 font-bold animate-scale-up">Copied!</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/ws/${workspaceId || "default"}/analytics`}
                    className={`flex-1 p-2 border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.inputText} rounded-xl text-xs focus:outline-none select-all`}
                  />
                  <button
                    onClick={() => handleCopyToClipboard(`${window.location.origin}/ws/${workspaceId || "default"}/analytics`, "shareAnalytics")}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-sm"
                    title="Copy Analytics Link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className={`text-[10px] ${themeTokens.textSecondary}`}>
                  Share this read-only link to let others view submission metrics and charts.
                </p>
              </div>

              {/* Section 4: Collaborative Edit Link (Owner only check) */}
              {hasEditPermission && (
                <div className={`p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 space-y-2`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                      <Lock className="h-3.5 w-3.5" />
                      <span>Collaborative Edit Link (With Security Token)</span>
                    </span>
                    {copiedField === "shareEdit" && (
                      <span className="text-[10px] text-emerald-500 font-bold animate-scale-up">Copied!</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/ws/${workspaceId || "default"}?token=${workspaceToken}`}
                      className={`flex-1 p-2 border border-amber-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl text-xs focus:outline-none select-all`}
                    />
                    <button
                      onClick={() => handleCopyToClipboard(`${window.location.origin}/ws/${workspaceId || "default"}?token=${workspaceToken}`, "shareEdit")}
                      className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-sm"
                      title="Copy Edit Link"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-relaxed font-semibold">
                    ⚠️ WARNING: Share this only with trusted co-designers. Anyone with this link can modify form schema parameters and delete submissions.
                  </p>
                </div>
              )}

              {/* Section 5: View-Only Editor Link */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>
                    View-Only Studio Link (Without Token)
                  </span>
                  {copiedField === "shareViewOnly" && (
                    <span className="text-[10px] text-emerald-500 font-bold animate-scale-up">Copied!</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/ws/${workspaceId || "default"}`}
                    className={`flex-1 p-2 border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.inputText} rounded-xl text-xs focus:outline-none select-all`}
                  />
                  <button
                    onClick={() => handleCopyToClipboard(`${window.location.origin}/ws/${workspaceId || "default"}`, "shareViewOnly")}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-sm"
                    title="Copy View-Only Link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className={`text-[10px] ${themeTokens.textSecondary}`}>
                  Let clients view the builder design space in view-only layout mode without editing permissions.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t ${themeTokens.border} flex justify-end bg-black/5`}>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl cursor-pointer focus:outline-none shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
