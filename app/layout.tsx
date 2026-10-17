import "./globals.css";
import Providers from "./providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

/* Self-hosted at build time — no render-blocking request to fonts.googleapis.com. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata = {
  title: "Layout — draw the layout, ship the code",
  description:
    "A visual builder for responsive page layouts. Split a binary tree of panes, drag the ratios, and export JSX + Tailwind, HTML + CSS, a JSON spec or a prompt an LLM can read back.",
  applicationName: "Layout",
  authors: [{ name: "Devansh Arora", url: "https://devansharora.in" }],
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090a" },
    { media: "(prefers-color-scheme: light)", color: "#f2f0ea" },
  ],
};

/* Resolve a saved theme before first paint so the sheet never flashes. */
const themeScript = `try{var t=localStorage.getItem("sheet-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GTAG = process.env.GTAG || "";
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics gaId={GTAG} />
    </html>
  );
}
