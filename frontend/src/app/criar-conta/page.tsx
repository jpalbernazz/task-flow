import { LoginPageBrand } from "@/components/auth/LoginPageBrand"
import { LoginPageShell } from "@/components/auth/LoginPageShell"
import { RegisterPageFormCard } from "@/components/auth/RegisterPageFormCard"
import { RegisterPageProvider } from "@/lib/auth/register-page-context"
import { redirectAuthenticatedUserToDashboard } from "@/lib/auth/server-auth"

export default async function RegisterPage() {
  await redirectAuthenticatedUserToDashboard()

  return (
    <RegisterPageProvider>
      <LoginPageShell>
        <div className="relative z-10 w-full max-w-md">
          <LoginPageBrand />
          <RegisterPageFormCard />
        </div>
      </LoginPageShell>
    </RegisterPageProvider>
  )
}
