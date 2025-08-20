import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "./Providers";
import HeaderWrapper from "./header/HeaderProps"; 

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="uz">
=======
    
    <html lang="en">
>>>>>>> fa8eefcfb0bc3376829ea13721d6afc9a01d5afc
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>
      <body>
        <Providers>
          <HeaderWrapper />
          
          {children}
        </Providers>
        
      </body>
    </html>
  );
}
