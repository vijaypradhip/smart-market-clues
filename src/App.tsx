import Sidebar, { type Panel } from '@/components/Sidebar'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'
import MarketData from '@/components/MarketData'
import AIAgents from '@/components/AIAgents'
import Portfolio from '@/components/Portfolio'
import Trading from '@/components/Trading'
import SMCStrategy from '@/components/SMCStrategy'
import QuantLab from '@/components/QuantLab'
import Workflows from '@/components/Workflows'
import Connectors from '@/components/Connectors'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings as SettingsIcon, Moon, Bell, Shield, Key, Monitor, Zap } from 'lucide-react'
import { useState } from 'react'

function SettingsPanel() {
  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><SettingsIcon className="w-5 h-5 text-primary" />Settings</h2>
        <p className="text-xs text-muted-foreground">Configure Smart Market Clues terminal</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase flex items-center gap-1"><Monitor className="w-3 h-3" />Appearance</CardTitle></CardHeader><CardContent className="space-y-2">
          {['Theme', 'Font Size', 'Chart Style', 'Layout'].map((s) => (<div key={s} className="flex items-center justify-between text-[11px] py-1"><span className="text-muted-foreground">{s}</span><Badge variant="outline" className="text-[9px] border-panel">Default</Badge></div>))}
        </CardContent></Card>
        <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase flex items-center gap-1"><Key className="w-3 h-3" />API Keys</CardTitle></CardHeader><CardContent className="space-y-2">
          {['Yahoo Finance', 'Polygon.io', 'Kraken', 'FRED'].map((k) => (<div key={k} className="flex items-center justify-between text-[11px] py-1"><span className="text-muted-foreground">{k}</span><Badge variant="outline" className="text-[9px] border-gain/30 text-gain">Active</Badge></div>))}
        </CardContent></Card>
        <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase flex items-center gap-1"><Bell className="w-3 h-3" />Notifications</CardTitle></CardHeader><CardContent className="space-y-2">
          {['Price Alerts', 'AI Signals', 'Order Fills', 'Risk Warnings'].map((n) => (<div key={n} className="flex items-center justify-between text-[11px] py-1"><span className="text-muted-foreground">{n}</span><Badge variant="outline" className="text-[9px] border-gain/30 text-gain">On</Badge></div>))}
        </CardContent></Card>
        <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase flex items-center gap-1"><Shield className="w-3 h-3" />Security</CardTitle></CardHeader><CardContent className="space-y-2">
          {['Two-Factor Auth', 'Session Timeout', 'API Rate Limits', 'IP Whitelist'].map((s) => (<div key={s} className="flex items-center justify-between text-[11px] py-1"><span className="text-muted-foreground">{s}</span><Badge variant="outline" className="text-[9px] border-panel">Configure</Badge></div>))}
        </CardContent></Card>
      </div>
      <Card className="bg-panel border-panel"><CardContent className="p-4 flex items-center justify-between"><div><h4 className="text-sm font-medium text-foreground flex items-center gap-1"><Zap className="w-4 h-4 text-primary" />Smart Market Clues v1.0</h4><p className="text-[10px] text-muted-foreground mt-0.5">Professional AI-powered financial terminal</p></div><Button variant="outline" size="sm" className="text-[10px] border-panel">Check for Updates</Button></CardContent></Card>
    </div>
  )
}

export default function App() {
  const [panel, setPanel] = useState<Panel>('dashboard')
  const renderPanel = () => {
    switch (panel) {
      case 'dashboard': return <Dashboard />
      case 'market': return <MarketData />
      case 'agents': return <AIAgents />
      case 'portfolio': return <Portfolio />
      case 'trading': return <Trading />
      case 'smc': return <SMCStrategy />
      case 'quantlab': return <QuantLab />
      case 'workflows': return <Workflows />
      case 'connectors': return <Connectors />
      case 'settings': return <SettingsPanel />
      default: return <Dashboard />
    }
  }
  return (
    <div className="h-screen w-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar activePanel={panel} onPanelChange={setPanel} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden">{renderPanel()}</main>
      </div>
    </div>
  )
}