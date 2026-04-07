import { LoginPageBrand } from "@/components/auth/LoginPageBrand"
import { LoginPageShell } from "@/components/auth/LoginPageShell"
import { ResetPasswordFormCard } from "@/components/auth/ResetPasswordFormCard"
import { ResetPasswordPageProvider } from "@/lib/auth/reset-password-page-context"

export default function ResetPasswordPage() {
  return (
    <ResetPasswordPageProvider>
      <LoginPageShell>
        <div className="relative z-10 w-full max-w-md">
          <LoginPageBrand />
          <ResetPasswordFormCard />
        </div>
      </LoginPageShell>
    </ResetPasswordPageProvider>
  )
}
