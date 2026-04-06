import { LoginPageBrand } from "@/components/auth/LoginPageBrand"
import { LoginPageFormCard } from "@/components/auth/LoginPageFormCard"
import { LoginPageShell } from "@/components/auth/LoginPageShell"
import { LoginPageProvider } from "@/lib/auth/login-page-context"

export default function LoginPage() {
  return (
    <LoginPageProvider>
      <LoginPageShell>
        <div className="w-full max-w-md relative z-10">
          <LoginPageBrand />
          <LoginPageFormCard />
        </div>
      </LoginPageShell>
    </LoginPageProvider>
  )
}
