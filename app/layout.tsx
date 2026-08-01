import { Geist_Mono, DM_Sans, Noto_Serif } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CV Builder — ATS-Friendly Resume Builder",
  description:
    "Create a professional, ATS-friendly resume in your browser. No account needed, nothing leaves your device. Export to PDF or JSON.",
}

const notoSerifHeading = Noto_Serif({subsets:['latin'],variable:'--font-heading'});

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", dmSans.variable, notoSerifHeading.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
