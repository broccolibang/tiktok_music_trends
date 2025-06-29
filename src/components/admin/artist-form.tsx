'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { User, Music, TrendingUp, Link as LinkIcon, X, Plus } from 'lucide-react';
import { ArtistMetrics } from '@/types/dashboard';

interface ArtistFormProps {
  initialData?: ArtistMetrics;
  onSubmit: (artist: ArtistMetrics | Partial<ArtistMetrics>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const AVAILABLE_GENRES = [
  'Pop', 'Hip-Hop', 'R&B', 'Electronic', 'Rock', 'Indie', 'Latin', 
  'Country', 'Jazz', 'Classical', 'Alternative', 'Punk', 'Metal', 
  'Folk', 'Blues', 'Reggae', 'Soul', 'Funk'
];

export function ArtistForm({ initialData, onSubmit, onCancel, isEditing = false }: ArtistFormProps) {
  const [formData, setFormData] = useState<Partial<ArtistMetrics>>({
    name: '',
    username: '',
    profileImage: '',
    verifiedArtist: false,
    likes: 0,
    followers: 0,
    trendingScore: 50,
    genres: [],
    breakoutSong: {
      title: '',
      releaseDate: new Date().toISOString().split('T')[0],
      duration: '3:00',
      plays: 0,
      playUrl: '',
      spotifyUrl: '',
      youtubeUrl: '',
      appleUrl: ''
    }
  });

  const [customGenre, setCustomGenre] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ArtistMetrics, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBreakoutSongChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      breakoutSong: {
        ...prev.breakoutSong!,
        [field]: value
      }
    }));
  };

  const addGenre = (genre: string) => {
    if (genre && !formData.genres?.includes(genre)) {
      setFormData(prev => ({
        ...prev,
        genres: [...(prev.genres || []), genre]
      }));
    }
  };

  const removeGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres?.filter(g => g !== genre) || []
    }));
  };

  const addCustomGenre = () => {
    if (customGenre.trim()) {
      addGenre(customGenre.trim());
      setCustomGenre('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate username from name if not provided
    if (!formData.username && formData.name) {
      formData.username = formData.name.toLowerCase().replace(/\s+/g, '');
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Artist Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Taylor Swift"
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="e.g., taylorswift"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="profileImage">Profile Image URL</Label>
            <Input
              id="profileImage"
              value={formData.profileImage || ''}
              onChange={(e) => handleInputChange('profileImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={formData.verifiedArtist || false}
              onCheckedChange={(checked) => handleInputChange('verifiedArtist', checked)}
            />
            <Label htmlFor="verified">Verified Artist</Label>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="likes">Likes</Label>
              <Input
                id="likes"
                type="number"
                value={formData.likes || 0}
                onChange={(e) => handleInputChange('likes', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="followers">Followers</Label>
              <Input
                id="followers"
                type="number"
                value={formData.followers || 0}
                onChange={(e) => handleInputChange('followers', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="trendingScore">Trending Score (0-100)</Label>
              <Input
                id="trendingScore"
                type="number"
                value={formData.trendingScore || 50}
                onChange={(e) => handleInputChange('trendingScore', parseInt(e.target.value) || 50)}
                min="0"
                max="100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Genres */}
      <Card>
        <CardHeader>
          <CardTitle>Genres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Genres</Label>
            <Select onValueChange={addGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a genre" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_GENRES.filter(genre => !formData.genres?.includes(genre)).map(genre => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add custom genre"
              value={customGenre}
              onChange={(e) => setCustomGenre(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomGenre())}
            />
            <Button type="button" onClick={addCustomGenre} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.genres?.map(genre => (
              <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                {genre}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeGenre(genre)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Breakout Song */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Breakout Song
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="songTitle">Song Title *</Label>
              <Input
                id="songTitle"
                value={formData.breakoutSong?.title || ''}
                onChange={(e) => handleBreakoutSongChange('title', e.target.value)}
                placeholder="e.g., Anti-Hero"
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.breakoutSong?.duration || ''}
                onChange={(e) => handleBreakoutSongChange('duration', e.target.value)}
                placeholder="e.g., 3:20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input
                id="releaseDate"
                type="date"
                value={formData.breakoutSong?.releaseDate || ''}
                onChange={(e) => handleBreakoutSongChange('releaseDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="songPlays">Song Plays</Label>
              <Input
                id="songPlays"
                type="number"
                value={formData.breakoutSong?.plays || 0}
                onChange={(e) => handleBreakoutSongChange('plays', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="playUrl">Audio URL</Label>
            <Input
              id="playUrl"
              value={formData.breakoutSong?.playUrl || ''}
              onChange={(e) => handleBreakoutSongChange('playUrl', e.target.value)}
              placeholder="https://example.com/audio.mp3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Streaming Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Streaming Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="spotifyUrl">Spotify URL</Label>
              <Input
                id="spotifyUrl"
                value={formData.breakoutSong?.spotifyUrl || ''}
                onChange={(e) => handleBreakoutSongChange('spotifyUrl', e.target.value)}
                placeholder="https://open.spotify.com/..."
              />
            </div>
            <div>
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                value={formData.breakoutSong?.youtubeUrl || ''}
                onChange={(e) => handleBreakoutSongChange('youtubeUrl', e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <Label htmlFor="appleUrl">Apple Music URL</Label>
              <Input
                id="appleUrl"
                value={formData.breakoutSong?.appleUrl || ''}
                onChange={(e) => handleBreakoutSongChange('appleUrl', e.target.value)}
                placeholder="https://music.apple.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
        >
          {isEditing ? 'Update Artist' : 'Add Artist'}
        </Button>
      </div>
    </form>
  );
} 