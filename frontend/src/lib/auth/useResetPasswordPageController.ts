import { useMemo, useState, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import { getErrorMessage } from "@/lib/get-error-message"
import { confirmResetPassword } from "@/services/auth-service"

export function useResetPasswordPageController() {
  const searchParams = useSearchParams()
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams])

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token) {
      setErrorMessage("Token de redefinição ausente ou inválido.")
      setInfoMessage(null)
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("A confirmação de senha não confere.")
      setInfoMessage(null)
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      const message = await confirmResetPassword({ token, newPassword })
      setInfoMessage(message)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível redefinir a senha."))
      setInfoMessage(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    token,
    newPassword,
    confirmPassword,
    isSubmitting,
    errorMessage,
    infoMessage,
    setNewPassword,
    setConfirmPassword,
    handleSubmit,
  }
}
