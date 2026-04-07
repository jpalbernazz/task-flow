import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { getErrorMessage } from "@/lib/get-error-message"
import { login } from "@/services/auth-service"

export function useLoginPageController() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      await login({ email, password })
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível fazer login."))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    email,
    password,
    isSubmitting,
    errorMessage,
    setEmail,
    setPassword,
    handleSubmit,
  }
}
