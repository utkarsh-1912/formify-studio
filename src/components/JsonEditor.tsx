import React, { useState, useEffect } from "react";
import {
  Clipboard,
  Check,
  Download,
  Trash2,
  Code,
  Sparkles
} from "lucide-react";
import { AppThemeTokens } from "../utils/appTheme";

interface JsonEditorProps {
  value: string;
  themeTokens: AppThemeTokens;
  onChange: (value: string) => void;
  error: string | null;
  readOnly?: boolean;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ value, themeTokens, onChange, error, readOnly = false }) => {
  const [localValue, setLocalValue] = useState(value);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
  };

  const handleBlur = () => {
    if (!readOnly && localValue !== value) {
      onChange(localValue);
    }
  };

  const handlePrettify = () => {
    if (readOnly) return;
    try {
      const parsed = JSON.parse(localValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setLocalValue(formatted);
      onChange(formatted);
    } catch (e) {
      alert("Unable to prettify: invalid JSON syntax. Please resolve errors first.");
    }
  };

  const handleMinify = () => {
    if (readOnly) return;
    try {
      const parsed = JSON.parse(localValue);
      const minified = JSON.stringify(parsed);
      setLocalValue(minified);
      onChange(minified);
    } catch (e) {
      alert("Unable to minify: invalid JSON syntax. Please resolve errors first.");
    }
  };

  const handleClear = () => {
    if (readOnly) return;
    const emptySchema = JSON.stringify({ formTitle: "New Form", fields: [] }, null, 2);
    setLocalValue(emptySchema);
    onChange(emptySchema);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(localValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadJson = () => {
    try {
      const parsed = JSON.parse(localValue);
      const filename = `${(parsed.formTitle || "form").toLowerCase().replace(/\s+/g, "_")}_schema.json`;
      const blob = new Blob([localValue], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (e) {
      const blob = new Blob([localValue], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "form_schema.json";
      link.click();
    }
  };

  const controlBtnClass = `p-2 ${themeTokens.inputBg} border ${themeTokens.border} ${themeTokens.textSecondary} hover:${themeTokens.text} rounded-xl shadow-sm focus:outline-none transition-all cursor-pointer`;
  const actionBtnClass = `flex items-center space-x-1 px-3 py-1.5 ${themeTokens.inputBg} border ${themeTokens.border} hover:border-blue-500 rounded-lg text-xs font-semibold ${themeTokens.textSecondary} hover:text-blue-500 cursor-pointer shadow-sm focus:outline-none transition-colors`;

  return (
    <div className={`p-6 h-full flex flex-col space-y-4 ${themeTokens.sidebar}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-bold ${themeTokens.text}`}>
            JSON Schema Editor {readOnly && <span className="text-xs px-2 py-0.5 ml-2 border border-amber-500/25 bg-amber-500/10 text-amber-500 rounded-md font-mono">View Only</span>}
          </h3>
          <p className={`text-xs mt-0.5 ${themeTokens.textSecondary}`}>
            {readOnly ? "View the JSON configuration structure." : "Directly modify the JSON configuration. Syntax and structure are validated in real-time."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleCopyJson}
            className={controlBtnClass}
            title="Copy JSON to Clipboard"
          >
            {copied ? <Check className="h-4.5 w-4.5 text-emerald-500" /> : <Clipboard className="h-4.5 w-4.5" />}
          </button>

          <button
            onClick={handleDownloadJson}
            className={controlBtnClass}
            title="Download JSON File"
          >
            <Download className="h-4.5 w-4.5" />
          </button>

          {!readOnly && (
            <button
              onClick={handleClear}
              className={`p-2 ${themeTokens.inputBg} border border-red-200 hover:bg-red-50 text-red-500 rounded-xl shadow-sm focus:outline-none transition-all cursor-pointer`}
              title="Clear and Reset Form"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Utilities Row */}
      {!readOnly && (
        <div className="flex flex-wrap gap-2">
          <button onClick={handlePrettify} className={actionBtnClass}>
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>Prettify / Format</span>
          </button>

          <button onClick={handleMinify} className={actionBtnClass}>
            <Code className="h-3.5 w-3.5 text-purple-500" />
            <span>Minify</span>
          </button>
        </div>
      )}

      {/* Editor Textarea */}
      <div className={`flex-1 flex flex-col rounded-2xl border ${themeTokens.border} overflow-hidden shadow-sm ${themeTokens.inputBg} min-h-[400px]`}>
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-950/40 px-4 py-3 flex items-start space-x-2.5">
            <span className="h-2 w-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0 animate-pulse" />
            <div className="text-xs text-red-700 dark:text-red-400 font-medium leading-relaxed">
              <span className="font-bold">Schema Invalid: </span>
              {error}
            </div>
          </div>
        )}

        <textarea
          value={localValue}
          onChange={handleJsonChange}
          onBlur={handleBlur}
          readOnly={readOnly}
          className={`flex-1 p-4 font-mono text-xs ${themeTokens.inputBg} ${themeTokens.inputText} focus:outline-none resize-none overflow-y-auto leading-relaxed ${readOnly ? "opacity-75 cursor-not-allowed" : ""}`}
          placeholder={readOnly ? "No schema loaded." : "Type or paste your Form Schema JSON here..."}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default JsonEditor;
