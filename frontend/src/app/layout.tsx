import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import { Header } from "@/components/Header";
import { MainLayout } from "@/components/MainLayout";
import { NotificationProvider } from "@/contexts/NotificationContext";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Authn Authz",
  description: "Authn Authz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <NotificationProvider>
            <Header />
            <MainLayout>{children}</MainLayout>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
