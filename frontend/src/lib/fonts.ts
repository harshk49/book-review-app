import { Raleway, Geist_Mono } from "next/font/google";

export const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-raleway",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
