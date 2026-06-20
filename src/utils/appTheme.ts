export type GlobalThemeMode = "light" | "dark" | "matrix" | "midnight" | "corporate";

export interface AppThemeTokens {
  bg: string;
  header: string;
  sidebar: string;
  previewBg: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  tabActive: string;
  tabInactive: string;
  inputBg: string;
  inputText: string;
  footer: string;
  modalBg: string;
  tableHead: string;
  tableRowHover: string;
  codeBg: string;
  codeHeader: string;
}

export const themeMap: Record<GlobalThemeMode, AppThemeTokens> = {
  light: {
    bg: "bg-gray-50",
    header: "bg-white border-gray-200 text-gray-900",
    sidebar: "bg-white border-gray-200",
    previewBg: "bg-gray-100/40",
    card: "bg-white border-gray-100 shadow-lg text-gray-900",
    text: "text-gray-900",
    textSecondary: "text-gray-500",
    border: "border-gray-200",
    tabActive: "border-blue-600 text-blue-600",
    tabInactive: "border-transparent text-gray-500 hover:text-gray-700",
    inputBg: "bg-white",
    inputText: "text-gray-900 placeholder-gray-400",
    footer: "bg-white border-gray-200 text-gray-500",
    modalBg: "bg-white text-gray-900",
    tableHead: "bg-gray-50 text-gray-500",
    tableRowHover: "hover:bg-gray-50/70",
    codeBg: "bg-gray-900 text-gray-100",
    codeHeader: "bg-gray-800 text-gray-400"
  },
  dark: {
    bg: "bg-gray-950",
    header: "bg-gray-900 border-gray-800 text-white",
    sidebar: "bg-gray-900 border-gray-800",
    previewBg: "bg-gray-900/60",
    card: "bg-gray-800 border-gray-700/50 shadow-2xl text-gray-100",
    text: "text-gray-100",
    textSecondary: "text-gray-400",
    border: "border-gray-800",
    tabActive: "border-blue-500 text-blue-400",
    tabInactive: "border-transparent text-gray-400 hover:text-gray-200",
    inputBg: "bg-gray-750",
    inputText: "text-white placeholder-gray-500",
    footer: "bg-gray-900 border-gray-800 text-gray-400",
    modalBg: "bg-gray-850 text-white",
    tableHead: "bg-gray-800 text-gray-300",
    tableRowHover: "hover:bg-gray-800/40",
    codeBg: "bg-gray-950 text-gray-200",
    codeHeader: "bg-gray-900 text-gray-400"
  },
  matrix: {
    bg: "bg-black",
    header: "bg-black border-emerald-500/40 text-emerald-400",
    sidebar: "bg-neutral-950 border-emerald-500/30",
    previewBg: "bg-neutral-900/40",
    card: "bg-black border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-emerald-400",
    text: "text-emerald-400 font-mono",
    textSecondary: "text-emerald-500/70 font-mono",
    border: "border-emerald-500/25",
    tabActive: "border-emerald-500 text-emerald-400 font-mono shadow-[0_2px_4px_rgba(16,185,129,0.1)]",
    tabInactive: "border-transparent text-emerald-700 hover:text-emerald-500 font-mono",
    inputBg: "bg-black border-emerald-500/30 focus:border-emerald-500",
    inputText: "text-emerald-400 placeholder-emerald-800 font-mono",
    footer: "bg-black border-emerald-500/30 text-emerald-500/70 font-mono",
    modalBg: "bg-neutral-950 text-emerald-400 border border-emerald-500/50",
    tableHead: "bg-neutral-900 text-emerald-400 font-mono",
    tableRowHover: "hover:bg-emerald-950/20",
    codeBg: "bg-black border border-emerald-500/30 text-emerald-450",
    codeHeader: "bg-neutral-950 text-emerald-400 font-mono"
  },
  midnight: {
    bg: "bg-[#0b132b]",
    header: "bg-[#1c2541] border-[#3a506b]/40 text-cyan-400",
    sidebar: "bg-[#1c2541] border-[#3a506b]/35",
    previewBg: "bg-[#0b132b]/80",
    card: "bg-[#1c2541] border-[#3a506b]/50 shadow-2xl text-slate-100",
    text: "text-slate-100",
    textSecondary: "text-[#5bc0be]",
    border: "border-[#3a506b]/45",
    tabActive: "border-cyan-400 text-cyan-400",
    tabInactive: "border-transparent text-slate-400 hover:text-cyan-300",
    inputBg: "bg-[#0b132b]",
    inputText: "text-cyan-300 placeholder-[#3a506b]/70",
    footer: "bg-[#1c2541] border-[#3a506b]/45 text-slate-400",
    modalBg: "bg-[#1c2541] text-slate-100 border border-[#3a506b]/70",
    tableHead: "bg-[#0b132b] text-cyan-400",
    tableRowHover: "hover:bg-[#0b132b]/40",
    codeBg: "bg-[#0b132b] border border-[#3a506b]/40 text-cyan-200",
    codeHeader: "bg-[#1c2541] text-cyan-400"
  },
  corporate: {
    bg: "bg-slate-50",
    header: "bg-white border-slate-200 text-slate-800",
    sidebar: "bg-white border-slate-200",
    previewBg: "bg-slate-100/50",
    card: "bg-white border-slate-200 shadow-md text-slate-800",
    text: "text-slate-850",
    textSecondary: "text-slate-550",
    border: "border-slate-200",
    tabActive: "border-slate-800 text-slate-850",
    tabInactive: "border-transparent text-slate-400 hover:text-slate-700",
    inputBg: "bg-slate-50/50",
    inputText: "text-slate-800 placeholder-slate-400",
    footer: "bg-white border-slate-200 text-slate-400",
    modalBg: "bg-white text-slate-850 border border-slate-200",
    tableHead: "bg-slate-50 text-slate-600",
    tableRowHover: "hover:bg-slate-100/50",
    codeBg: "bg-[#0f172a] text-slate-200",
    codeHeader: "bg-[#1e293b] text-slate-400"
  }
};
