import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Database, Search, CheckCircle2, XCircle, RefreshCw, Globe, Lock, Unlock, Zap, ExternalLink, Clock } from 'lucide-react'
import { useState } from 'react'

const CONNECTORS = [
  { name: 'Yahoo Finance', category: 'Markets', status: 'connected', latency: '45ms', requests: '12.4K/day', desc: 'Real-time & historical market data' },
  { name: 'Polygon.io', category: 'Markets', status: 'connected', latency: '12ms', requests: '8.2K/day', desc: 'Real-time stock, options, crypto data' },
  { name: 'Kraken', category: 'Crypto', status: 'connected', latency: '28ms', requests: '5.6K/day', desc: 'Crypto exchange WebSocket & REST' },
  { name: 'FRED', category: 'Economic', status: 'connected', latency: '120ms', requests: '340/day', desc: 'Federal Reserve Economic Data' },
  { name: 'IMF Data', category: 'Economic', status: 'disconnected', latency: '—', requests: '—', desc: 'International Monetary Fund datasets' },
  { name: 'World Bank', category: 'Economic', status: 'disconnected', latency: '—', requests: '—', desc: 'Global development indicators' },
  { name: 'Alpha Vantage', category: 'Markets', status: 'error', latency: '—', requests: '—', desc: 'Stock, forex, crypto technical indicators' },
  { name: 'NewsAPI', category: 'News', status: 'connected', latency: '85ms', requests: '2.1K/day', desc: 'Global news aggregation' },
  { name: 'Quandl', category: 'Alternative', status: 'connected', latency: '95ms', requests: '890/day', desc: 'Alternative & financial datasets' },
  { name: 'HyperLiquid', category: 'Crypto', status: 'connected', latency: '8ms', requests: '15.3K/day', desc: 'Decentralized perpetuals exchange' },
  { name: 'CoinGecko', category: 'Crypto', status: 'connected', latency: '65ms', requests: '4.5K/day', desc: 'Crypto market data & metadata' },
  { name: 'DBnomics', category: 'Economic', status: 'disconnected', latency: '—', requests: '—', desc: 'Open data from central banks' },
  { name: 'AkShare', category: 'Markets', status: 'disconnected', latency: '—', requests: '—', desc: 'Chinese financial data API' },
  { name: 'Fyers', category: 'Broker', status: 'connected', latency: '32ms', requests: '1.8K/day', desc: 'Indian stock broker API' },
  { name: 'Zerodha Kite', category: 'Broker', status: 'disconnected', latency: '—', requests: '—', desc: 'Indian broker Kite Connect API' },
  { name: 'Angel One', category: 'Broker', status: 'disconnected', latency: '—', requests: '—', desc: 'Indian broker SmartAPI' },
]
const CATEGORY_COLORS: Record<string, string> = { Markets: '#65d0a5', Crypto: '#e8a838', Economic: '#6b8aff', News: '#c76dff', Alternative: '#ff6b8a', Broker: '#4aa88a' }

export default function Connectors() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', ...new Set(CONNECTORS.map((c) => c.category))]
  const filtered = CONNECTORS.filter((c) => (selectedCategory === 'All' || c.category === selectedCategory) && (c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())))
  const connected = CONNECTORS.filter((c) => c.status === 'connected').length
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Database className="w-5 h-5 text-primary" />Data Connectors</h2><p className="text-xs text-muted-foreground">100+ data sources for market intelligence</p></div>
        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary"><Zap className="w-2.5 h-2.5 mr-1" />{connected}/{CONNECTORS.length} Connected</Badge>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-panel border-panel"><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-primary">{connected}</p><p className="text-[10px] text-muted-foreground">Active</p></CardContent></Card>
        <Card className="bg-panel border-panel"><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-foreground">{CONNECTORS.length - connected}</p><p className="text-[10px] text-muted-foreground">Available</p></CardContent></Card>
        <Card className="bg-panel border-panel"><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-gain">47K</p><p className="text-[10px] text-muted-foreground">Requests Today</p></CardContent></Card>
        <Card className="bg-panel border-panel"><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-foreground">45ms</p><p className="text-[10px] text-muted-foreground">Avg Latency</p></CardContent></Card>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" /><Input placeholder="Search connectors..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 text-xs pl-7 bg-secondary border-panel" /></div>
        <div className="flex gap-1">{categories.map((cat) => (<Button key={cat} variant={selectedCategory === cat ? 'default' : 'outline'} size="sm" className={`h-7 text-[10px] ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'border-panel'}`} onClick={() => setSelectedCategory(cat)}>{cat}</Button>))}</div>
      </div>
      <div className="grid grid-cols-3 gap-3">{filtered.map((c, i) => (
        <Card key={i} className="bg-panel border-panel hover:border-primary/20 transition-colors"><CardContent className="p-3">
          <div className="flex items-start justify-between mb-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"><Globe className="w-4 h-4 text-muted-foreground" /></div><div><h4 className="text-xs font-medium text-foreground">{c.name}</h4><Badge variant="outline" className="text-[8px] mt-0.5" style={{ borderColor: (CATEGORY_COLORS[c.category] || '#666') + '40', color: CATEGORY_COLORS[c.category] || '#666' }}>{c.category}</Badge></div></div><div className={`w-2 h-2 rounded-full mt-1 ${c.status === 'connected' ? 'bg-gain' : c.status === 'error' ? 'bg-loss' : 'bg-muted-foreground/30'}`} /></div>
          <p className="text-[10px] text-muted-foreground mb-2">{c.desc}</p>
          {c.status === 'connected' && <div className="flex items-center gap-3 text-[9px] text-muted-foreground mb-2"><span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{c.latency}</span><span>{c.requests}</span></div>}
          <div className="flex gap-1"><Button variant="outline" size="sm" className={`h-6 text-[9px] flex-1 border-panel ${c.status === 'connected' ? 'text-gain border-gain/30' : ''}`}>
            {c.status === 'connected' ? <><CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Connected</> : c.status === 'error' ? <><RefreshCw className="w-2.5 h-2.5 mr-1" /> Retry</> : <><Unlock className="w-2.5 h-2.5 mr-1" /> Connect</>}
          </Button><Button variant="outline" size="sm" className="h-6 w-6 p-0 border-panel"><ExternalLink className="w-2.5 h-2.5" /></Button></div>
        </CardContent></Card>
      ))}</div>
    </div>
  )
}