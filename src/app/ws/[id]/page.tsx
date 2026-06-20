"use client";

import React, { use, useState, useEffect } from "react";
import App from "../../../App";

import { notFound } from "next/navigation";

interface WorkspaceProps {
  params: Promise<{ id: string }>;
}

export default function WorkspacePage({ params }: WorkspaceProps) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.id;

  const isAlphanumeric = /^[a-z0-9]+$/i.test(workspaceId);
  if (!isAlphanumeric) {
    notFound();
  }

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-gray-400 font-sans font-medium text-sm">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading Workspace...</span>
        </div>
      </div>
    );
  }

  return <App workspaceId={workspaceId} />;
}
