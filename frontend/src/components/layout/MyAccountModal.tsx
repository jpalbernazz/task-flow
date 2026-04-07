"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { LoaderCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/get-error-message";
import { useAuth } from "@/lib/auth/auth-context";
import { AccountModalShell } from "@/components/layout/AccountModalShell";

interface MyAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const minimumPasswordLength = 8;

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

export function MyAccountModal({ open, onOpenChange }: MyAccountModalProps) {
  const { user, updatePassword, updateProfileName, uploadAvatar } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayName = user?.name ?? "Usuário";
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const avatarSrc = previewAvatarUrl ?? user?.avatarUrl ?? undefined;

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(user?.name ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setSelectedAvatarFile(null);
    setSubmitError(null);
    setPreviewAvatarUrl((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return null;
    });
  }, [open, user?.name]);

  useEffect(() => {
    return () => {
      if (previewAvatarUrl) {
        URL.revokeObjectURL(previewAvatarUrl);
      }
    };
  }, [previewAvatarUrl]);

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    setSelectedAvatarFile(file);
    setPreviewAvatarUrl((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return file ? URL.createObjectURL(file) : null;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || isSubmitting) {
      return;
    }

    const normalizedName = name.trim();
    const hasPasswordInput =
      currentPassword.trim() !== "" ||
      newPassword.trim() !== "" ||
      confirmNewPassword.trim() !== "";

    if (normalizedName === "") {
      setSubmitError("Nome é obrigatório.");
      return;
    }

    if (hasPasswordInput) {
      if (
        currentPassword.trim() === "" ||
        newPassword.trim() === "" ||
        confirmNewPassword.trim() === ""
      ) {
        setSubmitError("Preencha os 3 campos para alterar a senha.");
        return;
      }

      if (newPassword.length < minimumPasswordLength) {
        setSubmitError(
          `A nova senha deve ter no mínimo ${minimumPasswordLength} caracteres.`,
        );
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setSubmitError("A confirmação da senha não confere.");
        return;
      }
    }

    const shouldUpdateName = normalizedName !== user.name;
    const shouldUpdateAvatar = selectedAvatarFile !== null;
    const shouldUpdatePassword = hasPasswordInput;

    if (!shouldUpdateName && !shouldUpdateAvatar && !shouldUpdatePassword) {
      setSubmitError("Nenhuma alteração para salvar.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (shouldUpdateName) {
        await updateProfileName(normalizedName);
      }

      if (shouldUpdateAvatar && selectedAvatarFile) {
        await uploadAvatar(selectedAvatarFile);
      }

      if (shouldUpdatePassword) {
        await updatePassword(currentPassword, newPassword);
      }

      toast.success("Conta atualizada com sucesso.");
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        getErrorMessage(
          error,
          "Não foi possível salvar as alterações da conta.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerActions = (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={() => onOpenChange(false)}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar alterações"
        )}
      </Button>
    </>
  );

  return (
    <AccountModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Minha conta"
      description="Atualize seus dados pessoais e credenciais de acesso."
      onSubmit={handleSubmit}
      footerActions={footerActions}
      body={
        <>
          {submitError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {submitError}
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Avatar</p>
            <div className="flex flex-col gap-2 rounded-xl border border-border p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={avatarSrc} alt={displayName} />
                  <AvatarFallback className="bg-primary text-sm text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-1 flex-col gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-full justify-start sm:w-fit"
                  >
                    <Upload className="h-4 w-4" />
                    Selecionar avatar
                  </Button>
                  <span className="text-xs text-muted-foreground pl-px">
                    {selectedAvatarFile
                      ? selectedAvatarFile.name
                      : "Formatos: PNG, JPG, WEBP ou GIF."}
                  </span>
                </div>
              </div>

              <Input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="account-name">Nome</Label>
            <Input
              id="account-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Seu nome"
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="account-current-password">Senha atual</Label>
              <Input
                id="account-current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Digite sua senha atual"
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="account-new-password">Nova senha</Label>
              <Input
                id="account-new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Digite a nova senha"
                autoComplete="new-password"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="account-confirm-password">
              Confirmar nova senha
            </Label>
            <Input
              id="account-confirm-password"
              type="password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              placeholder="Confirme a nova senha"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </div>
        </>
      }
    />
  );
}
