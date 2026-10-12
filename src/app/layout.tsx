import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./tpa-public.css";
import { appearanceBootstrap } from "@/domain/appearance";
const inter = localFont({ src: "../../public/theme/assets/080f1bf00d41c6a3.woff2", display: "swap", variable: "--font-inter", weight: "100 900" });
export const metadata: Metadata = {
  title: {
    default: "TPA — Good people. Greater possibilities.",
    template: "%s | TPA",
  },
  description:
    "Tollygunge Professional Association. Connect, learn, collaborate, grow and contribute.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: appearanceBootstrap }} />
      </head>
      <body className={inter.variable}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
