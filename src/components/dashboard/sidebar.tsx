'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, X, Music, MapPin, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { DashboardFilters } from '@/types/dashboard';
import { fetchRegions } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  onApplyFilters: () => void;
  isLoading?: boolean;
}

export function Sidebar({ filters, onFiltersChange, isLoading }: SidebarProps) {
  const router = useRouter();
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    fetchRegions().then(setRegions);
  }, []);

  const updateDateRange = (field: 'from' | 'to', date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: date || null
      }
    });
  };

  return (
    <div className="w-80 bg-gradient-to-b from-white via-purple-50/30 to-pink-50/30 border-r border-purple-200/50 h-full flex flex-col backdrop-blur-sm">
      <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold">Artist Search Panel</h2>
        </div>
        <p className="text-purple-100 text-sm">Filter and search artists by criteria</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Genre Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Music className="h-4 w-4" />
            Genre
          </label>
          
          <Select
            value={filters.genre}
            onValueChange={(value) => onFiltersChange({ ...filters, genre: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="hiphop">Hip-Hop</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="rnb">R&B</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Date Range Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Date Range
          </label>
          
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !filters.dateRange.from && "text-muted-foreground"
                  )}
                >
                  {filters.dateRange.from ? (
                    format(filters.dateRange.from, "MMM dd")
                  ) : (
                    "From"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.from || undefined}
                  onSelect={(date) => updateDateRange('from', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !filters.dateRange.to && "text-muted-foreground"
                  )}
                >
                  {filters.dateRange.to ? (
                    format(filters.dateRange.to, "MMM dd")
                  ) : (
                    "To"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.to || undefined}
                  onSelect={(date) => updateDateRange('to', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Separator />

        {/* Region Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Region
          </label>
          
          <Select
            value={filters.region}
            onValueChange={(value) => onFiltersChange({ ...filters, region: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


      </div>

      <div className="p-6 bg-white/50 backdrop-blur-sm border-t border-purple-200/50">
        <Button
          onClick={() => {
            // Build URL params from current filters
            const params = new URLSearchParams();
            if (filters.genre && filters.genre !== 'all') {
              params.set('genre', filters.genre);
            }
            if (filters.dateRange.from) {
              params.set('from', filters.dateRange.from.toISOString().split('T')[0]);
            }
            if (filters.dateRange.to) {
              params.set('to', filters.dateRange.to.toISOString().split('T')[0]);
            }
            if (filters.region && filters.region !== 'Global') {
              params.set('region', filters.region);
            }
            
            // Navigate to artists page with filters
            const queryString = params.toString();
            router.push(`/artists${queryString ? `?${queryString}` : ''}`);
          }}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Searching...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Search Artists
            </div>
          )}
        </Button>
      </div>
    </div>
  );
} 