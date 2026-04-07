import { ForgotPasswordFormCard } from "@/components/auth/ForgotPasswordFormCard"
import { LoginPageBrand } from "@/components/auth/LoginPageBrand"
import { LoginPageShell } from "@/components/auth/LoginPageShell"
import { ForgotPasswordPageProvider } from "@/lib/auth/forgot-password-page-context"
import { redirectAuthenticatedUserToDashboard } from "@/lib/auth/server-auth"

export default async function ForgotPasswordPage() {
  await redirectAuthenticatedUserToDashboard()

  return (
    <ForgotPasswordPageProvider>
      <LoginPageShell>
        <div className="relative z-10 w-full max-w-md">
          <LoginPageBrand />
          <ForgotPasswordFormCard />
        </div>
      </LoginPageShell>
    </ForgotPasswordPageProvider>
  )
}
