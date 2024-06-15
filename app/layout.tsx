import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { EdgeStoreProvider } from "@/lib/edgestore";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sumbang Pakaian",
  description: "Sumbang pakaian yang mudah dan cepat",
  icons: {
    icon: [
      {
        url: "/Logo-icon.svg",
        href: "/Logo-icon.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <Toaster position="bottom-right" />

            {children}
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
