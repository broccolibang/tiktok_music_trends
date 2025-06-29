export interface KPIMetrics {
  totalPlays: number;
  totalLikes: number;
  totalShares: number;
  saveToPlayRatio: number;
}

export interface GenreTrendData {
  genre: string;
  plays: number;
  growth: number;
  percentage: number;
}

export interface ArtistGrowthData {
  artistName: string;
  percentGrowth: number;
  totalPlays: number;
}

export interface HashtagData {
  text: string;
  value: number;
}

export interface BreakoutSong {
  title: string;
  releaseDate: string;
  duration: string;
  plays: number;
  playUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  appleUrl?: string;
}

export interface ArtistMetrics {
  id: string;
  name: string;
  likes: number;
  followers: number;
  trendingScore: number;
  genres: string[];
  breakoutSong: BreakoutSong;
  profileImage?: string;
  verifiedArtist: boolean;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardFilters {
  hashtags: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  region: string;
  genre: string;
}

export interface DashboardData {
  kpis: KPIMetrics;
  genreTrends: GenreTrendData[];
  artistGrowth: ArtistGrowthData[];
  hashtagCooccurrence: HashtagData[];
  artists: ArtistMetrics[];
  lastUpdated: Date;
} 