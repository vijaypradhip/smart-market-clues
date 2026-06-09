import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Send, Sparkles, TrendingUp, Shield, Zap, Target, BookOpen, Globe, Crown, Scale, BarChart3 } from 'lucide-react'
import { useState } from 'react'

const AGENTS = [
  { id: 'buffett', name: 'Warren B.', title: 'Value Investor', avatar: '🧠', color: '#65d0a5', style: 'Long-term value investing, moat analysis, intrinsic value', icon: Crown, signals: 24, accuracy: 87, desc: 'Focuses on companies with strong moats, consistent earnings, and management integrity.' },
  { id: 'graham', name: 'Ben G.', title: 'Defensive Analyst', avatar: '📊', color: '#4aa88a', style: 'Margin of safety, balance sheet analysis, dividend yield', icon: Shield, signals: 18, accuracy: 82, desc: 'Seeks stocks trading below their net current asset value with strong balance sheets.' },
  { id: 'lynch', name: 'Peter L.', title: 'Growth Scout', avatar: '🔍', color: '#3d8f74', style: 'PEG ratio, growth at reasonable price, sector rotation', icon: Target, signals: 31, accuracy: 79, desc: "Invests in what you know. Looks for growth stories the market hasn't priced in yet." },
  { id: 'munger', name: 'Charlie M.', title: 'Mental Models', avatar: '📚', color: '#2d6e57', style: 'Multi-disciplinary thinking, quality businesses, psychology', icon: BookOpen, signals: 15, accuracy: 91, desc: 'Uses mental models from multiple disciplines to evaluate business quality and avoid stupidity.' },
  { id: 'dalio', name: 'Ray D.', title: 'Macro Strategist', avatar: '🌐', color: '#e8a838', style: 'All-weather portfolio, risk parity, economic cycles', icon: Globe, signals: 22, accuracy: 84, desc: 'Studies economic machines and market cycles. Diversifies across asset classes for all weather.' },
  { id: 'wood', name: 'Cathy W.', title: 'Innovation Hunter', avatar: '🚀', color: '#6b8aff', style: 'Disruptive innovation, 5yr price targets, ARK-style bets', icon: Zap, signals: 28, accuracy: 72, desc: 'Bets big on disruptive technologies — AI, genomics, robotics, energy storage, blockchain.' },
  { id: 'knight', name: 'Howard M.', title: 'Risk Manager', avatar: '⚖️', color: '#c76dff', style: 'Second-level thinking, risk-reward asymmetry, market cycles', icon: Scale, signals: 19, accuracy: 86, desc: 'Focuses on what can go wrong, not what might go right. Looks for asymmetric opportunities.' },
  { id: 'klarman', name: 'Seth K.', title: 'Margin Maven', avatar: '🛡️', color: '#ff6b8a', style: 'Deep value, distressed assets, extreme margin of safety', icon: Shield, signals: 12, accuracy: 89, desc: 'Waits for extraordinary opportunities where the downside is minimal and upside is significant.' },
]

const PORTFOLIO_RECS = [
  { agent: 'Warren B.', action: 'BUY', ticker: 'JNJ', reason: 'Trading below intrinsic value, strong moat', conf: 92 },
  { agent: 'Ray D.', action: 'HEDGE', ticker: 'PORTFOLIO', reason: 'Deleveraging cycle detected globally', conf: 88 },
  { agent: 'Cathy W.', action: 'BUY', ticker: 'PLTR', reason: 'AI sector breakout, massive TAM expansion', conf: 85 },
  { agent: 'Charlie M.', action: 'HOLD', ticker: 'AAPL', reason: 'Quality business, fair valuation, keep compounding', conf: 90 },
  { agent: 'Peter L.', action: 'SELL', ticker: 'INTC', reason: 'Competitive moat eroding, PEG unfavorable', conf: 78 },
  { agent: 'Seth K.', action: 'BUY', ticker: 'VTRS', reason: 'Distressed pharma, significant margin of safety', conf: 82 },
]

export default function AIAgents() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0])
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string }[]>([
    { role: 'agent', text: "Good morning. I'm analyzing current market conditions. What would you like to discuss?" },
  ])

  const handleSend = () => {
    if (!chatInput.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text: chatInput }])
    setChatInput('')
    setTimeout(() => {
      const responses = [
        'Based on my analysis, the market shows signs of consolidation. I recommend maintaining current positions.',
        "Current valuations suggest caution. I'm seeing opportunities in healthcare and consumer staples.",
        'The risk-reward profile favors a defensive posture right now. Consider companies with pricing power.',
        'I see potential in the emerging AI infrastructure space. Quality names at reasonable valuations.',
      ]
      setMessages((prev) => [...prev, { role: 'agent', text: responses[Math.floor(Math.random() * responses.length)] }])
    }, 1000)
  }

  return (
    <div className="h-full flex">
      <div className="w-72 border-r border-panel flex flex-col shrink-0">
        <div className="p-3 border-b border-panel">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2"><Brain className="w-3.5 h-3.5 text-primary" />AI Agents</h2>
          <p className="text-[10px] text-muted-foreground mt-1">Investment personas powered by AI</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {AGENTS.map((agent) => {
            const Icon = agent.icon
            return (
              <button key={agent.id} onClick={() => setSelectedAgent(agent)} className={`w-full px-3 py-3 text-left border-b border-panel/50 transition-colors ${selectedAgent.id === agent.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-secondary/40'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{agent.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1"><span className="text-xs font-medium text-foreground">{agent.name}</span><Badge variant="outline" className="text-[8px] px-1 py-0" style={{ borderColor: agent.color + '40', color: agent.color }}>{agent.title}</Badge></div>
                    <p className="text-[9px] text-muted-foreground truncate mt-0.5">{agent.style}</p>
                  </div>
                  <div className="text-right shrink-0"><p className="text-[10px] text-primary">{agent.accuracy}%</p><p className="text-[9px] text-muted-foreground">{agent.signals} signals</p></div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-panel flex items-center gap-3">
          <span className="text-2xl">{selectedAgent.avatar}</span>
          <div className="flex-1"><h3 className="text-sm font-bold text-foreground">{selectedAgent.name}</h3><p className="text-[10px] text-muted-foreground">{selectedAgent.desc}</p></div>
          <Badge variant="outline" className="text-[9px]" style={{ borderColor: selectedAgent.color + '40', color: selectedAgent.color }}><Sparkles className="w-2.5 h-2.5 mr-0.5" />{selectedAgent.accuracy}% Accuracy</Badge>
        </div>
        <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-3 mt-2 h-7 bg-secondary border border-panel self-start">
            <TabsTrigger value="chat" className="text-[10px] h-5 px-3">Chat</TabsTrigger>
            <TabsTrigger value="signals" className="text-[10px] h-5 px-3">Signals</TabsTrigger>
            <TabsTrigger value="analysis" className="text-[10px] h-5 px-3">Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden mt-0">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">{messages.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] px-3 py-2 rounded-lg text-xs ${m.role === 'user' ? 'bg-primary/20 text-foreground rounded-br-sm' : 'bg-secondary text-muted-foreground rounded-bl-sm'}`}>{m.role === 'agent' && <span className="text-[9px] text-primary font-medium">{selectedAgent.name} • </span>}{m.text}</div></div>))}</div>
            <div className="p-3 border-t border-panel"><div className="flex gap-2"><Textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder={`Ask ${selectedAgent.name} anything...`} className="h-10 min-h-10 text-xs bg-secondary border-panel resize-none" /><Button size="sm" onClick={handleSend} className="bg-primary text-primary-foreground hover:bg-primary/80 px-3"><Send className="w-3.5 h-3.5" /></Button></div></div>
          </TabsContent>
          <TabsContent value="signals" className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2">{PORTFOLIO_RECS.filter((r) => r.agent === selectedAgent.name || selectedAgent.id === 'buffett').map((rec, i) => (
              <Card key={i} className="bg-panel border-panel"><CardContent className="p-3">
                <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><Badge variant="outline" className={`text-[9px] font-mono ${rec.action === 'BUY' ? 'border-gain/30 text-gain' : rec.action === 'SELL' ? 'border-loss/30 text-loss' : 'border-yellow-500/30 text-yellow-400'}`}>{rec.action} {rec.ticker}</Badge><span className="text-[10px] text-muted-foreground">by {rec.agent}</span></div><span className="text-[10px] text-primary">{rec.conf}%</span></div>
                <p className="text-[11px] text-muted-foreground">{rec.reason}</p>
                <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${rec.conf}%` }} /></div>
              </CardContent></Card>
            ))}</div>
          </TabsContent>
          <TabsContent value="analysis" className="flex-1 overflow-y-auto p-3">
            <Card className="bg-panel border-panel"><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Investment Philosophy</CardTitle></CardHeader><CardContent>
              <p className="text-xs text-foreground">{selectedAgent.desc}</p>
              <div className="mt-3 space-y-2">
                {[['Signals Generated', selectedAgent.signals], ['Accuracy Rate', `${selectedAgent.accuracy}%`], ['Avg. Holding Period', '6-18 months'], ['Risk Tolerance', 'Moderate']].map(([k, v]) => (<div key={String(k)} className="flex items-center justify-between text-[11px]"><span className="text-muted-foreground">{String(k)}</span><span className="text-foreground font-medium">{String(v)}</span></div>))}
              </div>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}