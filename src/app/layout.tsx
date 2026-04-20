import type { Metadata } from "next";
import { Toaster } from "sonner";
import AdminWrapper from "@/components/AdminWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blockchain CTF Registration | Coding Club",
  description:
    "Register your team for the Blockchain CTF — a capture the flag challenge by Coding Club",
  keywords: ["registration", "blockchain", "CTF", "coding club", "students"],
  authors: [{ name: "Coding Club" }],
  openGraph: {
    title: "Blockchain CTF Registration | Coding Club",
    description:
      "Register your team for the Blockchain CTF — a capture the flag challenge",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AdminWrapper>
          {children}
        </AdminWrapper>
        <Toaster
          theme="dark"
          position="top-center"
          richColors
          toastOptions={{
            style: {
              background: "rgba(15, 25, 50, 0.95)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              backdropFilter: "blur(12px)",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
