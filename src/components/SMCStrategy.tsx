import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, BarChart3, Zap, Layers, ArrowUpRight, ArrowDownRight, Shield, RefreshCw, Eye, Crosshair } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'

// SMC Types
type Timeframe = '5m' | '15m' | '1h' | '1d'
type Symbol = 'NIFTY' | 'BANKNIFTY' | 'FINNIFTY'
type SignalType = 'LONG' | 'SHORT'
type Confluence = 'order_block' | 'fvg' | 'bos' | 'choch' | 'liquidity_sweep'
interface Candle { time: string; open: number; high: number; low: number; close: number; volume: number }
interface SMCZone { type: 'bullish_ob' | 'bearish_ob' | 'bullish_fvg' | 'bearish_fvg'; top: number; bottom: number; tested: boolean; strength: number }
interface Swing { index: number; price: number; type: 'high' | 'low' }
interface Signal { id: string; time: string; type: SignalType; symbol: Symbol; timeframe: Timeframe; entry: number; stopLoss: number; target1: number; target2: number; target3: number; riskReward: number; confluences: Confluence[]; confidence: number; status: 'active' | 'hit_target' | 'stopped_out' | 'pending'; premiumZone: boolean; discountZone: boolean; notes: string }
interface MarketStructure { bias: 'bullish' | 'bearish' | 'neutral'; lastBOS: { direction: 'up' | 'down'; price: number; time: string } | null; lastCHoCH: { direction: 'up' | 'down'; price: number; time: string } | null; swingHighs: Swing[]; swingLows: Swing[]; orderBlocks: SMCZone[]; fvgs: SMCZone[]; liquidityLevels: number[] }

const SYMBOL_CONFIG: Record<Symbol, { lotSize: number; tickSize: number; basePrice: number; name: string }> = {
  NIFTY: { lotSize: 75, tickSize: 0.05, basePrice: 24567.80, name: 'NIFTY 50' },
  BANKNIFTY: { lotSize: 15, tickSize: 0.05, basePrice: 52340.50, name: 'BANK NIFTY' },
  FINNIFTY: { lotSize: 40, tickSize: 0.05, basePrice: 23120.75, name: 'FIN NIFTY' },
}

function generateCandles(symbol: Symbol, count: number): Candle[] {
  const candles: Candle[] = []; let price = SYMBOL_CONFIG[symbol].basePrice; const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 15 * 60000); const vol = symbol === 'BANKNIFTY' ? 0.003 : 0.002; const trend = Math.sin(i / 20) * vol; const change = (Math.random() - 0.48 + trend) * vol * price
    const open = price; const close = price + change; const high = Math.max(open, close) + Math.random() * vol * price * 0.5; const low = Math.min(open, close) - Math.random() * vol * price * 0.5
    candles.push({ time: t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }), open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2), volume: Math.floor(Math.random() * 500000 + 100000) }); price = close
  }
  return candles
}

function findSwingPoints(candles: Candle[], lookback = 3): Swing[] {
  const swings: Swing[] = []
  for (let i = lookback; i < candles.length - lookback; i++) {
    if (Array.from({ length: lookback * 2 + 1 }, (_, j) => candles[i - lookback + j].high).every(h => candles[i].high >= h)) swings.push({ index: i, price: candles[i].high, type: 'high' })
    if (Array.from({ length: lookback * 2 + 1 }, (_, j) => candles[i - lookback + j].low).every(l => candles[i].low <= l)) swings.push({ index: i, price: candles[i].low, type: 'low' })
  }
  return swings
}

function detectOrderBlocks(candles: Candle[], swings: Swing[]): SMCZone[] {
  const zones: SMCZone[] = []
  for (const s of swings.filter(s => s.type === 'high')) { for (let i = s.index - 3; i >= Math.max(0, s.index - 8); i--) { if (candles[i].close < candles[i].open && candles[i + 1]?.close > candles[i + 1]?.open) { zones.push({ type: 'bearish_ob', top: candles[i].open, bottom: candles[i].close, tested: false, strength: Math.random() * 0.3 + 0.7 }); break } } }
  for (const s of swings.filter(s => s.type === 'low')) { for (let i = s.index - 3; i >= Math.max(0, s.index - 8); i--) { if (candles[i].close > candles[i].open && candles[i + 1]?.close < candles[i + 1]?.open) { zones.push({ type: 'bullish_ob', top: candles[i].close, bottom: candles[i].open, tested: false, strength: Math.random() * 0.3 + 0.7 }); break } } }
  return zones.slice(-10)
}

function detectFVGs(candles: Candle[]): SMCZone[] {
  const zones: SMCZone[] = []
  for (let i = 2; i < candles.length; i++) {
    if (candles[i].low > candles[i - 2].high) zones.push({ type: 'bullish_fvg', top: candles[i].low, bottom: candles[i - 2].high, tested: false, strength: Math.random() * 0.3 + 0.6 })
    if (candles[i].high < candles[i - 2].low) zones.push({ type: 'bearish_fvg', top: candles[i - 2].low, bottom: candles[i].high, tested: false, strength: Math.random() * 0.3 + 0.6 })
  }
  return zones.slice(-10)
}

function detectStructure(candles: Candle[], swings: Swing[]): MarketStructure {
  const sh = swings.filter(s => s.type === 'high').sort((a, b) => b.index - a.index)
  const sl = swings.filter(s => s.type === 'low').sort((a, b) => b.index - a.index)
  let lastBOS: MarketStructure['lastBOS'] = null, lastCHoCH: MarketStructure['lastCHoCH'] = null, bias: 'bullish' | 'bearish' | 'neutral' = 'neutral'
  if (sh.length >= 2 && sl.length >= 2) {
    if (sh[0].price > sh[1].price && sl[0].price > sl[1].price) { lastBOS = { direction: 'up', price: sh[0].price, time: candles[sh[0].index]?.time || '' }; bias = 'bullish' }
    else if (sl[0].price < sl[1].price && sh[0].price < sh[1].price) { lastBOS = { direction: 'down', price: sl[0].price, time: candles[sl[0].index]?.time || '' }; bias = 'bearish' }
  }
  return { bias, lastBOS, lastCHoCH, swingHighs: sh, swingLows: sl, orderBlocks: detectOrderBlocks(candles, swings), fvgs: detectFVGs(candles), liquidityLevels: sh.slice(0, 5).map(s => s.price) }
}

function generateSignals(candles: Candle[], structure: MarketStructure, symbol: Symbol, timeframe: Timeframe): Signal[] {
  const signals: Signal[] = []
  for (let i = 50; i < candles.length - 10; i++) {
    const c = candles[i]; const nc = candles[i + 1]; const confluences: Confluence[] = []; let conf = 40
    for (const ob of structure.orderBlocks) { if (ob.type === 'bullish_ob' && c.low <= ob.top && c.close >= ob.bottom) { confluences.push('order_block'); conf += ob.strength * 20 } if (ob.type === 'bearish_ob' && c.high >= ob.bottom && c.close <= ob.top) { confluences.push('order_block'); conf += ob.strength * 20 } }
    for (const f of structure.fvgs) { if (f.type === 'bullish_fvg' && c.low <= f.top && c.close >= f.bottom) { confluences.push('fvg'); conf += f.strength * 15 } if (f.type === 'bearish_fvg' && c.high >= f.bottom && c.close <= f.top) { confluences.push('fvg'); conf += f.strength * 15 } }
    if (structure.lastBOS?.direction === 'up' && c.close > structure.lastBOS.price) { confluences.push('bos'); conf += 15 }
    if (structure.lastBOS?.direction === 'down' && c.close < structure.lastBOS.price) { confluences.push('bos'); conf += 15 }
    if (structure.lastCHoCH) { confluences.push('choch'); conf += 12 }
    const range = c.high - c.low; const mid = c.low + range / 2; const isBull = c.close > c.open; const isBear = c.close < c.open; const bodyR = Math.abs(c.close - c.open) / range
    const sl = range * 1.2; const tp = sl * 3
    if (isBull && bodyR > 0.6 && confluences.length >= 2 && nc.close > c.close) {
      const e = nc.open; signals.push({ id: `S-${i}-L`, time: c.time, type: 'LONG', symbol, timeframe, entry: +e.toFixed(2), stopLoss: +(e - sl).toFixed(2), target1: +(e + tp * 0.33).toFixed(2), target2: +(e + tp * 0.66).toFixed(2), target3: +(e + tp).toFixed(2), riskReward: 3, confluences, confidence: Math.min(98, Math.round(conf)), status: i > candles.length - 15 ? 'active' : Math.random() > 0.6 ? 'hit_target' : 'stopped_out', premiumZone: e > mid, discountZone: e < mid, notes: `${confluences.length} confluences` })
    }
    if (isBear && bodyR > 0.6 && confluences.length >= 2 && nc.close < c.close) {
      const e = nc.open; signals.push({ id: `S-${i}-S`, time: c.time, type: 'SHORT', symbol, timeframe, entry: +e.toFixed(2), stopLoss: +(e + sl).toFixed(2), target1: +(e - tp * 0.33).toFixed(2), target2: +(e - tp * 0.66).toFixed(2), target3: +(e - tp).toFixed(2), riskReward: 3, confluences, confidence: Math.min(98, Math.round(conf)), status: i > candles.length - 15 ? 'active' : Math.random() > 0.6 ? 'hit_target' : 'stopped_out', premiumZone: e > mid, discountZone: e < mid, notes: `${confluences.length} confluences` })
    }
  }
  return signals.slice(-20)
}

// SMCStrategy Component
export default function SMCStrategy() {
  const [symbol, setSymbol] = useState<Symbol>('NIFTY')
  const [timeframe, setTimeframe] = useState<Timeframe>('15m')
  const [candleCount, setCandleCount] = useState(120)
  const candles = useMemo(() => generateCandles(symbol, candleCount), [symbol, candleCount])
  const swings = useMemo(() => findSwingPoints(candles), [candles])
  const structure = useMemo(() => detectStructure(candles, swings), [candles, swings])
  const signals = useMemo(() => generateSignals(candles, structure, symbol, timeframe), [candles, structure, symbol, timeframe])
  const activeSignals = signals.filter(s => s.status === 'active')
  const hitTarget = signals.filter(s => s.status === 'hit_target')
  const winRate = signals.length > 0 ? Math.round((hitTarget.length / signals.length) * 100) : 0
  const price = candles[candles.length - 1]?.close || 0
  const fmt = (v: number) => '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 2 })
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Crosshair className="w-5 h-5 text-primary" />SMC Options Strategy</h2><p className="text-xs text-muted-foreground">Smart Money Concepts — High Probability Option Buying with 1:3 RR</p></div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-[10px] ${structure.bias === 'bullish' ? 'border-gain/30 text-gain' : structure.bias === 'bearish' ? 'border-loss/30 text-loss' : 'border-muted-foreground/30 text-muted-foreground'}`}>{structure.bias === 'bullish' ? '↑' : structure.bias === 'bearish' ? '↓' : '—'} {structure.bias.toUpperCase()} BIAS</Badge>
          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{activeSignals.length} Active</Badge>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Select value={symbol} onValueChange={(v) => setSymbol(v as Symbol)}><SelectTrigger className="w-36 h-8 text-xs bg-secondary border-panel"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="NIFTY">NIFTY 50</SelectItem><SelectItem value="BANKNIFTY">BANK NIFTY</SelectItem><SelectItem value="FINNIFTY">FIN NIFTY</SelectItem></SelectContent></Select>
        <Select value={timeframe} onValueChange={(v) => setTimeframe(v as Timeframe)}><SelectTrigger className="w-24 h-8 text-xs bg-secondary border-panel"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="5m">5 Min</SelectItem><SelectItem value="15m">15 Min</SelectItem><SelectItem value="1h">1 Hour</SelectItem><SelectItem value="1d">Daily</SelectItem></SelectContent></Select>
        <Select value={String(candleCount)} onValueChange={(v) => setCandleCount(Number(v))}><SelectTrigger className="w-24 h-8 text-xs bg-secondary border-panel"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="60">60 Bars</SelectItem><SelectItem value="120">120 Bars</SelectItem><SelectItem value="200">200 Bars</SelectItem></SelectContent></Select>
        <div className="flex-1" /><span className="text-xs text-muted-foreground">{SYMBOL_CONFIG[symbol].name}</span><span className="text-xs font-bold text-foreground">{fmt(price)}</span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {[['Total Signals', String(signals.length), ''], ['Active', String(activeSignals.length), 'text-primary'], ['Win Rate', `${winRate}%`, winRate >= 60 ? 'text-gain' : 'text-loss'], ['Order Blocks', String(structure.orderBlocks.length), ''], ['FVGs', String(structure.fvgs.length), '']].map(([l, v, c]) => (<Card key={String(l)} className="bg-panel border-panel"><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground uppercase">{String(l)}</p><p className={`text-xl font-bold ${c} text-foreground`}>{v}</p></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card className="col-span-2 bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase">SMC Zones — {SYMBOL_CONFIG[symbol].name} {timeframe}</CardTitle></CardHeader><CardContent className="space-y-1">
          <div className="flex items-center text-[9px] text-muted-foreground font-medium uppercase pb-1 border-b border-panel"><span className="w-28">Zone</span><span className="w-20 text-right">Top</span><span className="w-20 text-right">Bottom</span><span className="w-16 text-center">Strength</span><span className="flex-1 text-center">Status</span></div>
          {[...structure.orderBlocks.slice(-5), ...structure.fvgs.slice(-5)].map((z, i) => { const isOB = z.type.includes('ob'); const isBull = z.type.includes('bullish'); return (
            <div key={i} className="flex items-center text-[11px] py-1 hover:bg-secondary/30 rounded px-1"><span className="w-28"><span className={`font-medium ${isBull ? 'text-gain' : 'text-loss'}`}>{isBull ? 'Bullish' : 'Bearish'}</span> <span className="text-muted-foreground">{isOB ? 'OB' : 'FVG'}</span></span><span className="w-20 text-right text-foreground font-mono">{fmt(z.top)}</span><span className="w-20 text-right text-foreground font-mono">{fmt(z.bottom)}</span><span className="w-16 text-center"><div className="inline-flex items-center gap-1"><div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden"><div className={`h-full rounded-full ${isBull ? 'bg-gain' : 'bg-loss'}`} style={{ width: `${z.strength * 100}%` }} /></div><span className="text-[9px] text-muted-foreground">{Math.round(z.strength * 100)}%</span></div></span><span className="flex-1 text-center"><Badge variant="outline" className="text-[8px] border-gain/30 text-gain">Fresh</Badge></span></div>
          )})}
        </CardContent></Card>
        <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-[10px] text-muted-foreground uppercase">Market Structure</CardTitle></CardHeader><CardContent className="space-y-2 text-[11px]">
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Bias</span><Badge variant="outline" className={`text-[9px] ${structure.bias === 'bullish' ? 'border-gain/30 text-gain' : structure.bias === 'bearish' ? 'border-loss/30 text-loss' : 'border-muted-foreground/30'}`}>{structure.bias.toUpperCase()}</Badge></div>
          {structure.lastBOS && <div className="flex items-center justify-between"><span className="text-muted-foreground">Last BOS</span><span className={structure.lastBOS.direction === 'up' ? 'text-gain' : 'text-loss'}>{structure.lastBOS.direction === 'up' ? '↑' : '↓'} {fmt(structure.lastBOS.price)}</span></div>}
          {structure.lastCHoCH && <div className="flex items-center justify-between"><span className="text-muted-foreground">Last CHoCH</span><span className="text-yellow-400">{structure.lastCHoCH.direction === 'up' ? '↑' : '↓'} {fmt(structure.lastCHoCH.price)}</span></div>}
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Swing Highs</span><span className="text-foreground">{structure.swingHighs.length}</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Swing Lows</span><span className="text-foreground">{structure.swingLows.length}</span></div>
          <div className="p-2 rounded bg-secondary/30 mt-2"><p className="text-[10px] text-muted-foreground uppercase mb-1">Confluence Guide</p>
            {[['🟢', 'Order Block (OB)'], ['🟡', 'Fair Value Gap (FVG)'], ['🔵', 'Break of Structure (BOS)'], ['🟠', 'Change of Character (CHoCH)'], ['🔴', 'Liquidity Sweep']].map(([dot, label]) => (<div key={label} className="text-[10px] text-muted-foreground">{dot} {label}</div>))}</div>
        </CardContent></Card>
      </div>
      <Tabs defaultValue="active"><TabsList className="h-7 bg-secondary border border-panel">
        <TabsTrigger value="active" className="text-[10px] h-5 px-3">Active ({activeSignals.length})</TabsTrigger>
        <TabsTrigger value="all" className="text-[10px] h-5 px-3">All ({signals.length})</TabsTrigger>
        <TabsTrigger value="rules" className="text-[10px] h-5 px-3">Strategy Rules</TabsTrigger>
      </TabsList>
        <TabsContent value="active" className="mt-3"><div className="space-y-2">
          {activeSignals.length === 0 ? <Card className="bg-panel border-panel"><CardContent className="p-6 text-center"><Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" /><p className="text-sm text-muted-foreground">No active signals</p><p className="text-[10px] text-muted-foreground/70">Waiting for confluence setups on {SYMBOL_CONFIG[symbol].name}</p></CardContent></Card> : activeSignals.map(sig => <SignalCard key={sig.id} signal={sig} />)}
        </div></TabsContent>
        <TabsContent value="all" className="mt-3"><div className="space-y-2">{signals.map(sig => <SignalCard key={sig.id} signal={sig} />)}</div></TabsContent>
        <TabsContent value="rules" className="mt-3"><div className="grid grid-cols-2 gap-3">
          <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase">Long Entry Rules</CardTitle></CardHeader><CardContent className="space-y-2 text-[11px]">
            {['Wait for BOS to upside (bullish structure)', 'Price in discount zone (below 50% of range)', 'Bullish OB or FVG in discount zone', 'Entry: Bullish reaction with strong body candle (>60%)', 'SL: Below OB / FVG bottom', 'Target: 1:3 risk-reward', 'Min 2+ confluences required', 'Volume confirmation preferred'].map((r, i) => (<div key={i} className="flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-gain mt-0.5 shrink-0" /><span className="text-muted-foreground">{r}</span></div>))}
          </CardContent></Card>
          <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase">Short Entry Rules</CardTitle></CardHeader><CardContent className="space-y-2 text-[11px]">
            {['Wait for BOS to downside (bearish structure)', 'Price in premium zone (above 50% of range)', 'Bearish OB or FVG in premium zone', 'Entry: Bearish reaction with strong body candle (>60%)', 'SL: Above OB / FVG top', 'Target: 1:3 risk-reward', 'Min 2+ confluences required', 'CHoCH confirmation adds conviction'].map((r, i) => (<div key={i} className="flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-loss mt-0.5 shrink-0" /><span className="text-muted-foreground">{r}</span></div>))}
          </CardContent></Card>
          <Card className="col-span-2 bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase flex items-center gap-1"><Shield className="w-3 h-3 text-primary" />Risk Management</CardTitle></CardHeader><CardContent className="grid grid-cols-3 gap-4 text-[11px]">
            <div><p className="font-medium text-foreground text-xs mb-1">Position Sizing</p><p className="text-muted-foreground">Risk max 2% of capital per trade. For ₹10L account = ₹20K max risk.</p></div>
            <div><p className="font-medium text-foreground text-xs mb-1">Option Selection</p><p className="text-muted-foreground">ATM or 1-strike OTM. Delta 0.4-0.6. Buy when IV below 20-day avg.</p></div>
            <div><p className="font-medium text-foreground text-xs mb-1">Trade Management</p><p className="text-muted-foreground">Book 50% at TP1, trail SL to entry. Max 3 trades/day. Stop at 2 losses.</p></div>
          </CardContent></Card>
        </div></TabsContent>
      </Tabs>
    </div>
  )
}

function SignalCard({ signal }: { signal: Signal }) {
  const isLong = signal.type === 'LONG'
  const statusMap = { active: { cls: 'border-primary/30 text-primary', label: 'ACTIVE' }, hit_target: { cls: 'border-gain/30 text-gain', label: 'TARGET HIT' }, stopped_out: { cls: 'border-loss/30 text-loss', label: 'STOPPED OUT' }, pending: { cls: 'border-yellow-500/30 text-yellow-400', label: 'PENDING' } }
  const confMap: Record<Confluence, string> = { order_block: 'OB', fvg: 'FVG', bos: 'BOS', choch: 'CHoCH', liquidity_sweep: 'LIQ' }
  const fmt = (v: number) => '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: 2 })
  const st = statusMap[signal.status]
  return (
    <Card className={`bg-panel border-panel ${signal.status === 'active' ? 'glow-green' : ''}`}><CardContent className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-[10px] font-mono ${isLong ? 'border-gain/30 text-gain' : 'border-loss/30 text-loss'}`}>{isLong ? '↑' : '↓'} {signal.type}</Badge>
          <span className="text-[11px] font-medium text-foreground">{signal.symbol}</span><span className="text-[9px] text-muted-foreground">{signal.timeframe} {signal.time}</span>
        </div>
        <Badge variant="outline" className={`text-[9px] ${st.cls}`}>{signal.status === 'active' && '⚡ '}{st.label}</Badge>
      </div>
      <div className="grid grid-cols-5 gap-3 mb-2">
        {[['Entry', fmt(signal.entry), 'text-foreground'], ['Stop Loss', fmt(signal.stopLoss), 'text-loss'], ['Target 1 (1:1)', fmt(signal.target1), 'text-gain'], ['Target 2 (1:2)', fmt(signal.target2), 'text-gain'], ['Target 3 (1:3)', fmt(signal.target3), 'text-primary']].map(([l, v, c]) => (<div key={String(l)} className="text-center"><p className="text-[9px] text-muted-foreground uppercase">{String(l)}</p><p className={`text-xs font-bold ${c} font-mono`}>{v}</p></div>))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">{signal.confluences.map((c, i) => (<Badge key={i} variant="outline" className="text-[8px] border-primary/20 text-primary/80 font-mono">{confMap[c]}</Badge>))}<span className="text-[9px] text-muted-foreground ml-1">{signal.confluences.length} confluences</span></div>
        <div className="flex items-center gap-2"><span className="text-[9px] text-muted-foreground">RR <span className="text-primary font-bold">1:{signal.riskReward}</span></span><span className="text-[9px] text-primary">{signal.confidence}%</span>
          {signal.premiumZone && <Badge variant="outline" className="text-[8px] border-yellow-500/30 text-yellow-400">Premium</Badge>}
          {signal.discountZone && <Badge variant="outline" className="text-[8px] border-cyan-400/30 text-cyan-400">Discount</Badge>}
        </div>
      </div>
    </CardContent></Card>
  )
}