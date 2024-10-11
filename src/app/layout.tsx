import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Theta",
  description: "An instance of the Theta status monitoring platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
