import { useState, type FormEvent } from "react"
import { getErrorMessage } from "@/lib/get-error-message"
import { requestPasswordReset } from "@/services/auth-service"

function normalizeResetUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  if (typeof window === "undefined") {
    return url
  }

  return new URL(url, window.location.origin).toString()
}

export function useForgotPasswordPageController() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [resetUrl, setResetUrl] = useState<string | null>(null)
  const [isCopying, setIsCopying] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      const result = await requestPasswordReset({ email })
      setInfoMessage(result.message)
      setResetUrl(normalizeResetUrl(result.resetUrl))
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível iniciar a recuperação de senha."))
      setInfoMessage(null)
      setResetUrl(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyResetUrl = async () => {
    if (!resetUrl || isCopying || typeof navigator === "undefined" || !navigator.clipboard) {
      return
    }

    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(resetUrl)
      setInfoMessage("Link copiado para a área de transferência.")
    } catch {
      setErrorMessage("Não foi possível copiar o link.")
    } finally {
      setIsCopying(false)
    }
  }

  return {
    email,
    isSubmitting,
    errorMessage,
    infoMessage,
    resetUrl,
    isCopying,
    setEmail,
    handleSubmit,
    handleCopyResetUrl,
  }
}
