import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FrameProvider } from "@/components/farcaster-provider";
import { Debug } from "@/components/ui/Debug";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monad Moments",
  description: "Discover, share, and celebrate your journey on the Monad blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FrameProvider>
          {children}
          <Debug />
        </FrameProvider>
      </body>
    </html>
  );
}