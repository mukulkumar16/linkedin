// import { UserProvider } from "../context/page";
import { Geist, Geist_Mono } from "next/font/google";

import Header from "@/app/(group)/component/Header";
import { UnreadProvider } from "./context/UnreadCount";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {




  return (
    <div>
      {/* <UserProvider> */}
      <UnreadProvider>


        <Header />
        {children}
      </UnreadProvider>
      {/* </UserProvider> */}
      {/* <Footer/> */}

    </div>


  );
}
