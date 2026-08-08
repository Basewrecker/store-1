import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { ThemeProvider } from "next-themes";

// just the overall layout for the pages, none of this is changed in any of the pages and is a constant
// that is separate

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 wrapper">
        {children}
      </main>
      <Footer />
    </div>
  );
}
