import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Brain, Zap, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const PORTFOLIO_PNL = [
  { month: 'Jan', value: 12400 }, { month: 'Feb', value: 18200 }, { month: 'Mar', value: 15800 },
  { month: 'Apr', value: 22100 }, { month: 'May', value: 28500 }, { month: 'Jun', value: 31200 },
]
const VOLUME_DATA = [
  { day: 'Mon', vol: 42 }, { day: 'Tue', vol: 58 }, { day: 'Wed', vol: 65 },
  { day: 'Thu', vol: 48 }, { day: 'Fri', vol: 72 }, { day: 'Sat', vol: 35 }, { day: 'Sun', vol: 28 },
]
const SECTOR_ALLOCATION = [
  { name: 'Tech', value: 42, color: '#65d0a5' }, { name: 'Finance', value: 22, color: '#4aa88a' },
  { name: 'Energy', value: 15, color: '#3d8f74' }, { name: 'Healthcare', value: 12, color: '#2d6e57' },
  { name: 'Other', value: 9, color: '#1e4d3a' },
]
const TOP_MOVERS = [
  { sym: 'NVDA', name: 'NVIDIA Corp', price: 142.85, change: 5.67, vol: '18.2M' },
  { sym: 'TSLA', name: 'Tesla Inc', price: 387.20, change: -3.42, vol: '22.1M' },
  { sym: 'RELIANCE', name: 'Reliance Ind', price: 1456.20, change: 2.89, vol: '8.4M' },
  { sym: 'MSFT', name: 'Microsoft', price: 452.30, change: 1.23, vol: '12.8M' },
  { sym: 'TCS', name: 'Tata Consult', price: 3892.50, change: -0.87, vol: '3.2M' },
  { sym: 'AMZN', name: 'Amazon', price: 198.45, change: 4.12, vol: '15.6M' },
]
const AI_ALERTS = [
  { agent: 'Warren B.', type: 'BUY', ticker: 'JNJ', confidence: 92, msg: 'Undervalued at current P/E' },
  { agent: 'Ray D.', type: 'HEDGE', ticker: 'PORTFOLIO', confidence: 88, msg: 'Deleveraging cycle detected' },
  { agent: 'Cathy W.', type: 'BUY', ticker: 'PLTR', confidence: 85, msg: 'AI sector breakout imminent' },
]

export default function Dashboard() {
  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">Smart Market Clues</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary"><Activity className="w-2.5 h-2.5 mr-1" />Market Open</Badge>
          <span className="text-[11px] text-muted-foreground">NSE • BSE • NYSE</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Portfolio Value" value="$248,320" change={2.34} icon={DollarSign} />
        <StatCard label="Today's P&L" value="+$3,420" change={1.42} icon={TrendingUp} />
        <StatCard label="Active Positions" value="24" change={-1} icon={BarChart3} />
        <StatCard label="AI Signals" value="12" change={3} icon={Brain} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card className="col-span-2 bg-panel border-panel">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Portfolio P&L — YTD</CardTitle></CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PORTFOLIO_PNL}>
                <defs><linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#65d0a5" stopOpacity={0.3} /><stop offset="100%" stopColor="#65d0a5" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'P&L']} />
                <Area type="monotone" dataKey="value" stroke="#65d0a5" strokeWidth={2} fill="url(#pnlGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-panel border-panel">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sector Allocation</CardTitle></CardHeader>
          <CardContent className="h-48 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={120}>
              <PieChart><Pie data={SECTOR_ALLOCATION} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">{SECTOR_ALLOCATION.map((entry, i) => (<Cell key={i} fill={entry.color} />))}</Pie></PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-1">{SECTOR_ALLOCATION.map((s) => (<div key={s.name} className="flex items-center gap-1 text-[10px] text-muted-foreground"><div className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.name} {s.value}%</div>))}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card className="col-span-1 bg-panel border-panel">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Weekly Volume (M)</CardTitle></CardHeader>
          <CardContent className="h-40">
            <ResponsiveContainer width="100%" height="100%"><BarChart data={VOLUME_DATA}><XAxis dataKey="day" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} /><Bar dataKey="vol" fill="#65d0a5" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 bg-panel border-panel">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Top Movers</CardTitle></CardHeader>
          <CardContent className="space-y-2">{TOP_MOVERS.map((m) => (<div key={m.sym} className="flex items-center justify-between text-[11px]"><div><span className="font-medium text-foreground">{m.sym}</span><span className="text-muted-foreground ml-2">{m.vol}</span></div><div className="flex items-center gap-2"><span className="text-muted-foreground">${m.price.toFixed(2)}</span><span className={m.change >= 0 ? 'text-gain font-medium' : 'text-loss font-medium'}>{m.change >= 0 ? '+' : ''}{m.change}%</span></div></div>))}</CardContent>
        </Card>
        <Card className="col-span-1 bg-panel border-panel">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Brain className="w-3 h-3 text-primary" />AI Agent Signals</CardTitle></CardHeader>
          <CardContent className="space-y-3">{AI_ALERTS.map((a, i) => (<div key={i} className="p-2 rounded bg-secondary/40 border border-panel"><div className="flex items-center justify-between mb-1"><span className="text-[11px] font-medium text-foreground">{a.agent}</span><Badge variant="outline" className={`text-[9px] font-mono ${a.type === 'BUY' ? 'border-gain/30 text-gain' : 'border-yellow-500/30 text-yellow-400'}`}>{a.type} {a.ticker}</Badge></div><p className="text-[10px] text-muted-foreground">{a.msg}</p><div className="mt-1 flex items-center gap-1"><span className="text-[9px] text-muted-foreground">Confidence</span><div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${a.confidence}%` }} /></div><span className="text-[9px] text-primary">{a.confidence}%</span></div></div>))}</CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ label, value, change, icon: Icon }: { label: string; value: string; change: number; icon: typeof DollarSign }) {
  const isPositive = change >= 0
  return (
    <Card className="bg-panel border-panel hover:border-primary/20 transition-colors">
      <CardContent className="p-3 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isPositive ? 'bg-gain' : 'bg-loss'}`}><Icon className={`w-4 h-4 ${isPositive ? 'text-gain' : 'text-loss'}`} /></div>
        <div className="flex-1"><p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p><p className="text-lg font-bold text-foreground">{value}</p></div>
        <span className={`text-xs font-medium ${isPositive ? 'text-gain' : 'text-loss'}`}>{isPositive ? '+' : ''}{change}%</span>
      </CardContent>
    </Card>
  )
}