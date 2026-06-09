import { cn } from '@/lib/cn'
import {
  LayoutDashboard,
  TrendingUp,
  Brain,
  PieChart,
  ArrowLeftRight,
  FlaskConical,
  GitBranch,
  Database,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Crosshair,
} from 'lucide-react'
import { useState } from 'react'

export type Panel = 'dashboard' | 'market' | 'agents' | 'portfolio' | 'trading' | 'smc' | 'quantlab' | 'workflows' | 'connectors' | 'settings'

const NAV_ITEMS: { id: Panel; icon: typeof LayoutDashboard; label: string; hotkey?: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', hotkey: '⌘1' },
  { id: 'market', icon: TrendingUp, label: 'Market Data', hotkey: '⌘2' },
  { id: 'agents', icon: Brain, label: 'AI Agents', hotkey: '⌘3' },
  { id: 'portfolio', icon: PieChart, label: 'Portfolio', hotkey: '⌘4' },
  { id: 'trading', icon: ArrowLeftRight, label: 'Trading', hotkey: '⌘5' },
  { id: 'smc', icon: Crosshair, label: 'SMC Strategy', hotkey: '⌘6' },
  { id: 'quantlab', icon: FlaskConical, label: 'Quant Lab', hotkey: '⌘7' },
  { id: 'workflows', icon: GitBranch, label: 'Workflows', hotkey: '⌘8' },
  { id: 'connectors', icon: Database, label: 'Connectors', hotkey: '⌘9' },
]

interface SidebarProps {
  activePanel: Panel
  onPanelChange: (panel: Panel) => void
}

export default function Sidebar({ activePanel, onPanelChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn('h-full flex flex-col border-r border-panel bg-panel-alt transition-all duration-300', collapsed ? 'w-16' : 'w-56')}>
      <div className="flex items-center gap-2 px-4 h-14 border-b border-panel shrink-0">
        <Zap className="w-5 h-5 text-primary shrink-0" />
        {!collapsed && <span className="text-sm font-bold tracking-wide text-foreground truncate">SMC</span>}
      </div>
      <nav className="flex-1 py-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon; const active = activePanel === item.id
          return (
            <button key={item.id} onClick={() => onPanelChange(item.id)} className={cn('w-full flex items-center gap-3 px-3 py-2 text-sm transition-all duration-150 hover:bg-secondary/60', active ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-muted-foreground')}>
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <><span className="flex-1 text-left">{item.label}</span>{item.hotkey && <span className="text-[10px] text-muted-foreground/50">{item.hotkey}</span>}</>}
            </button>
          )
        })}
      </nav>
      <div className="border-t border-panel p-2">
        <button onClick={() => onPanelChange('settings')} className={cn('w-full flex items-center gap-3 px-3 py-2 text-sm transition-all hover:bg-secondary/60', activePanel === 'settings' ? 'text-primary' : 'text-muted-foreground')}><Settings className="w-4 h-4 shrink-0" />{!collapsed && <span>Settings</span>}</button>
        <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center py-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors">{collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}</button>
      </div>
    </aside>
  )
}