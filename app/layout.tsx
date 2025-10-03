import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import Loading from "@/components/loading"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Hussam Awa - Executive Producer & Marketing Leader",
  description:
    "Executive Producer, HR, Sales Manager and Marketing Manager with 12+ years of experience in Dubai's media industry. Golden Visa holder specializing in multimedia production, marketing strategies, and team leadership.",
  keywords: [
    "Executive Producer",
    "Marketing Manager",
    "Sales Manager",
    "HR Manager",
    "Dubai",
    "Media Production",
    "Golden Visa",
  ],
  generator: 'v0.app',
  openGraph: {
    title: "Hussam Awa - Executive Producer & Marketing Leader",
    description: "Executive Producer, HR, Sales Manager and Marketing Manager with 12+ years of experience in Dubai's media industry. Golden Visa holder specializing in multimedia production, marketing strategies, and team leadership.",
    url: "https://hussam-awa-portfolio.vercel.app", // Update with actual URL
    siteName: "Hussam Awa Portfolio",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HUSSAM-6Lk8xXir2XB6TY1T0hIt5MJf8FXFPu.jpg",
        width: 400,
        height: 400,
        alt: "Hussam Awa - Executive Producer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hussam Awa - Executive Producer & Marketing Leader",
    description: "Executive Producer, HR, Sales Manager and Marketing Manager with 12+ years of experience in Dubai's media industry.",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HUSSAM-6Lk8xXir2XB6TY1T0hIt5MJf8FXFPu.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
