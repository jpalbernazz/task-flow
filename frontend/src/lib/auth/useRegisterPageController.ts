import { useState, type FormEvent } from "react"
import { getErrorMessage } from "@/lib/get-error-message"
import { registerAccount } from "@/services/auth-service"

export function useRegisterPageController() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setErrorMessage("A confirmação de senha não confere.")
      setInfoMessage(null)
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      const message = await registerAccount({ name, email, password })
      setInfoMessage(message)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível criar sua conta."))
      setInfoMessage(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    name,
    email,
    password,
    confirmPassword,
    isSubmitting,
    errorMessage,
    infoMessage,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  }
}
