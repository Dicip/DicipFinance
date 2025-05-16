"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  className?: string;
}

export function AppHeader({ title, className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6",
        className
      )}
    >
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      {/* Add User Profile / Actions here later if needed */}
    </header>
  );
}
