import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({ src: "./fonts/inter-latin.woff2", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  title: "Recrutamento de Construção | Constrói o Teu Futuro",
  description: "Junta-te à nossa rede de profissionais da construção. O teu trabalho tem valor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}

