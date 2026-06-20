import React, { useState } from "react";
import { ThemeSettings, generateReactCode, generateHTMLCode } from "../utils/codeGenerators";
import { Clipboard, Check } from "lucide-react";
import { AppThemeTokens } from "../utils/appTheme";

interface CodeExporterProps {
  schema: any;
  theme: ThemeSettings;
  themeTokens: AppThemeTokens;
}

const CodeExporter: React.FC<CodeExporterProps> = ({ schema, theme, themeTokens }) => {
  const [activeTab, setActiveTab] = useState<"react" | "html" | "json">("react");
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    switch (activeTab) {
      case "react":
        return generateReactCode(schema, theme);
      case "html":
        return generateHTMLCode(schema, theme);
      case "json":
        return JSON.stringify(schema, null, 2);
    }
  };

  const handleCopy = () => {
    const code = getCode();
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const tabBtnClass = (tabId: typeof activeTab) => `pb-2.5 px-4 text-xs font-bold border-b-2 cursor-pointer transition-all focus:outline-none ${
    activeTab === tabId
      ? themeTokens.tabActive
      : themeTokens.tabInactive
  }`;

  return (
    <div className={`p-6 h-full overflow-y-auto space-y-4 ${themeTokens.previewBg} flex flex-col`}>
      <div>
        <h3 className={`text-lg font-bold ${themeTokens.text}`}>Export Generated Code</h3>
        <p className={`text-xs mt-0.5 ${themeTokens.textSecondary}`}>
          Copy-paste production-ready UI code based on your current schema and theme options.
        </p>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${themeTokens.border}`}>
        <button onClick={() => { setActiveTab("react"); setCopied(false); }} className={tabBtnClass("react")}>
          React Component
        </button>
        <button onClick={() => { setActiveTab("html"); setCopied(false); }} className={tabBtnClass("html")}>
          HTML + Tailwind
        </button>
        <button onClick={() => { setActiveTab("json"); setCopied(false); }} className={tabBtnClass("json")}>
          JSON Schema
        </button>
      </div>

      {/* Code Area */}
      <div className={`flex-1 flex flex-col relative rounded-xl border ${themeTokens.border} ${themeTokens.codeBg} overflow-hidden shadow-inner min-h-64`}>
        {/* Code Bar Header */}
        <div className={`px-4 py-2 ${themeTokens.codeHeader} flex justify-between items-center text-xs font-mono select-none`}>
          <span>
            {activeTab === "react" ? "GeneratedForm.tsx" : activeTab === "html" ? "index.html" : "schema.json"}
          </span>
          <button
            onClick={handleCopy}
            className={`flex items-center space-x-1 ${themeTokens.textSecondary} hover:${themeTokens.text} transition-colors duration-150 cursor-pointer focus:outline-none`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code content block */}
        <pre className="flex-1 p-4 font-mono text-xs overflow-auto text-left leading-relaxed select-text select-all">
          <code>{getCode()}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeExporter;
