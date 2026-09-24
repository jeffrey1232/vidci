import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import Input, { Select, Textarea } from '../../components/common/Input.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { videosService } from '../../services/videos.js'
import { SAMPLE_VIDEOS } from '../../utils/constants.js'
import { validateVideoForm } from '../../utils/validators.js'

const empty = {
  title: '',
  categoryId: '',
  thumbnail: '',
  videoUrl: SAMPLE_VIDEOS[0],
  price: '',
  type: 'paid',
  durationSeconds: 3600,
  author: '',
  status: 'published',
  publishedAt: '',
}

function toVideoForm(id) {
  if (!id) return empty
  const video = videosService.get(id, { includeDrafts: true })
  if (!video) return empty
  return {
    ...video,
    price: video.price,
    publishedAt: video.publishedAt ? video.publishedAt.slice(0, 16) : '',
  }
}

export default function AdminVideoFormPage() {
  const { id } = useParams()
  return <VideoForm key={id || 'new'} id={id} />
}

function VideoForm({ id }) {
  const isEdit = Boolean(id)
  const { categories } = useStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState(() => toVideoForm(id))
  const [errors, setErrors] = useState({})

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function readFile(file, key) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, [key]: reader.result }))
    reader.readAsDataURL(file)
  }

  async function submit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
    }
    const next = validateVideoForm(payload)
    setErrors(next)
    if (Object.keys(next).length) return
    if (isEdit) await videosService.update(id, payload)
    else await videosService.create(payload)
    toast.success(isEdit ? 'Vidéo mise à jour.' : 'Vidéo ajoutée.')
    navigate('/admin/videos')
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-display text-3xl font-bold">{isEdit ? 'Modifier la vidéo' : 'Ajouter une vidéo'}</h1>
      <Input label="Titre" name="title" value={form.title} onChange={change} error={errors.title} />
      <Select label="Catégorie" name="categoryId" value={form.categoryId} onChange={change} error={errors.categoryId}>
        <option value="">Choisir</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Input label="Auteur" name="author" value={form.author} onChange={change} error={errors.author} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Type" name="type" value={form.type} onChange={change}>
          <option value="free">Gratuit</option>
          <option value="paid">Payant</option>
        </Select>
        {form.type === 'paid' ? (
          <Input
            label="Prix de la vidéo (FCFA)"
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={change}
            error={errors.price}
          />
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Durée (secondes)"
          name="durationSeconds"
          type="number"
          value={form.durationSeconds}
          onChange={change}
          error={errors.durationSeconds}
        />
        <Select label="Statut" name="status" value={form.status} onChange={change}>
          <option value="draft">Brouillon</option>
          <option value="published">Publiée</option>
        </Select>
      </div>
      <Input
        label="Date de publication"
        name="publishedAt"
        type="datetime-local"
        value={form.publishedAt}
        onChange={change}
      />
      <div>
        <Input label="URL vidéo" name="videoUrl" value={form.videoUrl} onChange={change} error={errors.videoUrl} />
        <input
          type="file"
          accept="video/mp4,video/avi,video/mkv,video/webm,video/mov,video/*"
          className="mt-2 text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const url = URL.createObjectURL(file)
            setForm((f) => ({ ...f, videoUrl: url }))
            
            // Générer automatiquement une miniature
            const video = document.createElement('video')
            video.src = url
            video.muted = true
            video.crossOrigin = 'anonymous'
            video.currentTime = 1
            video.onloadeddata = () => {
              const canvas = document.createElement('canvas')
              canvas.width = video.videoWidth
              canvas.height = video.videoHeight
              const ctx = canvas.getContext('2d')
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
              const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
              setForm((f) => ({ ...f, thumbnail }))
            }
          }}
        />
        {form.videoUrl ? (
          <video src={form.videoUrl} controls className="mt-3 aspect-video w-full rounded-xl bg-black" />
        ) : null}
        {form.thumbnail ? (
          <div className="mt-3">
            <p className="mb-2 text-sm text-zinc-400">Miniature générée automatiquement :</p>
            <img src={form.thumbnail} alt="Miniature" className="h-36 rounded-xl object-cover" />
          </div>
        ) : null}
      </div>
      <Button type="submit">{isEdit ? 'Enregistrer' : 'Ajouter'}</Button>
    </form>
  )
}
