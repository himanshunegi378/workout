import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/app/components/providers/QueryProvider";
import { RestTimerProvider } from "@/app/features/workouts/contexts/RestTimerContext";
import { RestTimerOverlay } from "@/app/features/workouts/components/ui/RestTimer";
import { BottomDrawerProvider } from "@/app/components/ui";
import { PWARegistration } from "@/app/components/PWARegistration";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Workout Tracker",
  description: "Track your workout programs, exercises, and progress",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Workout Tracker",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${jakarta.variable} font-body antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <SessionProvider>
            <QueryProvider>
              <RestTimerProvider>
                <BottomDrawerProvider>
                  {children}
                </BottomDrawerProvider>
                <RestTimerOverlay />
                <PWARegistration />
              </RestTimerProvider>
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
