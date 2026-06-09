import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PieChart as PieChartIcon, TrendingUp, TrendingDown, AlertTriangle, Shield, Target, Activity } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'

const POSITIONS = [
  { sym: 'AAPL', name: 'Apple Inc', qty: 150, avg: 182.30, current: 198.45, sector: 'Tech', weight: 12.1 },
  { sym: 'MSFT', name: 'Microsoft', qty: 80, avg: 420.15, current: 452.30, sector: 'Tech', weight: 14.6 },
  { sym: 'NVDA', name: 'NVIDIA', qty: 200, avg: 125.40, current: 142.85, sector: 'Tech', weight: 11.5 },
  { sym: 'RELIANCE', name: 'Reliance', qty: 45, avg: 1380.20, current: 1456.20, sector: 'Energy', weight: 26.4 },
  { sym: 'JNJ', name: 'Johnson & J', qty: 100, avg: 155.80, current: 162.40, sector: 'Healthcare', weight: 6.6 },
  { sym: 'TCS', name: 'Tata Consult', qty: 25, avg: 3750.00, current: 3892.50, sector: 'Tech', weight: 39.2 },
  { sym: 'GOLD', name: 'Gold ETF', qty: 500, avg: 3100.00, current: 3245.90, sector: 'Commodity', weight: 16.3 },
]
const EQUITY_CURVE = Array.from({ length: 60 }, (_, i) => ({ day: i, value: 200000 + Math.sin(i / 10) * 15000 + i * 800 + Math.random() * 5000 }))
const DRAWDOWN = EQUITY_CURVE.map((e, i) => ({ day: i, dd: -(Math.random() * 8 + (i > 30 && i < 45 ? 12 : 0)) }))
const RISK_METRICS = { sharpe: 1.82, sortino: 2.34, maxDrawdown: -12.4, volatility: 14.2, beta: 0.92, alpha: 3.4, var95: -2.8, var99: -4.2, cvar: -3.6, trackingError: 5.1, informationRatio: 0.67, calmar: 1.47 }
const RISK_DATA = [{ metric: 'Sharpe', value: 1.82 }, { metric: 'Sortino', value: 2.34 }, { metric: 'Calmar', value: 1.47 }, { metric: 'Alpha', value: 3.4 }, { metric: 'Beta', value: 0.92 }]
const SECTOR_COLORS: Record<string, string> = { Tech: '#65d0a5', Energy: '#e8a838', Healthcare: '#6b8aff', Commodity: '#c76dff' }

export default function Portfolio() {
  const totalValue = POSITIONS.reduce((s, p) => s + p.qty * p.current, 0)
  const totalPnL = POSITIONS.reduce((s, p) => s + p.qty * (p.current - p.avg), 0)
  const sectorData = Object.entries(POSITIONS.reduce((acc, p) => { acc[p.sector] = (acc[p.sector] || 0) + p.qty * p.current; return acc }, {} as Record<string, number>)).map(([name, value]) => ({ name, value: parseFloat((value / totalValue * 100).toFixed(1)) }))
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-foreground">Portfolio Analytics</h2><p className="text-xs text-muted-foreground">Real-time risk & performance metrics</p></div>
        <div className="flex items-center gap-4">
          <div className="text-right"><p className="text-xs text-muted-foreground">Total Value</p><p className="text-lg font-bold text-foreground">${totalValue.toLocaleString()}</p></div>
          <div className="text-right"><p className="text-xs text-muted-foreground">Total P&L</p><p className={`text-lg font-bold ${totalPnL >= 0 ? 'text-gain' : 'text-loss'}`}>{totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[['Sharpe Ratio', RISK_METRICS.sharpe.toFixed(2), 'text-primary'], ['Max Drawdown', `${RISK_METRICS.maxDrawdown}%`, 'text-loss'], ['Volatility', `${RISK_METRICS.volatility}%`, 'text-yellow-400'], ['VaR (95%)', `${RISK_METRICS.var95}%`, 'text-loss']].map(([l, v, c]) => (
          <Card key={String(l)} className="bg-panel border-panel"><CardContent className="p-3 flex items-center gap-2"><Target className={`w-4 h-4 ${c}`} /><div><p className="text-[10px] text-muted-foreground">{String(l)}</p><p className="text-sm font-bold text-foreground">{v}</p></div></CardContent></Card>
        ))}
      </div>
      <Tabs defaultValue="positions">
        <TabsList className="h-7 bg-secondary border border-panel">
          <TabsTrigger value="positions" className="text-[10px] h-5 px-3">Positions</TabsTrigger>
          <TabsTrigger value="performance" className="text-[10px] h-5 px-3">Performance</TabsTrigger>
          <TabsTrigger value="risk" className="text-[10px] h-5 px-3">Risk Analysis</TabsTrigger>
          <TabsTrigger value="allocation" className="text-[10px] h-5 px-3">Allocation</TabsTrigger>
        </TabsList>
        <TabsContent value="positions"><Card className="bg-panel border-panel"><CardContent className="p-3"><div className="space-y-1">
          <div className="flex items-center text-[10px] text-muted-foreground font-medium uppercase pb-1 border-b border-panel"><span className="w-20">Symbol</span><span className="w-24 text-right">Qty</span><span className="w-20 text-right">Avg Cost</span><span className="w-20 text-right">Current</span><span className="flex-1 text-right">P&L</span><span className="w-16 text-right">Weight</span></div>
          {POSITIONS.map((p) => { const pnl = (p.current - p.avg) * p.qty; const pnlP = ((p.current - p.avg) / p.avg) * 100
            return (<div key={p.sym} className="flex items-center text-[11px] py-1.5 hover:bg-secondary/30 rounded px-1"><span className="w-20"><span className="font-medium text-foreground">{p.sym}</span><p className="text-[9px] text-muted-foreground">{p.name}</p></span><span className="w-24 text-right text-muted-foreground">{p.qty}</span><span className="w-20 text-right text-muted-foreground">${p.avg.toFixed(2)}</span><span className="w-20 text-right text-foreground">${p.current.toFixed(2)}</span><span className={`flex-1 text-right font-medium ${pnl >= 0 ? 'text-gain' : 'text-loss'}`}>{pnl >= 0 ? '+' : ''}${pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span className="text-[9px] ml-1">({pnlP >= 0 ? '+' : ''}{pnlP.toFixed(1)}%)</span></span><span className="w-16 text-right text-muted-foreground">{p.weight}%</span></div>)
          })}
        </div></CardContent></Card></TabsContent>
        <TabsContent value="performance"><div className="grid grid-cols-2 gap-3">
          <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase">Equity Curve</CardTitle></CardHeader><CardContent className="h-52"><ResponsiveContainer width="100%" height="100%"><LineChart data={EQUITY_CURVE}><XAxis dataKey="day" tick={{ fontSize: 9, fill: '#666' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 9, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} /><Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} /><Line type="monotone" dataKey="value" stroke="#65d0a5" strokeWidth={1.5} dot={false} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase">Drawdown</CardTitle></CardHeader><CardContent className="h-52"><ResponsiveContainer width="100%" height="100%"><BarChart data={DRAWDOWN}><XAxis dataKey="day" tick={{ fontSize: 9, fill: '#666' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 9, fill: '#666' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} /><Bar dataKey="dd" fill="#e8636f" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div></TabsContent>
        <TabsContent value="risk"><div className="grid grid-cols-2 gap-3">
          <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase">Risk Metrics</CardTitle></CardHeader><CardContent className="space-y-2">
            {Object.entries(RISK_METRICS).map(([k, v]) => (<div key={k} className="flex items-center justify-between text-[11px]"><span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, ' $1')}</span><span className={`font-mono font-medium ${k.includes('Drawdown') || k.includes('var') || k.includes('cvar') ? 'text-loss' : 'text-foreground'}`}>{typeof v === 'number' ? (k.includes('var') || k.includes('cvar') || k.includes('Drawdown') || k.includes('atility') || k.includes('Error') ? `${v}%` : v.toFixed(2)) : v}</span></div>))}
          </CardContent></Card>
          <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase">Risk Profile</CardTitle></CardHeader><CardContent className="h-64"><ResponsiveContainer width="100%" height="100%"><RadarChart data={RISK_DATA}><PolarGrid stroke="#2a2a2a" /><PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: '#888' }} /><Radar dataKey="value" stroke="#65d0a5" fill="#65d0a5" fillOpacity={0.15} strokeWidth={1.5} /></RadarChart></ResponsiveContainer></CardContent></Card>
        </div></TabsContent>
        <TabsContent value="allocation"><div className="grid grid-cols-2 gap-3">
          <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase">Sector Allocation</CardTitle></CardHeader><CardContent className="h-56 flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sectorData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">{sectorData.map((entry) => (<Cell key={entry.name} fill={SECTOR_COLORS[entry.name] || '#666'} />))}</Pie></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase">Holdings by Weight</CardTitle></CardHeader><CardContent className="space-y-2">
            {POSITIONS.sort((a, b) => b.weight - a.weight).map((p) => (<div key={p.sym} className="flex items-center gap-2 text-[11px]"><span className="w-16 font-medium text-foreground">{p.sym}</span><div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(p.weight / 40) * 100}%`, background: SECTOR_COLORS[p.sector] || '#666' }} /></div><span className="w-12 text-right text-muted-foreground">{p.weight}%</span></div>))}
          </CardContent></Card>
        </div></TabsContent>
      </Tabs>
    </div>
  )
}
