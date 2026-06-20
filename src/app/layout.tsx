import React from "react";
import type { Metadata } from "next";
import "../index.css";
import "../styles/index.css";
import "../App.css";

export const metadata: Metadata = {
  title: "Formify Studio ✦ Visual & Code Dynamic Form Builder",
  description: "Formify Studio - Professional Visual & Code-based Dynamic Form Builder. Create, validate, customize, and export Tailwind-styled React and HTML forms instantly.",
  icons: {
    icon: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
