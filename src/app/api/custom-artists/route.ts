import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ArtistMetrics } from '@/types/dashboard';

const CUSTOM_ARTISTS_FILE = path.join(process.cwd(), 'data', 'custom-artists.json');

// Ensure the data directory and file exist
function ensureDataFile() {
  const dataDir = path.dirname(CUSTOM_ARTISTS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(CUSTOM_ARTISTS_FILE)) {
    fs.writeFileSync(CUSTOM_ARTISTS_FILE, '[]', 'utf8');
  }
}

// Read custom artists from file
function readCustomArtists(): ArtistMetrics[] {
  try {
    ensureDataFile();
    const data = fs.readFileSync(CUSTOM_ARTISTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading custom artists:', error);
    return [];
  }
}

// Write custom artists to file
function writeCustomArtists(artists: ArtistMetrics[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(CUSTOM_ARTISTS_FILE, JSON.stringify(artists, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing custom artists:', error);
    throw new Error('Failed to save custom artists');
  }
}

// GET - Read all custom artists
export async function GET() {
  try {
    const artists = readCustomArtists();
    return NextResponse.json(artists);
  } catch (error) {
    console.error('GET /api/custom-artists error:', error);
    return NextResponse.json({ error: 'Failed to load custom artists' }, { status: 500 });
  }
}

// POST - Add a new custom artist
export async function POST(request: NextRequest) {
  try {
    const newArtist: ArtistMetrics = await request.json();
    
    // Generate ID if not provided
    if (!newArtist.id) {
      newArtist.id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Add creation timestamp
    newArtist.createdAt = new Date().toISOString();
    
    const artists = readCustomArtists();
    artists.unshift(newArtist); // Add to beginning of array
    writeCustomArtists(artists);
    
    return NextResponse.json(newArtist, { status: 201 });
  } catch (error) {
    console.error('POST /api/custom-artists error:', error);
    return NextResponse.json({ error: 'Failed to add custom artist' }, { status: 500 });
  }
}

// PUT - Update an existing custom artist
export async function PUT(request: NextRequest) {
  try {
    const updatedArtist: ArtistMetrics = await request.json();
    
    if (!updatedArtist.id) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
    }
    
    const artists = readCustomArtists();
    const artistIndex = artists.findIndex(artist => artist.id === updatedArtist.id);
    
    if (artistIndex === -1) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }
    
    // Preserve creation timestamp and add update timestamp
    updatedArtist.createdAt = artists[artistIndex].createdAt || new Date().toISOString();
    updatedArtist.updatedAt = new Date().toISOString();
    
    artists[artistIndex] = updatedArtist;
    writeCustomArtists(artists);
    
    return NextResponse.json(updatedArtist);
  } catch (error) {
    console.error('PUT /api/custom-artists error:', error);
    return NextResponse.json({ error: 'Failed to update custom artist' }, { status: 500 });
  }
}

// DELETE - Remove a custom artist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get('id');
    
    if (!artistId) {
      return NextResponse.json({ error: 'Artist ID is required' }, { status: 400 });
    }
    
    const artists = readCustomArtists();
    const filteredArtists = artists.filter(artist => artist.id !== artistId);
    
    if (artists.length === filteredArtists.length) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }
    
    writeCustomArtists(filteredArtists);
    
    return NextResponse.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/custom-artists error:', error);
    return NextResponse.json({ error: 'Failed to delete custom artist' }, { status: 500 });
  }
} 