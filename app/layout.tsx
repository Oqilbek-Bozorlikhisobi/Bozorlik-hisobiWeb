
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "./Providers";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Market App – Onlayn Bozorlik Ro‘yxati va Xarid Tarixi",
  description:
    "Market App yordamida bozorlik ro‘yxati tuzing, mahsulotlarni boshqaring va xarid tarixingizni kuzatib boring. Eng qulay va oddiy bozorlik platformasi.",
  keywords: [
    "bozorlik",
    "market app",
    "onlayn bozorlik",
    "xarid ro‘yxati",
    "shopping list",
    "bozorlik ro‘yxati",
    "savat",
    "shopping history",
    "market",
    "marketweb.uz",
    "bozor",
    "xarid",
    "grocery list",
    "grocery shopping",
    "yordamchi ilova",
    "savdo",
    "marketveb.uz",
    "olama",
    "go`sht",
    "sabzavot",
    "meva",
    "non",
    "sut mahsulotlari",
    "ichimliklar",
    "maishiy texnika",
    "elektronika",
    "kiyim",
    "poyabzal",
    "uy anjomlari",
    "bolalar uchun",
    "o'yinchoqlar",
    "sog'liq va go'zallik",
    "sport va dam olish",
    "avtotransport",
    "bog'bonchilik",
    "ofis jihozlari",
    "kitoblar va media",
    "uy hayvonlari",
    "sovg'alar",    
    "aksessuarlar",
    "texnologiya",
    "mobil ilova",
    "veb ilova",
    "chorsuv",
    "Yunusobod",
    "Chilonzor",
    "Mirobod",
    "Mirzo Ulug'bek",
    "Yashnobod",
    "Uchtepa",
    "Olmazor",
  ],
  authors: [{ name: "Rustam" }], // seni yoki kompaniyangni ismi
  creator: "Market App Team",
  publisher: "Market App",
  metadataBase: new URL("https://www.marketveb.uz/"), // sayting URL
  openGraph: {
    title: "Market App – Onlayn Bozorlik Ro‘yxati",
    description:
      "Qulay va tezkor bozorlik platformasi: mahsulotlarni boshqaring, savatni yuriting va xaridlaringiz tarixini kuzating.",
    url: "https://www.marketveb.uz/",
    siteName: "Market App",
    images: [
      {
        url: "https://www.marketveb.uz/_next/static/media/logo.53fb42c4.png", // OpenGraph rasm
        width: 1200,
        height: 630,
        alt: "Market App – Onlayn Bozorlik Ro‘yxati",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Market App – Onlayn Bozorlik Ro‘yxati",
    description:
      "Market App yordamida bozorlik ro‘yxati tuzing va xaridlaringizni qulay boshqaring.",
    images: ["https://www.marketveb.uz/_next/static/media/logo.53fb42c4.png"],
    creator: "@username", // twitter username bo‘lsa qo‘sh
  },
  category: "Shopping",
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
