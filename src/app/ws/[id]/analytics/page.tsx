"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useP2PSync } from "../../../../utils/p2pSync";
import { themeMap, GlobalThemeMode } from "../../../../utils/appTheme";
import { ThemeSettings } from "../../../../utils/codeGenerators";
import {
  ArrowLeft,
  Search,
  Download,
  Calendar,
  Layers,
  Inbox,
  BarChart3,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Trash2,
  AlertCircle,
  X,
  FileText,
  Check,
  Copy,
  Code,
  Globe
} from "lucide-react";

interface AnalyticsPageProps {
  params: Promise<{ id: string }>;
}

interface SubmissionEntry {
  id: string;
  timestamp: string;
  ip?: string;
  data: Record<string, any>;
}

const defaultTheme: ThemeSettings = {
  primaryColor: "indigo",
  borderRadius: "md",
  layout: "1-col",
  shadow: "md"
};

export default function AnalyticsDashboardPage({ params }: AnalyticsPageProps) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.id;
  const router = useRouter();

  // Storage keys for guest cache
  const cacheSchemaKey = `formify_guest_schema_${workspaceId}`;
  const cacheThemeKey = `formify_guest_theme_${workspaceId}`;
  const cacheFontKey = `formify_guest_font_fam_${workspaceId}`;
  const cacheScaleKey = `formify_guest_font_scale_${workspaceId}`;
  const cacheGlobalThemeKey = `formify_guest_global_theme_${workspaceId}`;
  const cacheSubmissionsKey = `formify_guest_submissions_${workspaceId}`;

  // Local state initialized from cache or defaults
  const [schema, setSchema] = useState<any>(null);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultTheme);
  const [fontFamily, setFontFamily] = useState<"sans" | "mono" | "serif">("sans");
  const [fontScale, setFontScale] = useState<number>(1.0);
  const [globalTheme, setGlobalTheme] = useState<GlobalThemeMode>("light");
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeModalEntry, setActiveModalEntry] = useState<SubmissionEntry | null>(null);
  const [modalTab, setModalTab] = useState<"structured" | "json">("structured");
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

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

      const cachedSubmissions = localStorage.getItem(cacheSubmissionsKey);
      if (cachedSubmissions) setSubmissions(JSON.parse(cachedSubmissions));
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
    disconnect
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
      if (remoteState.submissions) {
        setSubmissions(remoteState.submissions);
        localStorage.setItem(cacheSubmissionsKey, JSON.stringify(remoteState.submissions));
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

  // Filter Submissions
  const filteredSubmissions = submissions.filter((entry) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      entry.id.toLowerCase().includes(term) ||
      Object.entries(entry.data).some(
        ([key, val]) =>
          key.toLowerCase().includes(term) ||
          String(val).toLowerCase().includes(term)
      )
    );
  });

  // Calculate stats for options fields
  const getFieldStats = (field: any) => {
    if (field.type !== "select" && field.type !== "radio" && field.type !== "checkbox") return null;

    const counts: Record<string, number> = {};
    let answeredCount = 0;

    if (field.type === "checkbox") {
      counts["Checked"] = 0;
      counts["Unchecked"] = 0;
      submissions.forEach((sub) => {
        const val = sub.data[field.id];
        if (val === true || val === "true") {
          counts["Checked"]++;
          answeredCount++;
        } else {
          counts["Unchecked"]++;
          answeredCount++;
        }
      });
    } else {
      const options = field.options || [];
      options.forEach((opt: any) => {
        counts[opt.label || opt.value] = 0;
      });

      submissions.forEach((sub) => {
        const val = sub.data[field.id];
        if (val !== undefined && val !== null && val !== "") {
          const matchedOpt = options.find((opt: any) => opt.value === val);
          const keyName = matchedOpt ? (matchedOpt.label || matchedOpt.value) : String(val);
          counts[keyName] = (counts[keyName] || 0) + 1;
          answeredCount++;
        }
      });
    }

    return { counts, answeredCount };
  };

  // Export CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const allKeys = Array.from(new Set(submissions.flatMap((e) => Object.keys(e.data))));
    const headers = ["Submission ID", "Timestamp", "IP Address", ...allKeys];
    const csvRows = [
      headers.join(","),
      ...submissions.map((entry) => [
        entry.id,
        entry.timestamp,
        entry.ip || "N/A",
        ...allKeys.map((k) => `"${String(entry.data[k] === undefined ? "" : entry.data[k]).replace(/"/g, '""')}"`)
      ].join(","))
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics_submissions_${workspaceId}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON
  const handleExportJSON = () => {
    if (submissions.length === 0) return;
    const blob = new Blob([JSON.stringify(submissions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics_submissions_${workspaceId}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Submissions Timeline Activity
  const getTimelineData = () => {
    const dates: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      dates[dateStr] = 0;
    }

    submissions.forEach((sub) => {
      try {
        const dateStr = new Date(sub.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
        if (dates[dateStr] !== undefined) {
          dates[dateStr]++;
        }
      } catch (e) {
        // ignore
      }
    });

    return Object.entries(dates).map(([date, count]) => ({ date, count }));
  };

  const timelineData = getTimelineData();
  const maxTimelineCount = Math.max(...timelineData.map((d) => d.count), 1);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${themeTokens.bg} ${fontFamClass}`}>
      {/* Top Status Banner */}
      <div className="flex-shrink-0 z-20">
        {p2pStatus === "connecting" && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/25 px-4 py-2 text-center text-xs font-semibold text-yellow-600 dark:text-yellow-400 flex items-center justify-center space-x-2 animate-pulse">
            <div className="h-3.5 w-3.5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            <span>Connecting to load real-time form analytics...</span>
          </div>
        )}
        {p2pStatus === "disconnected" && (
          <div className="bg-red-500/10 border-b border-red-500/25 px-4 py-2.5 text-center text-xs font-semibold text-red-600 dark:text-red-400 flex items-center justify-center space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Workspace offline. Displaying cached dashboard data. Connect host to load live records.</span>
          </div>
        )}
        {p2pStatus === "joined" && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/25 px-4 py-1.5 text-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center space-x-1.5 animate-fade-in">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Connected to Host. Submissions syncing in real-time.</span>
          </div>
        )}
      </div>

      {/* Top Navigation Bar */}
      <header className={`flex-shrink-0 border-b px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm z-10 ${themeTokens.header}`}>
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
            <BarChart3 className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className={`text-xs sm:text-sm font-bold truncate ${themeTokens.text}`}>
              {schema?.formTitle || "Untitled Form"} &bull; Analytics Dashboard
            </h1>
            <p className={`text-[10px] ${themeTokens.textSecondary} truncate max-w-[200px] xs:max-w-sm`}>
              decentralized serverless dashboard for room: {workspaceId}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => window.open(`/ws/${workspaceId}/share`, "_blank")}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 border border-blue-100 dark:border-blue-900/50 rounded-xl text-[10px] sm:text-xs font-bold cursor-pointer transition-colors"
        >
          <span>Open Live Form</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Main dashboard body */}
      <main className="flex-grow p-4 sm:p-6 space-y-6 max-w-6xl w-full mx-auto overflow-y-auto">
        {/* KPI stats section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Submissions */}
          <div className={`p-4 rounded-xl border ${themeTokens.border} ${themeTokens.card} flex items-center justify-between`}>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>Total Responses</span>
              <h2 className={`text-2xl font-extrabold mt-1 ${themeTokens.text}`}>{submissions.length}</h2>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <Inbox className="h-6 w-6" />
            </div>
          </div>

          {/* Card 2: Form Fields */}
          <div className={`p-4 rounded-xl border ${themeTokens.border} ${themeTokens.card} flex items-center justify-between`}>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>Form Input Fields</span>
              <h2 className={`text-2xl font-extrabold mt-1 ${themeTokens.text}`}>{schema?.fields?.length || 0}</h2>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
              <Layers className="h-6 w-6" />
            </div>
          </div>

          {/* Card 3: Latest Entry */}
          <div className={`p-4 rounded-xl border ${themeTokens.border} ${themeTokens.card} flex items-center justify-between`}>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>Latest Submission</span>
              <h2 className={`text-xs font-mono font-bold mt-2.5 truncate max-w-[200px] ${themeTokens.text}`}>
                {submissions.length > 0
                  ? new Date(submissions[0].timestamp).toLocaleString()
                  : "No submissions yet"}
              </h2>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Timeline Activity Chart */}
        {submissions.length > 0 && (
          <div className={`p-5 rounded-xl border ${themeTokens.border} ${themeTokens.card} shadow-sm space-y-4`}>
            <div>
              <h3 className={`font-bold text-xs uppercase tracking-wider ${themeTokens.textSecondary} flex items-center space-x-1.5`}>
                <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
                <span>Daily Submission Frequency (Last 7 Days)</span>
              </h3>
              <p className={`text-[11px] ${themeTokens.textSecondary}`}>Count of incoming response logs per day</p>
            </div>

            <div className="h-40 w-full flex items-end justify-between pt-4 pb-2 px-2 border-b border-gray-200 dark:border-gray-800">
              {timelineData.map((d) => {
                const heightPercent = (d.count / maxTimelineCount) * 80;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center group relative mx-2">
                    <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none font-semibold shadow z-10">
                      {d.count} responses
                    </div>
                    
                    <div 
                      style={{ height: `${Math.max(heightPercent, 4)}%` }} 
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        d.count > 0 
                          ? "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 shadow-sm" 
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                    
                    <span className={`text-[9px] font-bold mt-2 truncate max-w-full ${themeTokens.textSecondary}`}>
                      {d.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Charts & Distribution lists */}
        {schema && schema.fields && schema.fields.length > 0 && submissions.length > 0 && (
          <div className="space-y-4">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${themeTokens.textSecondary} flex items-center space-x-1.5`}>
              <BarChart3 className="h-4.5 w-4.5 text-blue-500" />
              <span>Response Choice Distributions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schema.fields.map((field: any) => {
                const stats = getFieldStats(field);
                if (!stats) return null;

                const { counts, answeredCount } = stats;

                return (
                  <div key={field.id} className={`p-5 rounded-xl border ${themeTokens.border} ${themeTokens.card} space-y-3.5 shadow-sm`}>
                    <div className="flex justify-between items-start">
                      <div className="truncate pr-4">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary}`}>
                          {field.type}
                        </span>
                        <h4 className={`font-semibold text-sm mt-1 truncate ${themeTokens.text}`} title={field.label}>
                          {field.label}
                        </h4>
                      </div>
                      <span className={`text-xs font-semibold flex-shrink-0 ${themeTokens.textSecondary}`}>
                        {answeredCount} responses
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {Object.entries(counts).map(([label, count]) => {
                        const percent = answeredCount > 0 ? Math.round((count / submissions.length) * 100) : 0;
                        return (
                          <div key={label} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className={themeTokens.text}>{label}</span>
                              <span className={themeTokens.textSecondary}>{count} ({percent}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${percent}%` }}
                                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search, Filter & CSV list container */}
        <div className={`p-5 rounded-xl border ${themeTokens.border} ${themeTokens.card} flex flex-col space-y-4 shadow-sm`}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className={`font-bold text-sm ${themeTokens.text}`}>Submissions Log Grid</h3>
              <p className={`text-xs ${themeTokens.textSecondary}`}>Search and export raw data entries</p>
            </div>
            
            <div className="flex space-x-2">
              <button onClick={handleExportCSV} disabled={submissions.length === 0} className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 shadow-sm focus:outline-none">
                <Download className="h-3.5 w-3.5" />
                <span>CSV</span>
              </button>
              <button onClick={handleExportJSON} disabled={submissions.length === 0} className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 shadow-sm focus:outline-none">
                <Download className="h-3.5 w-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by details or IDs..."
              className={`w-full pl-9 pr-4 py-2 border ${themeTokens.border} rounded-xl text-xs ${themeTokens.inputBg} ${themeTokens.inputText} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
          </div>

          {/* Table */}
          <div className={`border ${themeTokens.border} rounded-xl overflow-hidden overflow-x-auto`}>
            <table className="w-full text-xs text-left">
              <thead className={`${themeTokens.tableHead} font-bold border-b ${themeTokens.border}`}>
                <tr>
                  <th className="p-3">Submission ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Client IP</th>
                  <th className="p-3">Details Summary</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={`p-8 text-center ${themeTokens.textSecondary}`}>
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((entry) => {
                    const dataSummary = Object.entries(entry.data)
                      .slice(0, 3)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ");
                    return (
                      <tr key={entry.id} className={`${themeTokens.tableRowHover} transition-colors duration-150`}>
                        <td className={`p-3 font-mono font-bold ${themeTokens.text}`}>{entry.id}</td>
                        <td className={`p-3 ${themeTokens.textSecondary}`}>{new Date(entry.timestamp).toLocaleString()}</td>
                        <td className={`p-3 font-mono ${themeTokens.textSecondary}`}>{entry.ip || "N/A"}</td>
                        <td className={`p-3 truncate max-w-xs ${themeTokens.textSecondary}`}>{dataSummary}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setActiveModalEntry(entry)}
                            className="text-blue-500 hover:text-blue-600 font-bold hover:underline cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Raw Entry Dialog Modal */}
      {activeModalEntry && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalEntry(null);
          }}
          className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in"
        >
          <div className={`rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border ${themeTokens.border} ${themeTokens.card} animate-scale-up`}>
            <div className={`px-6 py-4.5 border-b ${themeTokens.border} flex justify-between items-center bg-black/5`}>
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm leading-tight ${themeTokens.text}`}>Submission Record</h4>
                  <span className="text-[10px] font-mono font-bold text-slate-400">ID: {activeModalEntry.id}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalEntry(null)}
                className={`p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none`}
                title="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Sub-Header Tab Switcher */}
            <div className={`px-6 pt-3 flex border-b bg-black/[0.02] dark:bg-white/[0.01] ${themeTokens.border}`}>
              <button
                onClick={() => setModalTab("structured")}
                className={`flex items-center space-x-1.5 pb-3 px-4 text-xs font-bold border-b-2 transition-all focus:outline-none ${
                  modalTab === "structured"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Structured Fields</span>
              </button>
              <button
                onClick={() => setModalTab("json")}
                className={`flex items-center space-x-1.5 pb-3 px-4 text-xs font-bold border-b-2 transition-all focus:outline-none ${
                  modalTab === "json"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Code className="h-3.5 w-3.5" />
                <span>Raw JSON</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Info grid */}
              <div className={`grid grid-cols-3 gap-4 pb-4 border-b ${themeTokens.border}`}>
                <div className={`p-3 rounded-xl border ${themeTokens.border} ${themeTokens.inputBg} flex items-center space-x-3 shadow-sm`}>
                  <Calendar className="h-4.5 w-4.5 text-blue-500 flex-shrink-0" />
                  <div>
                    <span className={`block text-[9px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>Date Logged</span>
                    <span className={`text-xs font-semibold ${themeTokens.text}`}>
                      {new Date(activeModalEntry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl border ${themeTokens.border} ${themeTokens.inputBg} flex items-center space-x-3 shadow-sm`}>
                  <Clock className="h-4.5 w-4.5 text-indigo-500 flex-shrink-0" />
                  <div>
                    <span className={`block text-[9px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>Time Logged</span>
                    <span className={`text-xs font-semibold ${themeTokens.text}`}>
                      {new Date(activeModalEntry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl border ${themeTokens.border} ${themeTokens.inputBg} flex items-center space-x-3 shadow-sm`}>
                  <Globe className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                  <div>
                    <span className={`block text-[9px] font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>Client IP</span>
                    <span className={`text-xs font-semibold ${themeTokens.text}`}>
                      {activeModalEntry.ip || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {modalTab === "structured" ? (
                <div className="space-y-3">
                  {Object.entries(activeModalEntry.data).map(([k, v]) => {
                    const isBool = typeof v === "boolean";
                    return (
                      <div key={k} className={`p-3.5 rounded-xl border ${themeTokens.border} ${themeTokens.inputBg} flex items-start justify-between gap-4 transition-all hover:bg-black/[0.01] dark:hover:bg-white/[0.01]`}>
                        <div className="min-w-0">
                          <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-500/5 px-2 py-0.5 rounded-md border border-slate-500/10 mb-1.5">
                            {k}
                          </span>
                          <span className={`block text-xs font-medium break-all ${themeTokens.text}`}>
                            {isBool 
                              ? (v ? "Checked / Yes" : "Unchecked / No") 
                              : typeof v === "object" && v !== null
                                ? JSON.stringify(v)
                                : String(v)
                            }
                          </span>
                        </div>
                        {isBool && (
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                            v 
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${v ? "bg-emerald-500" : "bg-red-500"}`} />
                            <span>{v ? "True" : "False"}</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="relative group">
                  <pre className={`rounded-xl p-4 font-mono text-[11px] overflow-auto max-h-72 border ${themeTokens.border} ${themeTokens.codeBg} leading-relaxed`}>
                    {JSON.stringify(activeModalEntry.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className={`px-6 py-4 border-t ${themeTokens.border} flex justify-between items-center bg-black/5`}>
              <button
                onClick={() => copyToClipboard(JSON.stringify(activeModalEntry.data, null, 2))}
                className={`px-4 py-2 border ${themeTokens.border} text-xs font-bold ${themeTokens.text} ${themeTokens.inputBg} rounded-xl cursor-pointer flex items-center space-x-1.5 hover:bg-black/5 focus:outline-none transition-all shadow-sm`}
              >
                {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-gray-500" />}
                <span>{isCopied ? "Copied JSON!" : "Copy JSON"}</span>
              </button>
              <button
                onClick={() => setActiveModalEntry(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl cursor-pointer focus:outline-none shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
