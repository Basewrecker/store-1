import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "@/assets/styles/globals.css";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({subsets: ['latin']})


export const metadata: Metadata = {
  title: `${APP_NAME}`,
  description: "just another store",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("antialiased", inter.className, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
