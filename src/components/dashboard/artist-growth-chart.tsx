'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArtistGrowthData } from '@/types/dashboard';
import { formatNumber } from '@/lib/utils';

interface ArtistGrowthChartProps {
  data: ArtistGrowthData[];
}

export function ArtistGrowthChart({ data }: ArtistGrowthChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-purple-600">
            Growth: <span className="font-medium">{data.percentGrowth.toFixed(1)}%</span>
          </p>
          <p className="text-sm text-gray-600">
            Total Plays: <span className="font-medium">{formatNumber(data.totalPlays)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Top Rising Artists
        </CardTitle>
        <p className="text-sm text-gray-500">
          Artists with highest growth rates this week
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                type="number" 
                tickFormatter={(value) => `${value}%`}
                className="text-xs"
              />
              <YAxis 
                type="category" 
                dataKey="artistName" 
                width={75}
                className="text-xs"
                interval={0}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="percentGrowth" 
                fill="#8b5cf6"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 