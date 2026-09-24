import { Link, useParams } from 'react-router-dom'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { categoriesService } from '../../services/categories.js'
import { videosService } from '../../services/videos.js'
import { formatDate, formatDuration, formatFcfa } from '../../utils/format.js'

export default function AdminVideoDetailPage() {
  const { id } = useParams()
  const video = videosService.get(id, { includeDrafts: true })
  const category = video ? categoriesService.get(video.categoryId) : null

  if (!video) return <EmptyState title="Vidéo introuvable" />

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <img src={video.thumbnail} alt="" className="aspect-video w-full rounded-2xl object-cover" />
      <div className="flex flex-wrap gap-2">
        <Badge tone={video.status === 'published' ? 'published' : 'draft'}>
          {video.status === 'published' ? 'Publiée' : 'Brouillon'}
        </Badge>
        <Badge tone={video.type === 'paid' ? 'paid' : 'free'}>{video.type === 'paid' ? 'Payant' : 'Gratuit'}</Badge>
      </div>
      <h1 className="font-display text-3xl font-bold">{video.title}</h1>
      <dl className="grid gap-3 sm:grid-cols-2 text-sm">
        <Row label="Catégorie" value={category?.name} />
        <Row label="Prix" value={video.type === 'paid' ? formatFcfa(video.price) : 'Gratuit'} />
        <Row label="Ventes" value={video.salesCount} />
        <Row label="Vues" value={video.views} />
        <Row label="Durée" value={formatDuration(video.durationSeconds)} />
        <Row label="Auteur" value={video.author} />
        <Row label="Publication" value={formatDate(video.publishedAt)} />
      </dl>
      <Button as={Link} to={`/admin/videos/${video.id}/modifier`}>
        Modifier
      </Button>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}
