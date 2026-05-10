export default function Badge({ children, color = '#6366f1' }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}18`,
      }}
    >
      {children}
    </span>
  )
}
