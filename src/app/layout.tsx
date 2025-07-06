import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./provider";
import LoadingOverlay from "@/components/Loaders/LoadingSpinner";
import PageTransitionWrapper from "@/components/Loaders/PageTransitionWrapper";
import DebugTools from "@/components/DebugTools";
import DebugStoreSettings from "@/components/DebugStoreSettings";
import RealTimeSync from "@/components/RealTimeSync";
import CustomToaster from "@/components/CustomToaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MR_Bike_Modz",
  description: "Auto Parts & Accessories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider>
          <PageTransitionWrapper />
          <LoadingOverlay />
          <RealTimeSync />
          <CustomToaster />
          {children}
          {/* <CartDebug /> */}
          {/* <DebugTools /> */}
          {/* <DebugStoreSettings /> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
