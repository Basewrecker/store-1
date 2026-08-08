'use client';
import { useState,useEffect } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon,MoonIcon,SunMoon } from "lucide-react";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant='ghost'>
          {theme === 'system' ? (
            <SunMoon />
          ) : theme === 'dark' ? (
            <MoonIcon />
            ) : (
              <SunIcon />
          )}
        </Button>
      </DropdownMenuTrigger>
      </DropdownMenu>
  )
}

export default ModeToggle
