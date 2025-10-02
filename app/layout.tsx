import "./globals.css";
import Providers from "./providers";
import { GoogleAnalytics } from '@next/third-parties/google'


export const metadata = {
  title: "Layout",
  description: "Visualize responsive flex/grid layouts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GTAG = process.env.GTAG || "";
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics gaId={GTAG}/>
    </html>
  );
}
