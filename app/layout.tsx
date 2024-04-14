import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdSense from "@/components/AdSense";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "McCoin",
  description:
    "The simplist way to enter cyptocurrency. Without the crypto side.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script id="aclib" type="text/javascript" src="//acscdn.com/script/aclib.js" strategy="afterInteractive" ></Script>

        <AdSense />
        {children}
      </body>
    </html>
  );
}
