import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Venom Ai",
  description: "full stack project",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppProvider>
        <html lang="en">
          <body
            className={`${inter.className} antialiased`}
          >
            {children}
          </body>
        </html>
      </AppProvider>
    </ClerkProvider>
  );
}
