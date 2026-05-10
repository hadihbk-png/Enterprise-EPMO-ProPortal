export default function PageWrapper({ title, eyebrow, description, accent, children }) {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
      </div>
      {children}
    </section>
  )
}
