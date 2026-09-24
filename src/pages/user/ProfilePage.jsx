import { useState } from 'react'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatDate } from '../../utils/format.js'
import { validateProfile } from '../../utils/validators.js'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
  })
  const [errors, setErrors] = useState({})

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    const nextErrors = validateProfile(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    await updateProfile(form)
    toast.success('Profil mis à jour.')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Profil</h1>
      <div className="mt-6 flex items-center gap-4">
        <img src={form.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
        <div>
          <p className="font-display text-xl font-semibold">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-zinc-400">Inscrit le {formatDate(user.createdAt)}</p>
        </div>
      </div>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nom" name="lastName" value={form.lastName} onChange={change} error={errors.lastName} />
          <Input label="Prénom" name="firstName" value={form.firstName} onChange={change} error={errors.firstName} />
        </div>
        <Input label="Email" name="email" value={form.email} onChange={change} error={errors.email} />
        <Input label="Téléphone" name="phone" value={form.phone} onChange={change} error={errors.phone} />
        <Input label="Photo de profil (URL)" name="avatar" value={form.avatar} onChange={change} />
        <Button type="submit">Enregistrer</Button>
      </form>
    </div>
  )
}
