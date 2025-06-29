import { DashboardData, DashboardFilters, ArtistMetrics, GenreTrendData, ArtistGrowthData, HashtagData, KPIMetrics } from '@/types/dashboard';

// Mock data generation functions
const generateMockKPIs = (): KPIMetrics => ({
  totalPlays: 2847293847,
  totalLikes: 582947382,
  totalShares: 94829384,
  saveToPlayRatio: 0.23
});

const generateMockGenreTrends = (): GenreTrendData[] => {
  const genres = [
    { name: "Pop", baseValue: 850000000 },
    { name: "Hip-Hop", baseValue: 720000000 },
    { name: "Electronic", baseValue: 450000000 },
    { name: "R&B", baseValue: 380000000 },
    { name: "Rock", baseValue: 320000000 },
    { name: "Latin", baseValue: 290000000 },
    { name: "Country", baseValue: 240000000 },
    { name: "Indie", baseValue: 180000000 },
    { name: "Jazz", baseValue: 95000000 },
    { name: "Classical", baseValue: 65000000 }
  ];
  
  const totalPlays = genres.reduce((sum, genre) => sum + genre.baseValue, 0);
  
  return genres.map(genre => {
    const plays = genre.baseValue + Math.floor(Math.random() * genre.baseValue * 0.2) - Math.floor(genre.baseValue * 0.1);
    const growth = (Math.random() - 0.5) * 30; // Growth between -15% and +15%
    const percentage = (plays / totalPlays) * 100;
    
    return {
      genre: genre.name,
      plays,
      growth: Number(growth.toFixed(1)),
      percentage: Number(percentage.toFixed(1))
    };
  }).sort((a, b) => b.plays - a.plays);
};

const generateMockArtistGrowth = (): ArtistGrowthData[] => [
  { artistName: "Olivia Rodrigo", percentGrowth: 245.7, totalPlays: 89472938 },
  { artistName: "Bad Bunny", percentGrowth: 198.3, totalPlays: 156284739 },
  { artistName: "Doja Cat", percentGrowth: 187.9, totalPlays: 94728392 },
  { artistName: "Lil Nas X", percentGrowth: 176.4, totalPlays: 73948273 },
  { artistName: "Billie Eilish", percentGrowth: 165.2, totalPlays: 123948273 },
  { artistName: "Travis Scott", percentGrowth: 154.8, totalPlays: 98374829 },
  { artistName: "Ariana Grande", percentGrowth: 143.6, totalPlays: 87394829 },
  { artistName: "The Weeknd", percentGrowth: 132.4, totalPlays: 76382947 }
];

const generateMockHashtagData = (): HashtagData[] => [
  { text: "fyp", value: 120 },
  { text: "viral", value: 95 },
  { text: "trending", value: 87 },
  { text: "music", value: 82 },
  { text: "dance", value: 76 },
  { text: "newmusic", value: 71 },
  { text: "artist", value: 68 },
  { text: "song", value: 63 },
  { text: "beat", value: 58 },
  { text: "remix", value: 54 },
  { text: "cover", value: 49 },
  { text: "original", value: 45 },
  { text: "acoustic", value: 41 },
  { text: "live", value: 38 },
  { text: "studio", value: 35 }
];

const generateMockArtists = (): ArtistMetrics[] => {
  const artistsData = [
    { name: "Taylor Swift", song: "Anti-Hero", duration: "3:20" },
    { name: "Bad Bunny", song: "Tití Me Preguntó", duration: "4:02" },
    { name: "Olivia Rodrigo", song: "drivers license", duration: "4:02" },
    { name: "Doja Cat", song: "Woman", duration: "2:52" },
    { name: "Harry Styles", song: "As It Was", duration: "2:47" },
    { name: "Billie Eilish", song: "bad guy", duration: "3:14" },
    { name: "The Weeknd", song: "Blinding Lights", duration: "3:20" },
    { name: "Ariana Grande", song: "positions", duration: "2:52" },
    { name: "Drake", song: "God's Plan", duration: "3:19" },
    { name: "Post Malone", song: "Circles", duration: "3:35" },
    { name: "Lil Nas X", song: "MONTERO", duration: "2:17" },
    { name: "Travis Scott", song: "SICKO MODE", duration: "5:12" },
    { name: "SZA", song: "Good Days", duration: "4:39" },
    { name: "Kendrick Lamar", song: "HUMBLE.", duration: "2:57" },
    { name: "Ed Sheeran", song: "Shape of You", duration: "3:53" },
    { name: "Dua Lipa", song: "Levitating", duration: "3:23" },
    { name: "Justin Bieber", song: "Peaches", duration: "3:18" },
    { name: "Lizzo", song: "About Damn Time", duration: "3:12" },
    { name: "Charlie Puth", song: "Light Switch", duration: "3:05" },
    { name: "Glass Animals", song: "Heat Waves", duration: "3:58" }
  ];
  
  const genres = ["Pop", "Hip-Hop", "R&B", "Electronic", "Rock", "Indie", "Latin", "Country"];
  
  return artistsData.map((artist, index) => {
    const breakoutSongPlays = Math.floor(Math.random() * 100000000) + 5000000;
    const releaseYear = 2020 + Math.floor(Math.random() * 4);
    const releaseMonth = Math.floor(Math.random() * 12) + 1;
    const releaseDay = Math.floor(Math.random() * 28) + 1;
    
    return {
      id: `artist-${index + 1}`,
      name: artist.name,
      username: artist.name.toLowerCase().replace(/\s+/g, ''),
      likes: Math.floor(Math.random() * 50000000) + 1000000,
      followers: Math.floor(Math.random() * 10000000) + 100000,
      trendingScore: Number((Math.random() * 100).toFixed(1)),
      genres: [genres[Math.floor(Math.random() * genres.length)], genres[Math.floor(Math.random() * genres.length)]].filter((v, i, a) => a.indexOf(v) === i),
      breakoutSong: {
        title: artist.song,
        releaseDate: `${releaseYear}-${releaseMonth.toString().padStart(2, '0')}-${releaseDay.toString().padStart(2, '0')}`,
        duration: artist.duration,
        plays: breakoutSongPlays,
        spotifyUrl: `https://open.spotify.com/track/example-${index + 1}`,
        youtubeUrl: `https://youtube.com/watch?v=example-${index + 1}`,
        appleUrl: `https://music.apple.com/track/example-${index + 1}`
      },
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${artist.name.replace(' ', '')}`,
      verifiedArtist: Math.random() > 0.3 // 70% chance of being verified
    };
  });
};

// Real data fetching functions
export async function fetchDashboardData(filters?: DashboardFilters): Promise<DashboardData> {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (filters?.genre && filters.genre !== 'all') {
      params.set('genre', filters.genre);
    }
    
    if (filters?.dateRange?.from) {
      params.set('from', filters.dateRange.from.toISOString().split('T')[0]);
    }
    
    if (filters?.dateRange?.to) {
      params.set('to', filters.dateRange.to.toISOString().split('T')[0]);
    }
    
    if (filters?.region && filters.region !== 'Global') {
      params.set('region', filters.region);
    }
    
    // Make API call
    const queryString = params.toString();
    const url = `/api/dashboard${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert lastUpdated string back to Date object
    return {
      ...data,
      lastUpdated: new Date(data.lastUpdated)
    };
  } catch (error) {
    console.error('Error fetching dashboard data, falling back to mock:', error);
    
    // Fallback to mock data if API fails
    return {
      kpis: generateMockKPIs(),
      genreTrends: generateMockGenreTrends(),
      artistGrowth: generateMockArtistGrowth(),
      hashtagCooccurrence: generateMockHashtagData(),
      artists: generateMockArtists(),
      lastUpdated: new Date()
    };
  }
}

export async function fetchHashtagSuggestions(query: string): Promise<string[]> {
  try {
    const response = await fetch(`/api/hashtags?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Hashtag API call failed: ${response.status}`);
    }
    
    const hashtags = await response.json();
    return hashtags;
  } catch (error) {
    console.error('Error fetching hashtag suggestions, using fallback:', error);
    
    // Fallback to mock hashtags
    const allHashtags = [
      "fyp", "viral", "trending", "music", "dance", "newmusic", "artist", "song",
      "beat", "remix", "cover", "original", "acoustic", "live", "studio", "pop",
      "hiphop", "rnb", "electronic", "rock", "indie", "latin", "country", "jazz",
      "classical", "alternative", "punk", "metal", "folk", "blues"
    ];
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return allHashtags
      .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }
}

export async function fetchRegions(): Promise<string[]> {
  return [
    "Global",
    "North America",
    "Europe", 
    "Asia Pacific",
    "Latin America",
    "Middle East & Africa",
    "United States",
    "United Kingdom",
    "Canada",
    "Germany",
    "France",
    "Japan",
    "South Korea",
    "Brazil",
    "Mexico"
  ];
}

export async function fetchGenres(): Promise<string[]> {
  return [
    "All Genres",
    "Pop",
    "Hip-Hop",
    "R&B",
    "Electronic",
    "Rock",
    "Indie",
    "Latin",
    "Country",
    "Jazz",
    "Classical",
    "Alternative",
    "Punk",
    "Metal",
    "Folk",
    "Blues"
  ];
} 