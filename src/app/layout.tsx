import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./provider";
import LoadingOverlay from "@/components/Loaders/LoadingSpinner"; // ✅ Add this
import DebugTools from "@/components/DebugTools";
import { Toaster } from "react-hot-toast";
import RealTimeSync from "@/components/RealTimeSync";
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
          <LoadingOverlay />
          <RealTimeSync />
          <Toaster
            toastOptions={{
              style: {
                background: "#1f1f1f",
                color: "#fff",
              },
              success: {
                style: { border: "1px solid green" },
              },
              error: {
                style: { border: "1px solid red" },
              },
            }}
            position="top-right"
            reverseOrder={false}
          />
          {/* ✅ Show full-app loading indicator */}
          {children}
          {/* <DebugTools /> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
