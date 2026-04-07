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

interface TaskModalShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  body: ReactNode;
  footerActions: ReactNode;
}

export function TaskModalShell({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  body,
  footerActions,
}: TaskModalShellProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = (
    <form onSubmit={onSubmit} className="flex max-h-[70vh] flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-4 px-6 pb-4 pt-4 overflow-y-auto md:px-8 md:pt-2">
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
          <DialogHeader className="border-b border-border pl-8 py-6 pr-12 gap-1">
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
