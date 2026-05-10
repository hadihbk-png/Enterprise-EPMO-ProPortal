export default function Card({ children, className = '' }) {
  return <div className={`glass-card p-5 shadow-2xl shadow-black/20 ${className}`}>{children}</div>
}
