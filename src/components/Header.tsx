import { Activity, Bell, Search, Wifi } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

const TICKER_DATA = [
  { symbol: 'BTC', price: 104320.45, change: 2.34 },
  { symbol: 'ETH', price: 2534.12, change: -1.21 },
  { symbol: 'S&P500', price: 5892.58, change: 0.67 },
  { symbol: 'NIFTY', price: 24567.80, change: 1.12 },
  { symbol: 'GOLD', price: 3245.90, change: 0.45 },
  { symbol: 'CRUDE', price: 78.34, change: -0.89 },
  { symbol: 'RELIANCE', price: 1456.20, change: 1.56 },
  { symbol: 'AAPL', price: 198.45, change: 0.82 },
]

function formatPrice(price: number) {
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Header() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i) }, [])
  return (
    <header className="h-10 flex items-center border-b border-panel bg-panel-alt shrink-0 overflow-hidden">
      <div className="flex items-center gap-2 px-4 border-r border-panel h-full shrink-0">
        <Wifi className="w-3 h-3 text-primary animate-pulse" />
        <span className="text-[11px] text-primary font-semibold tracking-widest uppercase">LIVE</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-6 px-4 animate-[slide_30s_linear_infinite] whitespace-nowrap">
          {TICKER_DATA.map((t) => (
            <div key={t.symbol} className="flex items-center gap-2 text-[11px]">
              <span className="text-foreground font-medium">{t.symbol}</span>
              <span className="text-muted-foreground">${formatPrice(t.price)}</span>
              <span className={t.change >= 0 ? 'text-gain' : 'text-loss'}>{t.change >= 0 ? '+' : ''}{t.change}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 border-l border-panel h-full shrink-0">
        <Search className="w-3.5 h-3.5 text-muted-foreground" />
        <div className="relative"><Bell className="w-3.5 h-3.5 text-muted-foreground" /><span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" /></div>
        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary"><Activity className="w-2.5 h-2.5 mr-1" />PRO</Badge>
        <span className="text-[11px] text-muted-foreground font-mono tabular-nums">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
      </div>
      <style>{`@keyframes slide { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </header>
  )
}