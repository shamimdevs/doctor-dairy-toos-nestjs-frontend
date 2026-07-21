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
    default: "Doctor Dairy Tools | Dairy Farm Management Software",
    template: "%s | Doctor Dairy Tools",
  },

  description:
    "Doctor Dairy Tools is a complete dairy farm management platform that helps farmers manage cattle, milk production, breeding, health records, vaccination, finance, inventory, and farm operations efficiently.",

  keywords: [
    "Doctor Dairy Tools",
    "Dairy Farm Management Software",
    "Dairy ERP",
    "Livestock Management",
    "Cow Management",
    "Milk Production Software",
    "Farm Management System",
    "Veterinary Management",
    "Cattle Health Tracking",
    "Breeding Management",
    "Vaccination Records",
    "Bangladesh Dairy Software",
    "Livestock ERP",
  ],

  authors: [
    {
      name: "Doctor Dairy Tools",
    },
  ],

  creator: "Doctor Dairy Tools",
  publisher: "Doctor Dairy Tools",
  applicationName: "Doctor Dairy Tools",
  category: "Agriculture",

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
    title: "Doctor Dairy Tools | Dairy Farm Management Software",
    description:
      "Manage cattle, milk production, breeding, health records, vaccination, finance, inventory, and dairy farm operations from one powerful platform.",
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
    title: "Doctor Dairy Tools | Dairy Farm Management Software",
    description:
      "Complete dairy farm management software for modern dairy farms.",
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
