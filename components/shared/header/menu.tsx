import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button render={<Link href="/cart" />} variant="ghost">
          <ShoppingCart /> Cart
        </Button>
        <Button render={<Link href="/sign-in" />}>
          <UserIcon /> Sign In
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className = 'align-middle'>
          <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>
              Menu
            </SheetTitle>
            <ModeToggle />
            <Button render={<Link href="/cart" />} variant="ghost" nativeButton={false}>
                <ShoppingCart /> Cart
            </Button>
            <Button render={<Link href="/sign-in" />}>
              <UserIcon /> Sign In
            </Button>
            <SheetDescription>

            </SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

export default Menu;
