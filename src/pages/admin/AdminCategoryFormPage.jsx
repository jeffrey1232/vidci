import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import Input, { Textarea } from '../../components/common/Input.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { categoriesService } from '../../services/categories.js'
import { validateCategoryForm } from '../../utils/validators.js'

const empty = { name: '', description: '', image: '' }

function toCategoryForm(id) {
  if (!id) return empty
  const category = categoriesService.get(id)
  if (!category) return empty
  return { name: category.name, description: category.description, image: category.image }
}

export default function AdminCategoryFormPage() {
  const { id } = useParams()
  return <CategoryForm key={id || 'new'} id={id} />
}

function CategoryForm({ id }) {
  const isEdit = Boolean(id)
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState(() => toCategoryForm(id))
  const [errors, setErrors] = useState({})

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    const next = validateCategoryForm(form)
    setErrors(next)
    if (Object.keys(next).length) return
    if (isEdit) await categoriesService.update(id, form)
    else await categoriesService.create(form)
    toast.success(isEdit ? 'Catégorie mise à jour.' : 'Catégorie créée.')
    navigate('/admin/categories')
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4">
      <h1 className="font-display text-3xl font-bold">
        {isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      </h1>
      <Input label="Nom" name="name" value={form.name} onChange={change} error={errors.name} />
      <Textarea
        label="Description"
        name="description"
        value={form.description}
        onChange={change}
        error={errors.description}
      />
      <Input label="Image (URL)" name="image" value={form.image} onChange={change} error={errors.image} />
      <input
        type="file"
        accept="image/*"
        className="text-sm"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = () => setForm((f) => ({ ...f, image: reader.result }))
          reader.readAsDataURL(file)
        }}
      />
      {form.image ? <img src={form.image} alt="Aperçu" className="h-40 rounded-xl object-cover" /> : null}
      <Button type="submit">{isEdit ? 'Enregistrer' : 'Créer'}</Button>
    </form>
  )
}
