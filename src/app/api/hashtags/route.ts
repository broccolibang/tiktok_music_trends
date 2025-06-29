import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface TikTokPost {
  hashtags: Array<{ name: string }>;
}

let hashtagCache: string[] | null = null;

function getAllHashtags(): string[] {
  if (hashtagCache) {
    return hashtagCache;
  }

  try {
    const genres = ['hiphop', 'pop', 'rnb'];
    const allHashtags = new Set<string>();

    for (const genre of genres) {
      try {
        const dataPath = path.join(process.cwd(), 'data', `${genre}.json`);
        const jsonData = fs.readFileSync(dataPath, 'utf8');
        const posts: TikTokPost[] = JSON.parse(jsonData);
        
        posts.forEach(post => {
          post.hashtags.forEach(hashtag => {
            allHashtags.add(hashtag.name.toLowerCase());
          });
        });
      } catch (error) {
        console.error(`Error loading ${genre} hashtags:`, error);
      }
    }

    hashtagCache = Array.from(allHashtags);
    return hashtagCache;
  } catch (error) {
    console.error('Error loading hashtags:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    const allHashtags = getAllHashtags();
    
    if (allHashtags.length === 0) {
      // Fallback hashtags if no real data available
      const fallbackHashtags = [
        "fyp", "viral", "trending", "music", "dance", "newmusic", "artist", "song",
        "beat", "remix", "cover", "original", "acoustic", "live", "studio", "pop",
        "hiphop", "rnb", "electronic", "rock", "indie", "latin", "country", "jazz"
      ];
      
      const filtered = fallbackHashtags
        .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10);
      
      return NextResponse.json(filtered);
    }

    const filtered = allHashtags
      .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Hashtag API Error:', error);
    return NextResponse.json({ error: 'Failed to load hashtags' }, { status: 500 });
  }
} 