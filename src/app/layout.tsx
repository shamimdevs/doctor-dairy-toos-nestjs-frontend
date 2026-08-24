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
    "Doctor Dairy Tools is an online e-commerce store for premium dairy farm equipment and veterinary tools. Shop and order cattle care, milking, breeding, and farm supplies online with delivery across Bangladesh.",

  keywords: [
    "Doctor Dairy Tools",
    "Dairy Farm Equipment Online",
    "Dairy Tools E-commerce",
    "Veterinary Tools Shop",
    "Cattle Care Products",
    "Milking Equipment",
    "Dairy Farm Supplies",
    "Livestock Equipment Store",
    "Online Dairy Shop Bangladesh",
    "Breeding Equipment",
    "Farm Equipment Marketplace",
    "Buy Dairy Tools Online",
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
