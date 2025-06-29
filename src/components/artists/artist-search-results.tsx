'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Play, Pause, ExternalLink, Calendar, Clock, TrendingUp, Heart, Share, Users, CheckCircle, MoreHorizontal, Volume2, VolumeX } from 'lucide-react';
import { ArtistMetrics } from '@/types/dashboard';
import { formatNumber, formatDate } from '@/lib/utils';

interface ArtistSearchResultsProps {
  artists: ArtistMetrics[];
  isLoading: boolean;
}

export function ArtistSearchResults({ artists, isLoading }: ArtistSearchResultsProps) {
  const [playingArtist, setPlayingArtist] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const handlePlayToggle = async (artistId: string, playUrl?: string) => {
    try {
      setAudioError(null);
      
      // If currently playing this artist, pause it
      if (playingArtist === artistId) {
        const audio = audioRefs.current[artistId];
        if (audio) {
          audio.pause();
        }
        setPlayingArtist(null);
        return;
      }

      // Pause any currently playing audio
      if (playingArtist && audioRefs.current[playingArtist]) {
        audioRefs.current[playingArtist].pause();
      }

      // If no playUrl, show error
      if (!playUrl) {
        setAudioError(artistId);
        setTimeout(() => setAudioError(null), 3000);
        return;
      }

      setAudioLoading(artistId);

      // Create or get audio element
      if (!audioRefs.current[artistId]) {
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.preload = 'none';
        
        audio.addEventListener('loadeddata', () => {
          setAudioLoading(null);
        });
        
        audio.addEventListener('error', () => {
          setAudioLoading(null);
          setAudioError(artistId);
          setTimeout(() => setAudioError(null), 3000);
        });
        
        audio.addEventListener('ended', () => {
          setPlayingArtist(null);
        });
        
        audioRefs.current[artistId] = audio;
      }

      const audio = audioRefs.current[artistId];
      audio.src = playUrl;
      audio.volume = 0.7; // Set to 70% volume
      
      await audio.play();
      setPlayingArtist(artistId);
      setAudioLoading(null);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioLoading(null);
      setAudioError(artistId);
      setTimeout(() => setAudioError(null), 3000);
    }
  };

  const getTrendingStatus = (score: number) => {
    if (score >= 80) return { label: 'Hot', color: 'bg-red-500 text-white' };
    if (score >= 60) return { label: 'Rising', color: 'bg-orange-500 text-white' };
    if (score >= 40) return { label: 'Trending', color: 'bg-blue-500 text-white' };
    return { label: 'Stable', color: 'bg-gray-500 text-white' };
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded mb-2"></div>
                  <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded"></div>
                <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artists.map((artist) => {
        const isPlaying = playingArtist === artist.id;
        const trendingStatus = getTrendingStatus(artist.trendingScore);
        
        return (
          <Card key={artist.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <CardContent className="p-0">
              {/* Header with Artist Info */}
              <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                      <AvatarImage src={artist.profileImage} alt={artist.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                        {artist.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-900">{artist.name}</h3>
                        {artist.verifiedArtist && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {artist.genres.map((genre) => (
                          <Badge key={genre} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(artist.sampleVideoUrl, '_blank')}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View TikTok Profile
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Trending Status */}
                <div className="flex items-center justify-between">
                  <Badge className={`${trendingStatus.color} text-xs px-2 py-1`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {trendingStatus.label}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Score: {artist.trendingScore}
                  </span>
                </div>
              </div>

              {/* Breakout Song Section */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Breakout Hit</h4>
                    <p className="text-lg font-bold text-gray-800">{artist.breakoutSong.title}</p>
                  </div>
                  <Button
                    onClick={() => handlePlayToggle(artist.id, artist.breakoutSong.playUrl)}
                    disabled={audioLoading === artist.id}
                    className={`w-12 h-12 rounded-full ${
                      audioError === artist.id
                        ? 'bg-gray-400 hover:bg-gray-500'
                        : isPlaying 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-500 hover:bg-green-600'
                    } text-white transition-all duration-200 relative`}
                  >
                    {audioLoading === artist.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : audioError === artist.id ? (
                      <VolumeX className="w-5 h-5" />
                    ) : isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(new Date(artist.breakoutSong.releaseDate))}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {artist.breakoutSong.duration}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Song Plays</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatNumber(artist.breakoutSong.plays)}
                  </div>
                </div>

                {/* Streaming Links */}
                <div className="flex gap-2">
                  {artist.breakoutSong.spotifyUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(artist.breakoutSong.spotifyUrl, '_blank')}
                      className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                    >
                      Spotify
                    </Button>
                  )}
                  {artist.breakoutSong.youtubeUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(artist.breakoutSong.youtubeUrl, '_blank')}
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      YouTube
                    </Button>
                  )}
                  {artist.breakoutSong.appleUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(artist.breakoutSong.appleUrl, '_blank')}
                      className="flex-1 text-gray-600 border-gray-200 hover:bg-gray-50"
                    >
                      Apple
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats Section */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">TikTok Performance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Total Plays</span>
                    </div>
                    <div className="font-bold text-blue-600">{formatNumber(artist.totalPlays)}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-600">Likes</span>
                    </div>
                    <div className="font-bold text-red-600">{formatNumber(artist.totalLikes)}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Share className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Shares</span>
                    </div>
                    <div className="font-bold text-green-600">{formatNumber(artist.totalShares)}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-600">Engagement</span>
                    </div>
                    <div className="font-bold text-purple-600">{artist.avgEngagement}%</div>
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