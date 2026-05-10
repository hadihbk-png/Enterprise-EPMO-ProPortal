export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-400',
    ghost: 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10',
  }

  return (
    <button
      type="button"
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
