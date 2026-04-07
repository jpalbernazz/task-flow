"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  mainNavigationItems,
  secondaryNavigationItems,
} from "@/services/navigation-service";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-64 bg-sidebar p-0 text-sidebar-foreground"
      >
        <SheetHeader className="flex h-16 flex-row items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-sidebar-border/70 bg-sidebar-accent/40 shadow-sm">
            <Image
              src="/icon.svg"
              alt="TaskFlow"
              width={40}
              height={40}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <SheetTitle className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            TaskFlow
          </SheetTitle>
          <SheetDescription className="sr-only">
            Menu de navegação principal
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60">
            Menu
          </div>

          {mainNavigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          {secondaryNavigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
