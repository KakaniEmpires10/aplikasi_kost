import type { Metadata } from "next";
// import { Poppins } from "next/font/google";

import "./globals.css";

import NextTopLoader from 'nextjs-toploader'
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from 'react-hot-toast'

// export const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600"],
//   variable: "--font-poppins",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Cari Kost",
  description: "web ini menyediakan list kost yang tersedia di aceh untuk mempermudah pencarian anda",
  keywords: "kost, cari kost, banda aceh, kost banda aceh"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <NextTopLoader color="#2563eb" showSpinner={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster
            position="top-right"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
