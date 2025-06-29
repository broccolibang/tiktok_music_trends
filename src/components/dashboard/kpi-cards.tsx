import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Heart, Share, Bookmark } from 'lucide-react';
import { KPIMetrics } from '@/types/dashboard';
import { formatNumber, formatPercent } from '@/lib/utils';

interface KPICardsProps {
  metrics: KPIMetrics;
}

export function KPICards({ metrics }: KPICardsProps) {
  const kpis = [
    {
      title: 'Total Plays',
      value: formatNumber(metrics.totalPlays),
      icon: Play,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12.5%',
      changeType: 'positive' as const
    },
    {
      title: 'Total Likes',
      value: formatNumber(metrics.totalLikes),
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+8.3%',
      changeType: 'positive' as const
    },
    {
      title: 'Total Shares',
      value: formatNumber(metrics.totalShares),
      icon: Share,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+15.7%',
      changeType: 'positive' as const
    },
    {
      title: 'Save-to-Play Ratio',
      value: formatPercent(metrics.saveToPlayRatio),
      icon: Bookmark,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '-2.1%',
      changeType: 'negative' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {kpi.value}
                  </div>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs font-medium ${
                        kpi.changeType === 'positive'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {kpi.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last week</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 