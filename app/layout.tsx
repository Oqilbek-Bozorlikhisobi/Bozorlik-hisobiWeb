
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "./Providers";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Market app",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html
      lang="uz"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans">
        <Providers>
        <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
