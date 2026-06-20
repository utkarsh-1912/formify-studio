import React, { useState } from "react";
import {
  Trash2,
  Search,
  Download,
  Eye,
  Copy
} from "lucide-react";
import { AppThemeTokens } from "../utils/appTheme";

export interface SubmissionEntry {
  id: string;
  timestamp: string;
  data: Record<string, any>;
}

interface SubmissionsDashboardProps {
  submissions: SubmissionEntry[];
  themeTokens: AppThemeTokens;
  onDeleteSubmission: (id: string) => void;
  onClearAllSubmissions: () => void;
}

const SubmissionsDashboard: React.FC<SubmissionsDashboardProps> = ({
  submissions,
  themeTokens,
  onDeleteSubmission,
  onClearAllSubmissions
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModalEntry, setActiveModalEntry] = useState<SubmissionEntry | null>(null);

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

  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    
    const allKeys = Array.from(
      new Set(submissions.flatMap((entry) => Object.keys(entry.data)))
    );

    const headers = ["Submission ID", "Timestamp", ...allKeys];
    const csvRows = [
      headers.join(","),
      ...submissions.map((entry) => {
        const rowData = [
          entry.id,
          entry.timestamp,
          ...allKeys.map((key) => {
            const val = entry.data[key] === undefined ? "" : entry.data[key];
            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
          })
        ];
        return rowData.join(",");
      })
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `formify_submissions_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (submissions.length === 0) return;
    const blob = new Blob([JSON.stringify(submissions, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `formify_submissions_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied raw data to clipboard!");
  };

  const btnClass = `flex items-center space-x-1.5 px-4 py-2 ${themeTokens.inputBg} border ${themeTokens.border} hover:border-gray-400 dark:hover:border-gray-600 rounded-xl text-xs font-bold ${themeTokens.text} disabled:opacity-40 cursor-pointer shadow-sm focus:outline-none transition-colors`;

  return (
    <div className={`p-6 h-full overflow-y-auto space-y-6 ${themeTokens.previewBg} flex flex-col`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-bold ${themeTokens.text}`}>Submissions Log</h3>
          <p className={`text-xs mt-0.5 ${themeTokens.textSecondary}`}>
            View, search, and download test submissions made on the live form.
          </p>
        </div>
        {submissions.length > 0 && (
          <button
            onClick={onClearAllSubmissions}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors duration-150 focus:outline-none"
          >
            Clear All Logs
          </button>
        )}
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="h-4.5 w-4.5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by ID, key, or value..."
            className={`w-full pl-9.5 pr-4 py-2 border ${themeTokens.border} rounded-xl text-sm ${themeTokens.inputBg} ${themeTokens.inputText} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          />
        </div>

        {/* Export Buttons */}
        <div className="flex space-x-2">
          <button onClick={handleExportCSV} disabled={submissions.length === 0} className={btnClass}>
            <Download className="h-4 w-4 text-blue-500" />
            <span>Export CSV</span>
          </button>
          <button onClick={handleExportJSON} disabled={submissions.length === 0} className={btnClass}>
            <Download className="h-4 w-4 text-purple-500" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Grid List / Table */}
      <div className={`flex-1 min-h-64 border ${themeTokens.border} ${themeTokens.card} rounded-2xl overflow-hidden shadow-sm flex flex-col`}>
        {filteredSubmissions.length === 0 ? (
          <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center text-sm ${themeTokens.textSecondary}`}>
            {submissions.length === 0
              ? "No submissions logged yet. Fill out the live form on the right and click Submit to populate this table."
              : "No submissions matched your search query."}
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className={`min-w-full divide-y ${themeTokens.border} text-left text-sm`}>
              <thead className={`${themeTokens.tableHead} text-xs font-bold uppercase tracking-wider select-none`}>
                <tr>
                  <th className="px-6 py-3">Timestamp / Time</th>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Values Summary</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${themeTokens.border} divide-solid bg-transparent`}>
                {filteredSubmissions.map((entry) => (
                  <tr key={entry.id} className={`${themeTokens.tableRowHover} transition-colors`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-xs font-medium ${themeTokens.textSecondary}`}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono font-semibold text-blue-500">
                      #{entry.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs md:max-w-sm lg:max-w-md truncate text-xs space-x-2">
                        {Object.entries(entry.data).map(([key, val]) => (
                          <span
                            key={key}
                            className={`inline-block border ${themeTokens.border} ${themeTokens.inputBg} ${themeTokens.inputText} px-2 py-0.5 rounded mr-1.5 my-0.5`}
                          >
                            <span className={`font-semibold mr-1 ${themeTokens.textSecondary}`}>{key}:</span>
                            <span className={themeTokens.text}>
                              {typeof val === "boolean" ? (val ? "Yes" : "No") : String(val)}
                            </span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold space-x-2">
                      <button
                        onClick={() => setActiveModalEntry(entry)}
                        className={`inline-flex items-center space-x-1 text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-lg cursor-pointer transition-colors`}
                        title="View Full Payload"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSubmission(entry.id)}
                        className={`inline-flex items-center space-x-1 text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg cursor-pointer transition-colors`}
                        title="Delete Submission"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail Viewer */}
      {activeModalEntry && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className={`rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border ${themeTokens.border} ${themeTokens.modalBg} animate-scale-up`}>
            <div className={`px-6 py-4.5 border-b ${themeTokens.border} flex justify-between items-center bg-black/5`}>
              <h4 className={`font-bold ${themeTokens.text}`}>Submission Details</h4>
              <span className="text-xs font-mono bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-lg">
                ID: {activeModalEntry.id}
              </span>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${themeTokens.textSecondary}`}>Time Logged</span>
                <span className={`text-sm font-semibold ${themeTokens.text}`}>
                  {new Date(activeModalEntry.timestamp).toLocaleString()}
                </span>
              </div>

              <div>
                <span className={`block text-xs font-bold uppercase tracking-wider mb-2 ${themeTokens.textSecondary}`}>Submitted Key-Values</span>
                <div className={`border ${themeTokens.border} rounded-xl p-4 font-mono text-xs space-y-1.5 overflow-x-auto max-h-48 ${themeTokens.inputBg} ${themeTokens.inputText}`}>
                  {Object.entries(activeModalEntry.data).map(([k, v]) => (
                    <div key={k} className={`flex border-b ${themeTokens.border} pb-1.5 last:border-0 last:pb-0`}>
                      <span className={`font-semibold w-28 flex-shrink-0 ${themeTokens.textSecondary}`}>{k}:</span>
                      <span className={`break-all ${themeTokens.text}`}>{JSON.stringify(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className={`block text-xs font-bold uppercase tracking-wider mb-2 ${themeTokens.textSecondary}`}>Raw JSON Payload</span>
                <pre className={`rounded-xl p-4 font-mono text-xs overflow-auto max-h-56 ${themeTokens.codeBg}`}>
                  {JSON.stringify(activeModalEntry.data, null, 2)}
                </pre>
              </div>
            </div>

            <div className={`px-6 py-4 border-t ${themeTokens.border} flex justify-end space-x-2 bg-black/5`}>
              <button
                onClick={() => copyToClipboard(JSON.stringify(activeModalEntry.data, null, 2))}
                className={`px-4 py-2 border ${themeTokens.border} text-xs font-bold ${themeTokens.text} ${themeTokens.inputBg} rounded-xl cursor-pointer flex items-center space-x-1.5 focus:outline-none`}
              >
                <Copy className="h-4 w-4" />
                <span>Copy Raw</span>
              </button>
              <button
                onClick={() => setActiveModalEntry(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-xl cursor-pointer focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsDashboard;
