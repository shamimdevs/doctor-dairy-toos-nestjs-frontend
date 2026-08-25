import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "../lib/providers/Providers";
import ToastProvider from "../components/ToastProvider/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://doctordairytools.com"),

  title: {
    default: "Doctor Dairy Tools | Dairy Farm Equipment E-commerce Store",
    template: "%s | Doctor Dairy Tools",
  },

  description:
    "Shop premium Dairy Farm Equipment, Veterinary & Livestock Tools online — Milking Machines, Cattle Insemination (AI) Equipment, Veterinary & Surgical Tools, Dairy Farm Supplies and Modern Livestock Technology. Trusted quality products with nationwide delivery across Bangladesh.",

  keywords: [
    "Doctor Dairy Tools",
    "Dairy Farm Equipment Bangladesh",
    "Veterinary Tools Bangladesh",
    "Livestock Equipment Bangladesh",
    "Milking Machine Bangladesh",
    "Cattle Insemination Tools",
    "AI Equipment",
    "AI Gun",
    "Cryo Can",
    "Liquid Nitrogen Can",
    "Veterinary Surgical Instruments",
    "Dairy Farm Tools",
    "Cattle Farm Equipment",
    "Calf Feeder",
    "Veterinary Supplies",
    "ডেইরি ফার্মের সরঞ্জাম",
    "ভেটেরিনারি যন্ত্রপাতি",
    "গবাদিপশুর সরঞ্জাম",
    "গরুর খামারের সরঞ্জাম",
    "কৃত্রিম প্রজনন সরঞ্জাম",
    "গরুর কৃত্রিম প্রজনন সরঞ্জাম",
    "দুধ দোহনের মেশিন",
    "গবাদিপশুর চিকিৎসা সরঞ্জাম",
    "পশুপালন সরঞ্জাম",
    "ডেইরি ফার্ম টুলস",
    "ভেটেরিনারি টুলস বাংলাদেশ",
  ],

  authors: [
    {
      name: "Doctor Dairy Tools",
    },
  ],

  creator: "Doctor Dairy Tools",
  publisher: "Doctor Dairy Tools",
  applicationName: "Doctor Dairy Tools",
  category: "E-commerce",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://doctordairytools.com",
  },

  openGraph: {
    title: "Doctor Dairy Tools | Dairy Farm Equipment E-commerce Store",
    description:
      "Shop premium dairy farm equipment and veterinary tools online — milking gear, cattle care, breeding, and farm supplies delivered across Bangladesh.",
    url: "https://doctordairytools.com",
    siteName: "Doctor Dairy Tools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Doctor Dairy Tools",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Doctor Dairy Tools | Dairy Farm Equipment E-commerce Store",
    description:
      "Shop premium dairy farm equipment and veterinary tools online, delivered across Bangladesh.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
      >
        <Providers>
          {children}
          <ToastProvider />
        </Providers>

        {/* Google Analytics Setup */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-242fdsf2"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-242fdsf2', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
