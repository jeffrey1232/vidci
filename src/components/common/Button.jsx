import { cn } from '../../utils/format.js'

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  const variants = {
    primary:
      'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-300 hover:to-pink-300 shadow-lg shadow-purple-400/20',
    secondary:
      'bg-white/60 text-ink-900 hover:bg-white/80 border border-purple-200/50 backdrop-blur-sm',
    ghost: 'bg-transparent text-ink-700 hover:bg-purple-100/50',
    gold: 'bg-gradient-to-r from-amber-300 to-yellow-400 text-ink-900 hover:from-amber-200 hover:to-yellow-300 font-semibold shadow-lg shadow-amber-400/20',
    danger: 'bg-gradient-to-r from-rose-400 to-red-400 text-white hover:from-rose-300 hover:to-red-300 shadow-lg shadow-rose-400/20',
    outline:
      'border-2 border-purple-200 bg-transparent text-ink-900 hover:border-purple-400 hover:bg-purple-50',
  }
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  }

  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
