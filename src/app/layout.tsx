import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { MembershipProvider } from "@/lib/membership";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScaleLock } from "@/components/scale-lock";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Yxclusive — Passed On, Not Put Away",
  description:
    "A space where exclusive fashion pieces are passed on, not put away. Browse looks, shop pieces, and join as a Yxmember to sell commission-free.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} ${permanentMarker.variable} antialiased`}
    >
      <body className="bg-cream text-ink">
        <ScaleLock>
          <MembershipProvider>
            <div className="flex flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </MembershipProvider>
        </ScaleLock>
      </body>
    </html>
  );
}
