'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/dashboard/header';
import { ArtistSearchResults } from '@/components/artists/artist-search-results';
import { ArtistFilters } from '@/components/artists/artist-filters';
import { DashboardData, DashboardFilters } from '@/types/dashboard';
import { fetchDashboardData } from '@/lib/api';

export function ArtistsPageWrapper() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<DashboardFilters>({
    hashtags: [],
    dateRange: { 
      from: searchParams.get('from') ? new Date(searchParams.get('from')!) : null,
      to: searchParams.get('to') ? new Date(searchParams.get('to')!) : null
    },
    region: searchParams.get('region') || 'Global',
    genre: searchParams.get('genre') || 'all'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const dashboardData = await fetchDashboardData(filters);
      setData(dashboardData);
    } catch (error) {
      console.error('Failed to load artist data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiltersChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    loadData();
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading artists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <Header lastUpdated={data.lastUpdated} isLoading={loading} />

      <div className="flex">
        {/* Sidebar Filters */}
        <ArtistFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          isLoading={loading}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 inline-block">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Artist Search Results
                </h1>
                <p className="text-gray-600 font-medium">
                  {data.artists.length} artists found • Click play to listen to their breakout hits
                </p>
              </div>
            </div>

            {/* Search Results */}
            <ArtistSearchResults artists={data.artists} isLoading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
} 