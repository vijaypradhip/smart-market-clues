import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { FlaskConical, Play, Square, Download, Code, Cpu, Brain, Zap, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, CartesianGrid } from 'recharts'

const STRATEGIES = [
  { name: 'Moving Average Crossover', type: 'Trend Following', status: 'ready', sharpe: 1.45, returns: 18.2 },
  { name: 'RSI Mean Reversion', type: 'Mean Reversion', status: 'running', sharpe: 1.23, returns: 14.8 },
  { name: 'Momentum Factor', type: 'Factor Model', status: 'ready', sharpe: 1.67, returns: 22.1 },
  { name: 'Pairs Trading', type: 'Statistical Arb', status: 'completed', sharpe: 1.89, returns: 16.5 },
  { name: 'Volatility Breakout', type: 'Options', status: 'ready', sharpe: 1.12, returns: 12.3 },
]
const BACKTEST_RESULT = Array.from({ length: 120 }, (_, i) => ({ day: i, strategy: 100000 + Math.sin(i / 8) * 5000 + i * 200 + Math.random() * 2000, benchmark: 100000 + Math.sin(i / 12) * 3000 + i * 150 + Math.random() * 1500 }))
const FACTOR_EXPOSURE = [{ factor: 'Value', exposure: 0.35 }, { factor: 'Momentum', exposure: 0.52 }, { factor: 'Size', exposure: -0.12 }, { factor: 'Quality', exposure: 0.41 }, { factor: 'Volatility', exposure: -0.28 }]
const SCATTER_DATA = Array.from({ length: 50 }, () => ({ ret: (Math.random() - 0.4) * 10, vol: Math.random() * 20 + 5 }))
const MODELS = [
  { name: 'Random Forest', accuracy: 72.3, status: 'trained', type: 'Classification' },
  { name: 'LSTM Network', accuracy: 68.9, status: 'training', type: 'Time Series' },
  { name: 'XGBoost', accuracy: 74.1, status: 'trained', type: 'Classification' },
  { name: 'Transformer', accuracy: 71.5, status: 'queued', type: 'Sequence' },
  { name: 'SVR', accuracy: 65.2, status: 'trained', type: 'Regression' },
]

export default function QuantLab() {
  const [code, setCode] = useState(`# Smart Market Clues - Quant Lab\nimport numpy as np\nimport pandas as pd\n\ndef momentum_strategy(prices, lookback=20):\n    """Simple momentum strategy"""\n    signals = []\n    for i in range(lookback, len(prices)):\n        if prices[i] > prices[i-lookback]:\n            signals.append(1)\n        else:\n            signals.append(-1)\n    return np.array(signals)`)
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-foreground flex items-center gap-2"><FlaskConical className="w-5 h-5 text-primary" />AI Quant Lab</h2><p className="text-xs text-muted-foreground">Quantitative research, backtesting & ML models</p></div>
        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary"><Cpu className="w-2.5 h-2.5 mr-1" />GPU Available</Badge>
      </div>
      <Tabs defaultValue="strategies">
        <TabsList className="h-7 bg-secondary border border-panel">
          <TabsTrigger value="strategies" className="text-[10px] h-5 px-3">Strategies</TabsTrigger>
          <TabsTrigger value="backtest" className="text-[10px] h-5 px-3">Backtest</TabsTrigger>
          <TabsTrigger value="ml" className="text-[10px] h-5 px-3">ML Models</TabsTrigger>
          <TabsTrigger value="editor" className="text-[10px] h-5 px-3">Code Editor</TabsTrigger>
        </TabsList>
        <TabsContent value="strategies" className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-3">{STRATEGIES.map((s, i) => (
            <Card key={i} className="bg-panel border-panel hover:border-primary/20 transition-colors"><CardContent className="p-3">
              <div className="flex items-center justify-between mb-2"><div><h4 className="text-xs font-medium text-foreground">{s.name}</h4><p className="text-[10px] text-muted-foreground">{s.type}</p></div>
                <Badge variant="outline" className={`text-[8px] ${s.status === 'running' ? 'border-primary/30 text-primary' : s.status === 'completed' ? 'border-gain/30 text-gain' : 'border-muted-foreground/30 text-muted-foreground'}`}>{s.status === 'running' && <RefreshCw className="w-2 h-2 mr-0.5 animate-spin" />}{s.status}</Badge></div>
              <div className="flex items-center gap-4 text-[11px]"><div><span className="text-muted-foreground">Sharpe </span><span className="text-primary font-medium">{s.sharpe}</span></div><div><span className="text-muted-foreground">Returns </span><span className="text-gain font-medium">+{s.returns}%</span></div></div>
              <div className="flex gap-1 mt-2"><Button variant="outline" size="sm" className="h-6 text-[9px] border-panel flex-1"><Play className="w-2.5 h-2.5 mr-1" />Run</Button><Button variant="outline" size="sm" className="h-6 text-[9px] border-panel"><Code className="w-2.5 h-2.5" /></Button><Button variant="outline" size="sm" className="h-6 text-[9px] border-panel"><Download className="w-2.5 h-2.5" /></Button></div>
            </CardContent></Card>
          ))}</div>
        </TabsContent>
        <TabsContent value="backtest" className="mt-3">
          <div className="grid grid-cols-3 gap-3">
            <Card className="col-span-2 bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase">Backtest Results</CardTitle></CardHeader><CardContent className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={BACKTEST_RESULT}><CartesianGrid strokeDasharray="3 3" stroke="#1e2a2a" /><XAxis dataKey="day" tick={{ fontSize: 9, fill: '#666' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 9, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} /><Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} /><Line type="monotone" dataKey="strategy" stroke="#65d0a5" strokeWidth={1.5} dot={false} name="Strategy" /><Line type="monotone" dataKey="benchmark" stroke="#666" strokeWidth={1} dot={false} name="Benchmark" strokeDasharray="4 4" /></LineChart></ResponsiveContainer></CardContent></Card>
            <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase">Factor Exposure</CardTitle></CardHeader><CardContent className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={FACTOR_EXPOSURE} layout="vertical"><XAxis type="number" tick={{ fontSize: 9, fill: '#666' }} axisLine={false} tickLine={false} /><YAxis dataKey="factor" type="category" tick={{ fontSize: 9, fill: '#888' }} axisLine={false} tickLine={false} width={70} /><Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} /><Bar dataKey="exposure" fill="#65d0a5" radius={[0, 3, 3, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">{[['CAGR','18.2%'],['Sharpe','1.45'],['Max DD','-8.3%'],['Win Rate','58.4%']].map(([l,v]) => (<Card key={l} className="bg-panel border-panel"><CardContent className="p-2 text-center"><p className="text-[10px] text-muted-foreground">{l}</p><p className="text-sm font-bold text-foreground">{v}</p></CardContent></Card>))}</div>
        </TabsContent>
        <TabsContent value="ml" className="mt-3 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <Card className="col-span-2 bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase flex items-center gap-1"><Brain className="w-3 h-3 text-primary" />ML Models</CardTitle></CardHeader><CardContent className="space-y-2">
              {MODELS.map((m, i) => (<div key={i} className="flex items-center justify-between p-2 rounded bg-secondary/30"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${m.status === 'trained' ? 'bg-gain' : m.status === 'training' ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} /><div><span className="text-xs font-medium text-foreground">{m.name}</span><p className="text-[9px] text-muted-foreground">{m.type}</p></div></div><div className="flex items-center gap-3"><span className="text-[11px] text-primary font-mono">{m.accuracy}%</span><Button variant="outline" size="sm" className="h-6 text-[9px] border-panel">{m.status === 'trained' ? 'Predict' : m.status === 'training' ? 'Stop' : 'Train'}</Button></div></div>))}
            </CardContent></Card>
            <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase">Return Distribution</CardTitle></CardHeader><CardContent className="h-64"><ResponsiveContainer width="100%" height="100%"><ScatterChart><CartesianGrid strokeDasharray="3 3" stroke="#1e2a2a" /><XAxis dataKey="vol" name="Volatility" tick={{ fontSize: 9, fill: '#666' }} axisLine={false} tickLine={false} /><YAxis dataKey="ret" name="Return" tick={{ fontSize: 9, fill: '#666' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} /><Scatter data={SCATTER_DATA} fill="#65d0a5" fillOpacity={0.6} /></ScatterChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="editor" className="mt-3">
          <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase flex items-center justify-between"><span className="flex items-center gap-1"><Code className="w-3 h-3" />Strategy Editor — Python</span><div className="flex gap-1"><Button variant="outline" size="sm" className="h-6 text-[9px] border-panel"><Play className="w-2.5 h-2.5 mr-1" />Run</Button><Button variant="outline" size="sm" className="h-6 text-[9px] border-panel"><Square className="w-2.5 h-2.5 mr-1" />Stop</Button></div></CardTitle></CardHeader><CardContent><Textarea value={code} onChange={(e) => setCode(e.target.value)} className="h-64 text-[11px] font-mono bg-background border-panel text-foreground resize-none" spellCheck={false} /></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}