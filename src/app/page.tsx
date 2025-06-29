'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { Sidebar } from '@/components/dashboard/sidebar';


import { ArtistGrowthChart } from '@/components/dashboard/artist-growth-chart';
import { HashtagWordCloud } from '@/components/dashboard/hashtag-wordcloud';
import { ArtistTable } from '@/components/dashboard/artist-table';
import { DashboardData, DashboardFilters } from '@/types/dashboard';
import { fetchDashboardData } from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DashboardFilters>({
    hashtags: [],
    dateRange: { from: null, to: null },
    region: 'Global',
    genre: 'all'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const dashboardData = await fetchDashboardData(filters);
      setData(dashboardData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyFilters = () => {
    loadData();
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TikTok Music Trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        isLoading={loading}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header lastUpdated={data.lastUpdated} isLoading={loading} />

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <section>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">TikTok Music Analytics</h1>
              <p className="text-gray-600">Discover trending artists, viral music insights, and performance analytics</p>
            </section>

            {/* Main Analytics Grid */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Rising Artists */}
                <div className="lg:col-span-2">
                  <ArtistGrowthChart data={data.artistGrowth} />
                </div>
              </div>
            </section>

            {/* Hashtag Analysis and Artist Performance */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hashtag Co-occurrence */}
                <HashtagWordCloud data={data.hashtagCooccurrence} />
                
                {/* Artist Performance Table - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <ArtistTable data={data.artists} />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
