"use client";

import { useMemo, useState } from "react";
import { Bell, LoaderCircle, LogOut, Menu, Settings, User } from "lucide-react";
import { MyAccountModal } from "@/components/layout/MyAccountModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/auth-context";

interface TopbarProps {
  onMenuClick?: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "US";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMyAccountOpen, setIsMyAccountOpen] = useState(false);

  const displayName = user?.name ?? "Usuário";
  const displayRole = user?.role === "user" ? "Usuário" : "Usuário";
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatarUrl ?? undefined}
                    alt={displayName}
                  />
                  <AvatarFallback className="bg-primary text-sm text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden flex-col items-start md:flex">
                  <span className="text-sm font-medium">{displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    {displayRole}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-auto">
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setIsMyAccountOpen(true);
                }}
                disabled={isLoggingOut}
              >
                <User className="h-4 w-4" />
                Minha conta
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Settings className="h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  void handleLogout();
                }}
              >
                {isLoggingOut ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Saindo...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    Sair
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <MyAccountModal
        open={isMyAccountOpen}
        onOpenChange={setIsMyAccountOpen}
      />
    </>
  );
}
