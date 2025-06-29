'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, CheckCircle, Search, Play } from 'lucide-react';
import { ArtistMetrics } from '@/types/dashboard';
import { formatNumber } from '@/lib/utils';

interface ArtistListProps {
  artists: ArtistMetrics[];
  isLoading: boolean;
  onEdit: (artist: ArtistMetrics) => void;
  onDelete: (artistId: string) => void;
}

export function ArtistList({ artists, isLoading, onEdit, onDelete }: ArtistListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof ArtistMetrics>('likes');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedArtists = [...filteredArtists].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (field: keyof ArtistMetrics) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search artists by name or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Artist</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('likes')}
              >
                Likes {sortField === 'likes' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('followers')}
              >
                Followers {sortField === 'followers' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('trendingScore')}
              >
                Trending {sortField === 'trendingScore' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Breakout Song</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedArtists.map((artist) => (
              <TableRow key={artist.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={artist.profileImage} alt={artist.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                        {artist.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{artist.name}</span>
                        {artist.verifiedArtist && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">@{artist.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{formatNumber(artist.likes)}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{formatNumber(artist.followers)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <div className="font-medium">{artist.trendingScore}</div>
                    <div className={`w-2 h-2 rounded-full ${
                      artist.trendingScore >= 80 ? 'bg-red-500' :
                      artist.trendingScore >= 60 ? 'bg-orange-500' :
                      artist.trendingScore >= 40 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{artist.breakoutSong.title}</div>
                    <div className="text-xs text-gray-500">
                      {formatNumber(artist.breakoutSong.plays)} plays
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {artist.genres.slice(0, 2).map(genre => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                    {artist.genres.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{artist.genres.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(artist)}
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(artist.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-500 text-center">
        Showing {sortedArtists.length} of {artists.length} artists
        {searchTerm && ` matching "${searchTerm}"`}
      </div>
    </div>
  );
} 