"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Runtime error caught by next.js error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <img src="/logo-long.png" alt="Formify Logo" className="h-8" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md w-full mx-auto px-6 py-16 text-center z-10 flex-1 flex flex-col justify-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-red-500/10 text-red-400 rounded-3xl mb-2 animate-pulse">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Something went wrong!</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            An unexpected runtime compilation or peer synchronization error occurred.
          </p>
          {error.message && (
            <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-xl text-left font-mono text-[10px] text-red-300 max-h-24 overflow-y-auto break-all">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center space-x-2 py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-blue-600/20 focus:outline-none"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Resetting Boundary</span>
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center space-x-2 py-3 px-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all shadow-sm focus:outline-none"
          >
            <Home className="h-4 w-4 text-slate-400" />
            <span>Back to Home</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-650 border-t border-slate-900/60 z-10">
        &copy; {new Date().getFullYear()} Formify Studio.
      </footer>
    </div>
  );
}
