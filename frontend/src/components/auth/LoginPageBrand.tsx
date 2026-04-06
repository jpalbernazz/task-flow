import { CheckSquare } from "lucide-react"

export function LoginPageBrand() {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <CheckSquare className="h-5 w-5" />
      </div>
      <span className="text-2xl font-bold text-foreground">TaskFlow</span>
    </div>
  )
}
