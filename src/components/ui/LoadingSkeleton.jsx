export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="glass-card h-20 animate-pulse bg-white/[0.04]" />
      ))}
    </div>
  )
}
