import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "@/assets/styles/globals.css";
import { cn } from "@/lib/utils";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";


const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({subsets: ['latin']})


export const metadata: Metadata = {
  title: `${APP_NAME}`,
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL)
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", inter.className, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute='class' defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ToastProvider>
            {children}
            <Toaster />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
