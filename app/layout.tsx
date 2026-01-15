
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/app/context/page";
import { auth } from "@clerk/nextjs/server";
import SocketProvider from "./(group)/component/socketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { userId  }  = await auth();
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {userId && <SocketProvider userId={userId} />}
          <UserProvider>{children}</UserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
