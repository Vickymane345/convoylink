import { Card, CardContent } from '@/components/ui/card'

interface Props {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  trend?: { value: number; label: string }
  alert?: boolean
}

export function AdminStatCard({ label, value, sub, icon, trend, alert }: Props) {
  return (
    <Card className={alert ? 'border-orange-500/30' : ''}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {sub && <p className="text-xs text-zinc-600 mt-1">{sub}</p>}
            {trend && (
              <p className={`text-xs mt-1 ${trend.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
              </p>
            )}
          </div>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${alert ? 'bg-orange-500/20' : 'bg-zinc-800'}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
