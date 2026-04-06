import { useState, type FormEvent } from "react"

const MOCK_AUTH_DELAY_MS = 1500

export function useLoginPageController() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, MOCK_AUTH_DELAY_MS))
    setIsSubmitting(false)
  }

  return {
    email,
    password,
    isSubmitting,
    setEmail,
    setPassword,
    handleSubmit,
  }
}
