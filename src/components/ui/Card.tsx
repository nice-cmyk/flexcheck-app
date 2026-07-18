import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  highlighted?: boolean
}

export default function Card({ children, highlighted, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-surface/80 border rounded-2xl ${
        highlighted ? 'border-primary shadow-[0_0_30px_rgba(124,58,237,0.3)]' : 'border-primary/15'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
