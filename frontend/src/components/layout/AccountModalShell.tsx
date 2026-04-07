"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { ReactNode } from "react";

interface AccountModalShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  body: ReactNode;
  footerActions: ReactNode;
}

export function AccountModalShell({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  body,
  footerActions,
}: AccountModalShellProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = (
    <form
      onSubmit={onSubmit}
      className="flex max-h-[70vh] flex-1 flex-col overflow-hidden"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-4 pt-4 md:px-8 md:pt-2">
        {body}
      </div>
      {isDesktop ? (
        <DialogFooter className="p-10 pt-2">{footerActions}</DialogFooter>
      ) : (
        <DrawerFooter>{footerActions}</DrawerFooter>
      )}
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="gap-1 border-b border-border py-6 pl-8 pr-12">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="border-b border-border pl-6 pr-10">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {form}
      </DrawerContent>
    </Drawer>
  );
}
