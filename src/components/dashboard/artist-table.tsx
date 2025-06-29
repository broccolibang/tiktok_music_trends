'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ArtistMetrics } from '@/types/dashboard';
import { formatNumber } from '@/lib/utils';

interface ArtistTableProps {
  data: ArtistMetrics[];
}

type SortField = keyof ArtistMetrics;
type SortOrder = 'asc' | 'desc';

export function ArtistTable({ data }: ArtistTableProps) {
  const [sortField, setSortField] = useState<SortField>('likes');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const getTrendingBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, label: 'Hot', color: 'bg-red-500' };
    if (score >= 60) return { variant: 'secondary' as const, label: 'Rising', color: 'bg-orange-500' };
    if (score >= 40) return { variant: 'outline' as const, label: 'Trending', color: 'bg-blue-500' };
    return { variant: 'outline' as const, label: 'Stable', color: 'bg-gray-500' };
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Artist Performance Table
        </CardTitle>
        <p className="text-sm text-gray-500">
          Detailed metrics for all trending artists with sortable columns
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Artist
                    <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors text-right"
                  onClick={() => handleSort('likes')}
                >
                  <div className="flex items-center justify-end gap-2">
                    Likes
                    <SortIcon field="likes" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors text-right"
                  onClick={() => handleSort('followers')}
                >
                  <div className="flex items-center justify-end gap-2">
                    Followers
                    <SortIcon field="followers" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors text-center"
                  onClick={() => handleSort('trendingScore')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Trending
                    <SortIcon field="trendingScore" />
                  </div>
                </TableHead>
                <TableHead className="text-center">Genres</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((artist) => {
                const trendingBadge = getTrendingBadge(artist.trendingScore);
                return (
                  <TableRow key={artist.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{artist.name}</TableCell>
                    <TableCell className="text-right">{formatNumber(artist.likes)}</TableCell>
                    <TableCell className="text-right">{formatNumber(artist.followers)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={trendingBadge.variant} className="text-xs">
                        {trendingBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {artist.genres.map((genre) => (
                          <Badge key={genre} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} artists
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 