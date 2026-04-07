import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { SettingsAppearanceSection } from "@/components/settings/SettingsAppearanceSection"
import { requireServerAuth } from "@/lib/auth/server-auth"

export default async function SettingsPage() {
  const { user } = await requireServerAuth()

  return (
    <DashboardLayout initialUser={user}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
          <p className="text-sm text-muted-foreground">
            Personalize a aparência do TaskFlow.
          </p>
        </div>

        <SettingsAppearanceSection />
      </div>
    </DashboardLayout>
  )
}
