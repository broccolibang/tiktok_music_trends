'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { ArtistList } from '@/components/admin/artist-list';
import { ArtistForm } from '@/components/admin/artist-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Edit, Trash2, Music } from 'lucide-react';
import { ArtistMetrics } from '@/types/dashboard';
import { useRouter } from 'next/navigation';

export function ArtistManagementWrapper() {
  const router = useRouter();
  const [artists, setArtists] = useState<ArtistMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<ArtistMetrics | null>(null);

  const loadArtists = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/custom-artists');
      if (!response.ok) {
        throw new Error('Failed to load artists');
      }
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error('Failed to load artists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtists();
  }, []);

  const handleAddArtist = async (newArtist: Partial<ArtistMetrics>) => {
    const artist: ArtistMetrics = {
      id: `artist-${Date.now()}`,
      name: newArtist.name || '',
      likes: newArtist.likes || 0,
      followers: newArtist.followers || 0,
      trendingScore: newArtist.trendingScore || 0,
      genres: newArtist.genres || [],
      breakoutSong: newArtist.breakoutSong || {
        title: '',
        releaseDate: new Date().toISOString().split('T')[0],
        duration: '3:00',
        plays: 0
      },
      profileImage: newArtist.profileImage || '',
      verifiedArtist: newArtist.verifiedArtist || false,
      username: newArtist.username || ''
    };

    try {
      const response = await fetch('/api/custom-artists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artist),
      });

      if (!response.ok) {
        throw new Error('Failed to add artist');
      }

      const savedArtist = await response.json();
      setArtists(prev => [savedArtist, ...prev]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add artist:', error);
      alert('Failed to add artist. Please try again.');
    }
  };

  const handleEditArtist = async (updatedArtist: ArtistMetrics) => {
    try {
      const response = await fetch('/api/custom-artists', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArtist),
      });

      if (!response.ok) {
        throw new Error('Failed to update artist');
      }

      const savedArtist = await response.json();
      setArtists(prev => prev.map(artist => 
        artist.id === savedArtist.id ? savedArtist : artist
      ));
      setIsEditDialogOpen(false);
      setEditingArtist(null);
    } catch (error) {
      console.error('Failed to update artist:', error);
      alert('Failed to update artist. Please try again.');
    }
  };

  const handleDeleteArtist = async (artistId: string) => {
    if (confirm('Are you sure you want to delete this artist?')) {
      try {
        const response = await fetch(`/api/custom-artists?id=${artistId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete artist');
        }

        setArtists(prev => prev.filter(artist => artist.id !== artistId));
      } catch (error) {
        console.error('Failed to delete artist:', error);
        alert('Failed to delete artist. Please try again.');
      }
    }
  };

  const openEditDialog = (artist: ArtistMetrics) => {
    setEditingArtist(artist);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <Header lastUpdated={new Date()} isLoading={loading} />

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Artist Management
              </h1>
              <p className="text-gray-600 mt-2">Manage your artist database, add new artists, and update information</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Artist
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add New Artist</DialogTitle>
                  </DialogHeader>
                  <ArtistForm
                    onSubmit={handleAddArtist}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Artists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{artists.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Verified Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {artists.filter(a => a.verifiedArtist).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Likes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {(artists.reduce((sum, a) => sum + a.likes, 0) / 1000000).toFixed(1)}M
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Artist List */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Artists Database</CardTitle>
          </CardHeader>
          <CardContent>
            <ArtistList
              artists={artists}
              isLoading={loading}
              onEdit={openEditDialog}
              onDelete={handleDeleteArtist}
            />
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Edit Artist</DialogTitle>
            </DialogHeader>
            {editingArtist && (
              <ArtistForm
                initialData={editingArtist}
                onSubmit={handleEditArtist}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setEditingArtist(null);
                }}
                isEditing
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 