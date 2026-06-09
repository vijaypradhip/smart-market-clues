import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} type="checkbox" className={cn('h-4 w-4 shrink-0 rounded border border-primary', className)} {...props} />
))