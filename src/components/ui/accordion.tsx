import { useState, createContext, useContext, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const AccordionContext = createContext<{ openItem: string | null; setOpenItem: (v: string | null) => void }>({ openItem: null, setOpenItem: () => {} })

export function Accordion({ children, className }: { children: ReactNode; className?: string }) {
  const [openItem, setOpenItem] = useState<string | null>(null)
  return (<AccordionContext.Provider value={{ openItem, setOpenItem }}><div className={cn('space-y-1', className)}>{children}</div></AccordionContext.Provider>)
}

export function AccordionItem({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  return (<div className={cn('border-b border-border', className)}>{children}</div>)
}

export function AccordionTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { openItem, setOpenItem } = useContext(AccordionContext)
  const isOpen = openItem === value
  return (<button onClick={() => setOpenItem(isOpen ? null : value)} className={cn('flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180', className)}>{children}<svg className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>)
}

export function AccordionContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { openItem } = useContext(AccordionContext)
  if (openItem !== value) return null
  return (<div className={cn('pb-4 text-sm', className)}>{children}</div>)
}