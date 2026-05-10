import { ArrowUpRight, CircleDot, Clock3 } from 'lucide-react'
import PortfolioTrendChart from '../components/charts/PortfolioTrendChart.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import PageWrapper from '../components/layout/PageWrapper.jsx'

export default function ModulePage({ title, eyebrow, description, accent }) {
  return (
    <PageWrapper title={title} eyebrow={eyebrow} description={description} accent={accent}>
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Module Overview</h2>
              <p className="mt-1 text-sm text-slate-400">Placeholder workspace ready for Supabase data.</p>
            </div>
            <Badge color={accent}>Active</Badge>
          </div>
          <PortfolioTrendChart />
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Next Actions</h2>
            <Button variant="ghost" className="h-9 px-3">
              <ArrowUpRight size={16} />
            </Button>
          </div>
          <div className="space-y-3">
            {['Review portfolio signals', 'Update delivery status', 'Prepare executive summary'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <CircleDot size={18} style={{ color: accent }} />
                <span className="min-w-0 flex-1 text-sm text-slate-200">{item}</span>
                <Clock3 size={16} className="text-slate-500" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}
