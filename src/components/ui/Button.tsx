import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'text'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  fullWidth?: boolean
}

const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary: 'bg-primary hover:bg-[#6D28D9] text-white px-6 py-3',
  ghost: 'border border-white/15 hover:border-white/30 text-white px-6 py-3',
  text: 'text-accent hover:text-primary-light font-medium px-0 py-0',
}

export default function Button({ variant = 'primary', children, fullWidth, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
