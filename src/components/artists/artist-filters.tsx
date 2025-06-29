'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, X, Hash, MapPin, Search, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { DashboardFilters } from '@/types/dashboard';
import { fetchHashtagSuggestions, fetchRegions } from '@/lib/api';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ArtistFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export function ArtistFilters({ filters, onFiltersChange, onSearch, isLoading }: ArtistFiltersProps) {
  const [hashtagQuery, setHashtagQuery] = useState('');
  const [hashtagSuggestions, setHashtagSuggestions] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [hashtagPopoverOpen, setHashtagPopoverOpen] = useState(false);

  useEffect(() => {
    fetchRegions().then(setRegions);
  }, []);

  useEffect(() => {
    if (hashtagQuery.length > 0) {
      fetchHashtagSuggestions(hashtagQuery).then(setHashtagSuggestions);
    } else {
      setHashtagSuggestions([]);
    }
  }, [hashtagQuery]);

  const addHashtag = (hashtag: string) => {
    if (!filters.hashtags.includes(hashtag)) {
      onFiltersChange({
        ...filters,
        hashtags: [...filters.hashtags, hashtag]
      });
    }
    setHashtagQuery('');
    setHashtagPopoverOpen(false);
  };

  const removeHashtag = (hashtag: string) => {
    onFiltersChange({
      ...filters,
      hashtags: filters.hashtags.filter(h => h !== hashtag)
    });
  };

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
    <div className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Search className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Artist Search</h2>
        </div>
        <p className="text-sm text-gray-500">Filter artists by hashtags, date, and region</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Hashtag Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Hashtags
          </label>
          
          <Popover open={hashtagPopoverOpen} onOpenChange={setHashtagPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={hashtagPopoverOpen}
                className="w-full justify-between"
              >
                Add hashtag...
                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search hashtags..."
                  value={hashtagQuery}
                  onValueChange={setHashtagQuery}
                />
                <CommandList>
                  <CommandEmpty>No hashtags found.</CommandEmpty>
                  <CommandGroup>
                    {hashtagSuggestions.map((hashtag) => (
                      <CommandItem
                        key={hashtag}
                        value={hashtag}
                        onSelect={() => addHashtag(hashtag)}
                      >
                        #{hashtag}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {filters.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.hashtags.map((hashtag) => (
                <Badge key={hashtag} variant="secondary" className="flex items-center gap-1">
                  #{hashtag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeHashtag(hashtag)}
                  />
                </Badge>
              ))}
            </div>
          )}
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

      <div className="p-6 border-t border-gray-200">
        <Button
          onClick={onSearch}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Searching...' : 'Search Artists'}
        </Button>
      </div>
    </div>
  );
} 