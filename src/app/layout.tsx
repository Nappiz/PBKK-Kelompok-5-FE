import "./globals.css";
import "katex/dist/katex.min.css";
import { Krona_One, Inter } from "next/font/google";

const krona = Krona_One({ subsets: ["latin"], weight: "400", variable: "--font-krona" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "LearnWAI",
  description: "Your AI Study Buddy for Everyday Learning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${krona.variable} ${inter.variable} min-h-dvh antialiased`}>
        {children}
      </body>
    </html>
  );
}
