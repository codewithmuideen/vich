export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-forest">{title}</h1>
        {description && <p className="mt-1 font-body text-sm text-dark/60">{description}</p>}
      </div>
      {action}
    </div>
  )
}
