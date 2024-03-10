import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NextUiProvider from "@/components/providers/next-ui/next-ui-provider";

const monserat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ანგარიშთა გეგმა",
  description: "ანგარიშთა გეგმის დასამახსოვრებელი ტრენაჟორი",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={monserat.className}>
        <NextUiProvider>{children}</NextUiProvider>
      </body>
    </html>
  );
}
