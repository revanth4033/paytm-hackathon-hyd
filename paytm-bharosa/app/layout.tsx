import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BharosaProvider } from "@/context/BharosaContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { PhoneFrame } from "@/components/PhoneFrame";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paytm Bharosa",
  description: "Digital udhaar, co-signed and visible to Paytm.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg-app flex justify-center">
        <BharosaProvider>
          <NotificationProvider>
            <PhoneFrame>{children}</PhoneFrame>
          </NotificationProvider>
        </BharosaProvider>
      </body>
    </html>
  );
}
