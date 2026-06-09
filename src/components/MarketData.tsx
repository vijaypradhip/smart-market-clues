import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Star, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const generateChartData = (trend: 'up' | 'down' | 'flat') => {
  const data = []
  let base = trend === 'up' ? 100 : trend === 'down' ? 200 : 150
  for (let i = 0; i < 60; i++) {
    const change = trend === 'up' ? Math.random() * 4 - 1 : trend === 'down' ? Math.random() * 4 - 3 : Math.random() * 4 - 2
    base += change
    data.push({ time: `${i}`, price: parseFloat(base.toFixed(2)) })
  }
  return data
}

const WATCHLIST = [
  { sym: 'AAPL', name: 'Apple Inc', price: 198.45, change: 0.82, data: generateChartData('up') },
  { sym: 'GOOGL', name: 'Alphabet Inc', price: 178.92, change: -0.45, data: generateChartData('down') },
  { sym: 'MSFT', name: 'Microsoft', price: 452.30, change: 1.23, data: generateChartData('up') },
  { sym: 'AMZN', name: 'Amazon', price: 198.45, change: 4.12, data: generateChartData('up') },
  { sym: 'NVDA', name: 'NVIDIA', price: 142.85, change: 5.67, data: generateChartData('up') },
  { sym: 'TSLA', name: 'Tesla Inc', price: 387.20, change: -3.42, data: generateChartData('down') },
  { sym: 'RELIANCE', name: 'Reliance Ind', price: 1456.20, change: 2.89, data: generateChartData('up') },
  { sym: 'TCS', name: 'Tata Consult', price: 3892.50, change: -0.87, data: generateChartData('flat') },
]

const ORDER_BOOK = {
  asks: [{ price: 198.52, qty: 1200, total: 14400 }, { price: 198.50, qty: 800, total: 22400 }, { price: 198.48, qty: 2100, total: 43400 }, { price: 198.46, qty: 500, total: 48400 }, { price: 198.44, qty: 3200, total: 80400 }],
  bids: [{ price: 198.42, qty: 1500, total: 1500 }, { price: 198.40, qty: 900, total: 2400 }, { price: 198.38, qty: 2800, total: 5200 }, { price: 198.36, qty: 600, total: 5800 }, { price: 198.34, qty: 4100, total: 9900 }],
}

const TIME_SALES = [
  { time: '14:32:15', price: 198.45, qty: 200, side: 'buy' as const },
  { time: '14:32:14', price: 198.44, qty: 50, side: 'sell' as const },
  { time: '14:32:13', price: 198.45, qty: 300, side: 'buy' as const },
  { time: '14:32:12', price: 198.43, qty: 150, side: 'sell' as const },
  { time: '14:32:11', price: 198.45, qty: 800, side: 'buy' as const },
  { time: '14:32:10', price: 198.42, qty: 100, side: 'sell' as const },
]

export default function MarketData() {
  const [selected, setSelected] = useState('AAPL')
  const [search, setSearch] = useState('')
  const [chartData, setChartData] = useState(generateChartData('up'))
  const asset = WATCHLIST.find((w) => w.sym === selected) || WATCHLIST[0]

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const last = prev[prev.length - 1].price
        const newPrice = last + (Math.random() * 2 - 1)
        return [...prev.slice(1), { time: String(prev.length), price: parseFloat(newPrice.toFixed(2)) }]
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [selected])

  const filtered = WATCHLIST.filter((w) => w.sym.toLowerCase().includes(search.toLowerCase()) || w.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="h-full flex">
      <div className="w-64 border-r border-panel flex flex-col shrink-0">
        <div className="p-3 border-b border-panel">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Search symbol..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 text-xs pl-7 bg-secondary border-panel" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((w) => (
            <button key={w.sym} onClick={() => setSelected(w.sym)} className={`w-full px-3 py-2 text-left text-xs border-b border-panel/50 transition-colors ${selected === w.sym ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-secondary/40'}`}>
              <div className="flex items-center justify-between">
                <div><span className="font-medium text-foreground">{w.sym}</span><p className="text-[10px] text-muted-foreground truncate">{w.name}</p></div>
                <div className="text-right"><p className="text-[11px] text-foreground">${w.price.toFixed(2)}</p><p className={w.change >= 0 ? 'text-[10px] text-gain' : 'text-[10px] text-loss'}>{w.change >= 0 ? '+' : ''}{w.change}%</p></div>
              </div>
              <div className="mt-1 h-6"><ResponsiveContainer width="100%" height="100%"><LineChart data={w.data.slice(-20)}><Line type="monotone" dataKey="price" stroke={w.change >= 0 ? '#65d0a5' : '#e8636f'} strokeWidth={1} dot={false} /></LineChart></ResponsiveContainer></div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-panel flex items-center justify-between">
          <div className="flex items-center gap-3"><h2 className="text-sm font-bold text-foreground">{asset.sym}</h2><span className="text-xs text-muted-foreground">{asset.name}</span></div>
          <div className="flex items-center gap-4"><span className="text-lg font-bold text-foreground">${asset.price.toFixed(2)}</span><span className={asset.change >= 0 ? 'text-sm font-medium text-gain' : 'text-sm font-medium text-loss'}>{asset.change >= 0 ? '+' : ''}{asset.change}%</span></div>
        </div>
        <div className="flex-1 p-3 overflow-y-auto">
          <Tabs defaultValue="chart" className="h-full">
            <TabsList className="h-7 bg-secondary border border-panel">
              <TabsTrigger value="chart" className="text-[10px] h-5 px-3">Chart</TabsTrigger>
              <TabsTrigger value="orderbook" className="text-[10px] h-5 px-3">Order Book</TabsTrigger>
              <TabsTrigger value="trades" className="text-[10px] h-5 px-3">Time & Sales</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-2 h-[calc(100%-2.5rem)]">
              <Card className="bg-panel border-panel h-full"><CardContent className="p-3 h-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#1e2a2a" /><XAxis dataKey="time" tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} /><Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} formatter={(v: number) => [`$${v.toFixed(2)}`, 'Price']} /><Line type="monotone" dataKey="price" stroke="#65d0a5" strokeWidth={1.5} dot={false} /></LineChart></ResponsiveContainer></CardContent></Card>
            </TabsContent>
            <TabsContent value="orderbook" className="mt-2 h-[calc(100%-2.5rem)]">
              <Card className="bg-panel border-panel h-full"><CardContent className="p-3"><div className="grid grid-cols-2 gap-3 h-full">
                <div><h4 className="text-[10px] text-gain font-medium uppercase mb-2">Bids</h4><div className="space-y-0.5">{ORDER_BOOK.bids.map((b, i) => (<div key={i} className="flex items-center text-[11px] font-mono relative"><div className="absolute inset-0 bg-gain/5" style={{ width: `${(b.total / 9900) * 100}%` }} /><span className="flex-1 text-gain relative z-10">${b.price.toFixed(2)}</span><span className="flex-1 text-right text-muted-foreground relative z-10">{b.qty.toLocaleString()}</span></div>))}</div></div>
                <div><h4 className="text-[10px] text-loss font-medium uppercase mb-2">Asks</h4><div className="space-y-0.5">{ORDER_BOOK.asks.map((a, i) => (<div key={i} className="flex items-center text-[11px] font-mono relative"><div className="absolute inset-0 bg-loss/5" style={{ width: `${(a.total / 80400) * 100}%` }} /><span className="flex-1 text-loss relative z-10">${a.price.toFixed(2)}</span><span className="flex-1 text-right text-muted-foreground relative z-10">{a.qty.toLocaleString()}</span></div>))}</div></div>
              </div></CardContent></Card>
            </TabsContent>
            <TabsContent value="trades" className="mt-2 h-[calc(100%-2.5rem)]">
              <Card className="bg-panel border-panel h-full"><CardContent className="p-3"><div className="space-y-0.5">
                <div className="flex items-center text-[10px] text-muted-foreground font-medium uppercase pb-1 border-b border-panel"><span className="w-20">Time</span><span className="flex-1">Price</span><span className="flex-1 text-right">Qty</span></div>
                {TIME_SALES.map((t, i) => (<div key={i} className="flex items-center text-[11px] font-mono py-0.5"><span className="w-20 text-muted-foreground">{t.time}</span><span className={t.side === 'buy' ? 'flex-1 text-gain' : 'flex-1 text-loss'}>${t.price.toFixed(2)}</span><span className="flex-1 text-right text-muted-foreground">{t.qty}</span></div>))}
              </div></CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}