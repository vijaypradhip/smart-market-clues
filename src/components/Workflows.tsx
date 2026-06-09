import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GitBranch, Play, Plus, Trash2, Settings, ArrowRight, Database, Brain, TrendingUp, Filter, Bell, Zap, FileOutput, Clock } from 'lucide-react'
import { useState } from 'react'

interface WorkflowNode { id: string; type: string; label: string; icon: typeof Database; color: string; x: number; y: number }
interface WorkflowEdge { from: string; to: string }

const WORKFLOWS = [
  { name: 'Market Signal Pipeline', status: 'active', runs: 142, lastRun: '2m ago' },
  { name: 'News Sentiment Analysis', status: 'active', runs: 89, lastRun: '5m ago' },
  { name: 'Risk Alert System', status: 'paused', runs: 234, lastRun: '1h ago' },
  { name: 'Auto Rebalancer', status: 'active', runs: 45, lastRun: '15m ago' },
]

const DEFAULT_NODES: WorkflowNode[] = [
  { id: 'n1', type: 'source', label: 'Yahoo Finance', icon: Database, color: '#65d0a5', x: 20, y: 40 },
  { id: 'n2', type: 'source', label: 'FRED API', icon: Database, color: '#65d0a5', x: 20, y: 120 },
  { id: 'n3', type: 'process', label: 'Data Filter', icon: Filter, color: '#e8a838', x: 200, y: 40 },
  { id: 'n4', type: 'process', label: 'Sentiment NLP', icon: Brain, color: '#6b8aff', x: 200, y: 120 },
  { id: 'n5', type: 'analysis', label: 'Signal Generator', icon: TrendingUp, color: '#c76dff', x: 380, y: 80 },
  { id: 'n6', type: 'action', label: 'Alert Bot', icon: Bell, color: '#e8636f', x: 540, y: 40 },
  { id: 'n7', type: 'action', label: 'Trade Executor', icon: Zap, color: '#65d0a5', x: 540, y: 120 },
  { id: 'n8', type: 'output', label: 'Log & Report', icon: FileOutput, color: '#888', x: 680, y: 80 },
]
const DEFAULT_EDGES: WorkflowEdge[] = [{ from: 'n1', to: 'n3' }, { from: 'n2', to: 'n4' }, { from: 'n3', to: 'n5' }, { from: 'n4', to: 'n5' }, { from: 'n5', to: 'n6' }, { from: 'n5', to: 'n7' }, { from: 'n6', to: 'n8' }, { from: 'n7', to: 'n8' }]
const NODE_TYPES = [{ type: 'source', label: 'Data Source', color: '#65d0a5' }, { type: 'process', label: 'Process', color: '#e8a838' }, { type: 'analysis', label: 'AI Analysis', color: '#6b8aff' }, { type: 'action', label: 'Action', color: '#c76dff' }, { type: 'output', label: 'Output', color: '#888' }]

export default function Workflows() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(0)
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const nodes = DEFAULT_NODES; const edges = DEFAULT_EDGES
  return (
    <div className="h-full flex">
      <div className="w-56 border-r border-panel flex flex-col shrink-0">
        <div className="p-3 border-b border-panel flex items-center justify-between"><h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1"><GitBranch className="w-3 h-3 text-primary" />Workflows</h3><Button variant="outline" size="sm" className="h-6 w-6 p-0 border-panel"><Plus className="w-3 h-3" /></Button></div>
        <div className="flex-1 overflow-y-auto">{WORKFLOWS.map((w, i) => (
          <button key={i} onClick={() => setSelectedWorkflow(i)} className={`w-full px-3 py-2.5 text-left border-b border-panel/50 transition-colors ${selectedWorkflow === i ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-secondary/40'}`}>
            <div className="flex items-center justify-between"><span className="text-[11px] font-medium text-foreground truncate">{w.name}</span><div className={`w-2 h-2 rounded-full shrink-0 ml-1 ${w.status === 'active' ? 'bg-gain' : 'bg-yellow-500'}`} /></div>
            <div className="flex items-center gap-2 mt-0.5 text-[9px] text-muted-foreground"><Clock className="w-2.5 h-2.5" />{w.lastRun}<span>•</span>{w.runs} runs</div>
          </button>
        ))}</div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-panel flex items-center justify-between">
          <div><h3 className="text-sm font-bold text-foreground">{WORKFLOWS[selectedWorkflow].name}</h3><p className="text-[10px] text-muted-foreground">Visual workflow editor</p></div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-[9px] ${WORKFLOWS[selectedWorkflow].status === 'active' ? 'border-gain/30 text-gain' : 'border-yellow-500/30 text-yellow-400'}`}>{WORKFLOWS[selectedWorkflow].status}</Badge>
            <Button variant="outline" size="sm" className="h-7 text-[10px] border-panel"><Play className="w-3 h-3 mr-1" />Run</Button>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 relative bg-background overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}><defs><marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#444" /></marker></defs>
              {edges.map((e, i) => { const from = nodes.find((n) => n.id === e.from); const to = nodes.find((n) => n.id === e.to); if (!from || !to) return null; const x1 = from.x + 130; const y1 = from.y + 25; const x2 = to.x; const y2 = to.y + 25; const mx = (x1 + x2) / 2; return (<path key={i} d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} stroke="#444" strokeWidth={1.5} fill="none" markerEnd="url(#arrowhead)" />) })}
            </svg>
            {nodes.map((n) => { const Icon = n.icon; const isSelected = selectedNode?.id === n.id; return (
              <div key={n.id} onClick={() => setSelectedNode(n)} className={`absolute cursor-pointer transition-all duration-150 ${isSelected ? 'ring-2 ring-primary/50 scale-105' : 'hover:ring-1 hover:ring-primary/20'}`} style={{ left: n.x, top: n.y }}>
                <div className="bg-panel border border-panel rounded-lg p-2 w-[130px] shadow-lg"><div className="flex items-center gap-1.5"><div className="p-1 rounded" style={{ background: n.color + '20' }}><Icon className="w-3 h-3" style={{ color: n.color }} /></div><span className="text-[10px] font-medium text-foreground truncate">{n.label}</span></div></div>
              </div>
            ) })}
          </div>
          {selectedNode && (
            <div className="w-56 border-l border-panel p-3 shrink-0 overflow-y-auto">
              <div className="flex items-center justify-between mb-3"><h4 className="text-xs font-medium text-foreground">Node Properties</h4><Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-muted-foreground hover:text-loss"><Trash2 className="w-3 h-3" /></Button></div>
              <div className="space-y-3">
                <div><label className="text-[10px] text-muted-foreground block mb-1">Label</label><div className="text-xs text-foreground bg-secondary/50 rounded px-2 py-1">{selectedNode.label}</div></div>
                <div><label className="text-[10px] text-muted-foreground block mb-1">Type</label><div className="text-xs text-foreground bg-secondary/50 rounded px-2 py-1 capitalize">{selectedNode.type}</div></div>
                <div><label className="text-[10px] text-muted-foreground block mb-1">Connections</label><div className="space-y-1">{edges.filter((e) => e.from === selectedNode.id || e.to === selectedNode.id).map((e, i) => (<div key={i} className="flex items-center gap-1 text-[10px] text-muted-foreground"><ArrowRight className="w-2.5 h-2.5" />{e.from === selectedNode.id ? `→ ${nodes.find((n) => n.id === e.to)?.label}` : `← ${nodes.find((n) => n.id === e.from)?.label}`}</div>))}</div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}