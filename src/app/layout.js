import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Toast from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { LoaderProvider } from "@/utils/useLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GymDiary - Home",
  description: "GymDiary",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionWrapper>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toast />
          <Navbar />
          <LoaderProvider>
            <Loader />
            <div className="w-full bg-background">
              <div className="min-h-[88vh] bg-background mx-auto py-20 max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </LoaderProvider>
          <Footer />
        </body>
      </SessionWrapper>
    </html>
  );
}
