import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const ScrollArea = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' | 'both' }>(({ className, orientation = 'vertical', children, ...props }, ref) => (
  <div ref={ref} className={cn('relative', orientation === 'vertical' && 'overflow-y-auto overflow-x-hidden', orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden', orientation === 'both' && 'overflow-auto', className)} {...props}>{children}</div>
))