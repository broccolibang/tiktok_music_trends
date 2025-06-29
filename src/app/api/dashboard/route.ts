import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { HashtagData, ArtistMetrics, ArtistGrowthData, DashboardData, KPIMetrics, GenreTrendData } from '@/types/dashboard';

const CUSTOM_ARTISTS_FILE = path.join(process.cwd(), 'data', 'custom-artists.json');

// Load custom artists from the managed file
function loadCustomArtists(): ArtistMetrics[] {
  try {
    if (!fs.existsSync(CUSTOM_ARTISTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(CUSTOM_ARTISTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading custom artists:', error);
    return [];
  }
}

// Generate mock hashtag data based on genres from custom artists
function generateHashtagData(artists: ArtistMetrics[]): HashtagData[] {
  const genreCounts = new Map<string, number>();
  
  artists.forEach(artist => {
    artist.genres.forEach(genre => {
      const hashtag = `#${genre.toLowerCase()}`;
      genreCounts.set(hashtag, (genreCounts.get(hashtag) || 0) + Math.floor(artist.likes / 10000));
    });
  });
  
  // Add some common music hashtags with generated counts
  const commonHashtags = [
    '#music', '#trending', '#viral', '#newmusic', '#artist', 
    '#song', '#musician', '#playlist', '#tiktok', '#fyp'
  ];
  
  commonHashtags.forEach(hashtag => {
    const randomCount = Math.floor(Math.random() * 50000) + 10000;
    genreCounts.set(hashtag, randomCount);
  });
  
  return Array.from(genreCounts.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 30);
}

// Generate artist growth data from custom artists
function generateArtistGrowthData(artists: ArtistMetrics[]): ArtistGrowthData[] {
  return artists
    .map(artist => {
      // Generate realistic growth percentages based on trending score
      const baseGrowth = Math.random() * 15; // 0-15% base growth
      const trendingBonus = (artist.trendingScore / 100) * 10; // Up to 10% bonus for high trending
      const percentGrowth = Math.round((baseGrowth + trendingBonus) * 100) / 100;
      
      return {
        artistName: artist.name,
        percentGrowth: percentGrowth,
        totalPlays: artist.likes // Using likes as a proxy for plays
      };
    })
    .sort((a, b) => b.percentGrowth - a.percentGrowth)
    .slice(0, 10);
}

// Generate genre trends based on custom artists
function generateGenreTrendsFromData(artists: ArtistMetrics[]): GenreTrendData[] {
  const genreCounts = new Map<string, { artists: number; likes: number; followers: number }>();
  
  artists.forEach(artist => {
    artist.genres.forEach(genre => {
      const existing = genreCounts.get(genre) || { artists: 0, likes: 0, followers: 0 };
      genreCounts.set(genre, {
        artists: existing.artists + 1,
        likes: existing.likes + artist.likes,
        followers: existing.followers + artist.followers
      });
    });
  });
  
  const totalArtists = artists.length;
  
  return Array.from(genreCounts.entries())
    .map(([genre, data]) => {
      const percentage = totalArtists > 0 ? (data.artists / totalArtists) * 100 : 0;
      const growth = (Math.random() - 0.3) * 25; // Slightly positive bias
      
      return {
        genre,
        plays: data.likes, // Using likes as plays proxy
        growth: Number(growth.toFixed(1)),
        percentage: Number(percentage.toFixed(1))
      };
    })
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 6);
}

// Calculate KPIs from custom artists
function calculateKPIsFromData(artists: ArtistMetrics[]): KPIMetrics {
  const totalLikes = artists.reduce((sum, artist) => sum + artist.likes, 0);
  const totalFollowers = artists.reduce((sum, artist) => sum + artist.followers, 0);
  const totalSongs = artists.reduce((sum, artist) => sum + (artist.breakoutSong?.plays || 0), 0);
  
  // Generate realistic ratios
  const saveToPlayRatio = totalLikes > 0 ? Math.min(0.15, totalSongs / totalLikes) : 0.08;
  
  return {
    totalPlays: totalLikes, // Using likes as plays
    totalLikes: totalLikes,
    totalShares: Math.floor(totalLikes * 0.12), // 12% share rate
    saveToPlayRatio: Number(saveToPlayRatio.toFixed(3))
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre') || 'all';
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const region = searchParams.get('region') || 'Global';

    // Load custom artists from the managed file
    let artists = loadCustomArtists();
    
    // Apply genre filter
    if (genre !== 'all') {
      const genreMap: { [key: string]: string } = {
        'hiphop': 'Hip-Hop',
        'pop': 'Pop',
        'rnb': 'R&B'
      };
      const targetGenre = genreMap[genre.toLowerCase()] || genre;
      artists = artists.filter(artist => 
        artist.genres.some(g => g.toLowerCase() === targetGenre.toLowerCase())
      );
    }

    // Apply date filters if provided (filter by creation date)
    if (fromDate) {
      const fromTime = new Date(fromDate);
      artists = artists.filter(artist => {
        const createdAt = artist.createdAt ? new Date(artist.createdAt) : new Date();
        return createdAt >= fromTime;
      });
    }

    if (toDate) {
      const toTime = new Date(toDate);
      artists = artists.filter(artist => {
        const createdAt = artist.createdAt ? new Date(artist.createdAt) : new Date();
        return createdAt <= toTime;
      });
    }

    // Generate dashboard data from custom artists
    const kpis = calculateKPIsFromData(artists);
    const genreTrends = generateGenreTrendsFromData(artists);
    const artistGrowth = generateArtistGrowthData(artists);
    const hashtagCooccurrence = generateHashtagData(artists);

    // Sort artists by trending score for display
    const sortedArtists = [...artists]
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 20);

    const dashboardData: DashboardData = {
      kpis,
      genreTrends,
      artistGrowth,
      hashtagCooccurrence,
      artists: sortedArtists,
      lastUpdated: new Date()
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to load data',
      kpis: { totalPlays: 0, totalLikes: 0, totalShares: 0, saveToPlayRatio: 0 },
      genreTrends: [],
      artistGrowth: [],
      hashtagCooccurrence: [],
      artists: [],
      lastUpdated: new Date()
    }, { status: 500 });
  }
} 