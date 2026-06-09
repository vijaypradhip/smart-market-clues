import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeftRight, TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle, Zap } from 'lucide-react'
import { useState } from 'react'

const OPEN_ORDERS = [
  { id: 'ORD-001', sym: 'AAPL', side: 'BUY', type: 'LIMIT', qty: 50, price: 195.00, status: 'Pending', time: '14:30:22' },
  { id: 'ORD-002', sym: 'NVDA', side: 'SELL', type: 'STOP', qty: 100, price: 138.00, status: 'Pending', time: '14:28:15' },
  { id: 'ORD-003', sym: 'RELIANCE', side: 'BUY', type: 'MARKET', qty: 20, price: 1456.20, status: 'Partial', time: '14:25:08' },
]
const TRADE_HISTORY = [
  { time: '14:32:15', sym: 'TCS', side: 'BUY', qty: 10, price: 3892.50, total: 38925, status: 'Filled' },
  { time: '14:30:42', sym: 'MSFT', side: 'SELL', qty: 20, price: 453.10, total: 9062, status: 'Filled' },
  { time: '14:28:18', sym: 'GOLD', side: 'BUY', qty: 100, price: 3244.50, total: 324450, status: 'Filled' },
]
const BROKERS = [
  { name: 'Zerodha', status: 'connected', region: 'India' },
  { name: 'Interactive Brokers', status: 'connected', region: 'Global' },
  { name: 'Alpaca', status: 'connected', region: 'US' },
  { name: 'Angel One', status: 'disconnected', region: 'India' },
]

export default function Trading() {
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY')
  const [orderType, setOrderType] = useState('LIMIT')
  const [symbol, setSymbol] = useState('AAPL')
  const [qty, setQty] = useState('100')
  const [price, setPrice] = useState('198.45')
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-foreground">Trading Terminal</h2><p className="text-xs text-muted-foreground">Multi-broker execution & order management</p></div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary"><Zap className="w-2.5 h-2.5 mr-1" />Paper Mode</Badge>
          <Badge variant="outline" className="text-[10px] border-gain/30 text-gain"><CheckCircle2 className="w-2.5 h-2.5 mr-1" />3 Connected</Badge>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[['Buying Power', '$124,500', ''], ['Today\'s Trades', '12', ''], ['Open Orders', '3', ''], ['Realized P&L', '+$2,340', 'text-gain']].map(([l, v, c]) => (
          <Card key={String(l)} className="bg-panel border-panel"><CardContent className="p-3"><p className="text-[10px] text-muted-foreground uppercase">{String(l)}</p><p className={`text-lg font-bold text-foreground ${c}`}>{String(v)}</p></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-panel border-panel">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1"><ArrowLeftRight className="w-3 h-3" />Place Order</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => setOrderSide('BUY')} className={orderSide === 'BUY' ? 'bg-gain text-white hover:bg-gain/80' : 'border-panel'}><TrendingUp className="w-3 h-3 mr-1" />Buy</Button>
              <Button size="sm" onClick={() => setOrderSide('SELL')} className={orderSide === 'SELL' ? 'bg-loss text-white hover:bg-loss/80' : 'border-panel'}><TrendingDown className="w-3 h-3 mr-1" />Sell</Button>
            </div>
            <div className="space-y-1.5"><Label className="text-[10px] text-muted-foreground">Symbol</Label><Input value={symbol} onChange={(e) => setSymbol(e.target.value)} className="h-8 text-xs bg-secondary border-panel" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5"><Label className="text-[10px] text-muted-foreground">Type</Label><Select value={orderType} onValueChange={setOrderType}><SelectTrigger className="h-8 text-xs bg-secondary border-panel"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MARKET">Market</SelectItem><SelectItem value="LIMIT">Limit</SelectItem><SelectItem value="STOP">Stop</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-[10px] text-muted-foreground">Qty</Label><Input value={qty} onChange={(e) => setQty(e.target.value)} type="number" className="h-8 text-xs bg-secondary border-panel" /></div>
            </div>
            {orderType !== 'MARKET' && <div className="space-y-1.5"><Label className="text-[10px] text-muted-foreground">Price</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="h-8 text-xs bg-secondary border-panel" /></div>}
            <Button className={`w-full text-xs ${orderSide === 'BUY' ? 'bg-gain hover:bg-gain/80 text-white' : 'bg-loss hover:bg-loss/80 text-white'}`}>{orderSide === 'BUY' ? 'Buy' : 'Sell'} {symbol}</Button>
          </CardContent>
        </Card>
        <Card className="col-span-2 bg-panel border-panel">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1"><Clock className="w-3 h-3" />Open Orders</CardTitle></CardHeader>
          <CardContent><div className="space-y-1">
            <div className="flex items-center text-[10px] text-muted-foreground font-medium uppercase pb-1 border-b border-panel"><span className="w-16">ID</span><span className="w-16">Symbol</span><span className="w-12">Side</span><span className="w-16">Type</span><span className="w-12 text-right">Qty</span><span className="w-20 text-right">Price</span><span className="w-16 text-center">Status</span><span className="w-16">Time</span></div>
            {OPEN_ORDERS.map((o) => (<div key={o.id} className="flex items-center text-[11px] py-1.5 hover:bg-secondary/30 rounded px-1"><span className="w-16 text-muted-foreground font-mono">{o.id}</span><span className="w-16 font-medium text-foreground">{o.sym}</span><span className={`w-12 font-medium ${o.side === 'BUY' ? 'text-gain' : 'text-loss'}`}>{o.side}</span><span className="w-16 text-muted-foreground">{o.type}</span><span className="w-12 text-right text-muted-foreground">{o.qty}</span><span className="w-20 text-right text-foreground font-mono">${o.price.toFixed(2)}</span><span className="w-16 text-center"><Badge variant="outline" className={`text-[8px] ${o.status === 'Pending' ? 'border-yellow-500/30 text-yellow-400' : 'border-primary/30 text-primary'}`}>{o.status}</Badge></span><span className="w-16 text-muted-foreground font-mono">{o.time}</span></div>))}
          </div></CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase">Trade History</CardTitle></CardHeader><CardContent><div className="space-y-0.5">
          {TRADE_HISTORY.map((t, i) => (<div key={i} className="flex items-center text-[11px] py-1 hover:bg-secondary/30 rounded px-1"><span className="w-16 text-muted-foreground font-mono">{t.time}</span><span className="w-16 font-medium text-foreground">{t.sym}</span><span className={`w-12 font-medium ${t.side === 'BUY' ? 'text-gain' : 'text-loss'}`}>{t.side}</span><span className="w-12 text-right text-muted-foreground">{t.qty}</span><span className="flex-1 text-right text-muted-foreground">${t.total.toLocaleString()}</span><Badge variant="outline" className="text-[8px] border-gain/30 text-gain ml-2"><CheckCircle2 className="w-2 h-2 mr-0.5" />{t.status}</Badge></div>))}
        </div></CardContent></Card>
        <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase">Broker Connections</CardTitle></CardHeader><CardContent className="space-y-2">
          {BROKERS.map((b) => (<div key={b.name} className="flex items-center justify-between p-2 rounded bg-secondary/30"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${b.status === 'connected' ? 'bg-gain' : 'bg-loss'}`} /><span className="text-xs font-medium text-foreground">{b.name}</span><span className="text-[10px] text-muted-foreground">{b.region}</span></div><Button variant="outline" size="sm" className="h-6 text-[9px] border-panel">{b.status === 'connected' ? 'Disconnect' : 'Connect'}</Button></div>))}
        </CardContent></Card>
      </div>
    </div>
  )
}