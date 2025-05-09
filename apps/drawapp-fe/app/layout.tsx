import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { getVerifiedToken } from "@/lib/cookie";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Draw App",
  description: "Create a shape now",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoggedIn = await getVerifiedToken();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light" storageKey="draw-meetings-theme">
          <div className="w-full bg-gray-50 dark:bg-gray-950">
            <Navbar isLoggedIn={!!isLoggedIn} />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
