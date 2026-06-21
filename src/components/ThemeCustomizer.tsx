import React from "react";
import { ThemeSettings } from "../utils/codeGenerators";
import { GlobalThemeMode, AppThemeTokens } from "../utils/appTheme";
import { Sun, Moon, Terminal, Sparkles, Briefcase } from "lucide-react";

interface ThemeCustomizerProps {
  settings: ThemeSettings;
  themeTokens: AppThemeTokens;
  globalTheme: GlobalThemeMode;
  onChange: (updatedSettings: ThemeSettings) => void;
  onGlobalThemeChange: (mode: GlobalThemeMode) => void;
  readOnly?: boolean;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  settings,
  themeTokens,
  globalTheme,
  onChange,
  onGlobalThemeChange,
  readOnly = false
}) => {
  const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    if (readOnly) return;
    onChange({
      ...settings,
      [key]: value
    });
  };

  const colors = [
    { id: "indigo", name: "Indigo Focus", class: "bg-indigo-600" },
    { id: "blue", name: "Tech Blue", class: "bg-blue-600" },
    { id: "emerald", name: "Forest Emerald", class: "bg-emerald-600" },
    { id: "violet", name: "Royal Violet", class: "bg-violet-600" },
    { id: "rose", name: "Warm Rose", class: "bg-rose-600" },
    { id: "amber", name: "Sun Amber", class: "bg-amber-500" },
    { id: "slate", name: "Steel Slate", class: "bg-slate-700" }
  ];

  const radii = [
    { id: "none", name: "Sharp" },
    { id: "sm", name: "Small" },
    { id: "md", name: "Medium" },
    { id: "lg", name: "Large" },
    { id: "full", name: "Pill/Organic" }
  ];

  const shadows = [
    { id: "none", name: "Flat" },
    { id: "sm", name: "Light" },
    { id: "md", name: "Balanced" },
    { id: "lg", name: "Glow/Heavy" }
  ];

  const globalThemes = [
    { id: "light", name: "Standard Light", desc: "Default crisp workspace", icon: Sun },
    { id: "dark", name: "Developer Dark", desc: "Sleek low-light coder mode", icon: Moon },
    { id: "matrix", name: "Matrix Green", desc: "Matrix terminal style digital theme", icon: Terminal },
    { id: "midnight", name: "Midnight Navy", desc: "Deep dark blue midnight vibe", icon: Sparkles },
    { id: "corporate", name: "Corporate Gray", desc: "Professional gray styling preset", icon: Briefcase }
  ];

  const cardStyle = `p-4 rounded-xl border ${themeTokens.border} ${themeTokens.card} shadow-sm space-y-3`;
  const labelStyle = `text-sm font-semibold block ${themeTokens.text}`;

  return (
    <div className={`p-6 space-y-6 h-full overflow-y-auto ${themeTokens.sidebar}`}>
      <div>
        <h3 className={`text-lg font-bold ${themeTokens.text} flex items-center`}>
          Theme & Style Customizer
          {readOnly && <span className="text-xs px-2 py-0.5 ml-2 border border-amber-500/25 bg-amber-500/10 text-amber-500 rounded-md font-mono">View Only</span>}
        </h3>
        <p className={`text-xs mt-0.5 ${themeTokens.textSecondary}`}>
          {readOnly ? "View form styles and layouts in read-only mode." : "Configure the workspace visual theme mode and dynamic form styling variables."}
        </p>
      </div>

      {/* Form Accent Color Palette */}
      <div className={cardStyle}>
        <label className={labelStyle}>Form Primary Accent Color</label>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => updateSetting("primaryColor", c.id)}
              disabled={readOnly}
              className={`flex items-center space-x-2.5 p-2 rounded-lg border text-left text-xs font-medium transition-all focus:outline-none ${
                settings.primaryColor === c.id
                  ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-sm"
                  : `${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary} hover:border-gray-400 dark:hover:border-gray-600`
              } ${readOnly ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span className={`h-4.5 w-4.5 rounded-full ${c.class} shadow-inner flex-shrink-0`} />
              <span className="truncate">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout Selection */}
      <div className={cardStyle}>
        <label className={labelStyle}>Form Field Grid Layout</label>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => updateSetting("layout", "1-col")}
            disabled={readOnly}
            className={`p-3 rounded-lg border flex flex-col items-center justify-center space-y-1.5 transition-all text-xs font-semibold focus:outline-none ${
              settings.layout === "1-col"
                ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-sm"
                : `${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary} hover:border-gray-400 dark:hover:border-gray-600`
            } ${readOnly ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="w-10 h-6.5 bg-gray-100 dark:bg-gray-800 rounded border border-dashed border-gray-300 dark:border-gray-700 flex flex-col justify-between p-1 space-y-0.5">
              <div className="w-full h-1 bg-gray-400 dark:bg-gray-600 rounded-sm" />
              <div className="w-full h-1 bg-gray-400 dark:bg-gray-600 rounded-sm" />
              <div className="w-full h-1 bg-gray-400 dark:bg-gray-600 rounded-sm" />
            </div>
            <span>Single Column</span>
          </button>

          <button
            onClick={() => updateSetting("layout", "2-col")}
            disabled={readOnly}
            className={`p-3 rounded-lg border flex flex-col items-center justify-center space-y-1.5 transition-all text-xs font-semibold focus:outline-none ${
              settings.layout === "2-col"
                ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-sm"
                : `${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary} hover:border-gray-400 dark:hover:border-gray-600`
            } ${readOnly ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="w-10 h-6.5 bg-gray-100 dark:bg-gray-800 rounded border border-dashed border-gray-300 dark:border-gray-700 flex flex-wrap justify-between p-1 content-between">
              <div className="w-4 h-1 bg-gray-400 dark:bg-gray-600 rounded-sm" />
              <div className="w-4 h-1 bg-gray-400 dark:bg-gray-600 rounded-sm" />
              <div className="w-4 h-1 bg-gray-400 dark:bg-gray-600 rounded-sm" />
              <div className="w-4 h-1 bg-gray-400 dark:bg-gray-600 rounded-sm" />
            </div>
            <span>Double Column</span>
          </button>
        </div>
      </div>

      {/* Border Corners */}
      <div className={cardStyle}>
        <label className={labelStyle}>Form Border Radius (Corners)</label>
        <div className="flex flex-wrap gap-2 pt-1">
          {radii.map((r) => (
            <button
              key={r.id}
              onClick={() => updateSetting("borderRadius", r.id)}
              disabled={readOnly}
              className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-all focus:outline-none ${
                settings.borderRadius === r.id
                  ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-sm"
                  : `${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary} hover:border-gray-400 dark:hover:border-gray-600`
              } ${readOnly ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Shadows Selection */}
      <div className={cardStyle}>
        <label className={labelStyle}>Form Box Shadow Density</label>
        <div className="flex flex-wrap gap-2 pt-1">
          {shadows.map((s) => (
            <button
              key={s.id}
              onClick={() => updateSetting("shadow", s.id)}
              disabled={readOnly}
              className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-all focus:outline-none ${
                settings.shadow === s.id
                  ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-sm"
                  : `${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.textSecondary} hover:border-gray-400 dark:hover:border-gray-600`
              } ${readOnly ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
