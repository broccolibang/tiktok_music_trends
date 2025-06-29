# 🎵 TikTok Scraper

A powerful TikTok profile scraper that extracts video metrics and saves them to CSV files using Selenium WebDriver.

## ✨ Features

- 🔍 **Profile Scraping**: Extract data from entire TikTok profiles
- 📅 **Manual Navigation**: Manual setup phase for reliable "Oldest" sorting
- 📊 **Comprehensive Metrics**: Captures views, likes, bookmarks/saves, and comments
- 💾 **CSV Export**: Saves all data to timestamped CSV files
- 🎯 **Smart Parsing**: Converts TikTok's "142.5K" format to actual numbers
- 🚗 **Browser Automation**: Uses Selenium WebDriver for reliable scraping
- 🔧 **Auto ChromeDriver**: Automatically downloads and manages ChromeDriver
- 🎲 **Randomized Delays**: Human-like random delays between actions
- 🎯 **TikTok's Exact Selectors**: Uses TikTok's actual data-e2e selectors for maximum accuracy
- 🔄 **Error Handling**: Robust error handling and recovery

## 🚀 Quick Start

### 1. Install Google Chrome
Make sure you have Google Chrome installed:
- **Windows/Mac**: Download from [chrome.google.com](https://www.google.com/chrome/)
- **Ubuntu**: `sudo apt update && sudo apt install google-chrome-stable`
- **CentOS**: `sudo yum install google-chrome-stable`

### 2. Setup (First Time Only)
```bash
python3 setup_scraper.py
```

### 3. Run the Scraper
```bash
python3 tiktok_scraper.py
```

### 4. Enter a TikTok Profile URL
```
Enter TikTok URL: https://www.tiktok.com/@d4vdd
```

### 5. Manual Navigation Phase
- Browser window opens automatically
- Click "Oldest" to sort videos chronologically
- Scroll down if needed to see more videos
- Press ENTER in terminal when ready to start scraping

## 📊 Output

The scraper generates CSV files in the `data/` folder with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| `video_url` | Direct link to the video | https://www.tiktok.com/@d4vdd/video/1234567890 |
| `views` | View count (parsed) | 142500 |
| `likes` | Like count (parsed) | 15200 |
| `bookmarks` | Bookmark count (parsed) | 890 |
| `comments` | Comment count (parsed) | 450 |
| `views_raw` | Original view text | "142.5K" |
| `likes_raw` | Original like text | "15.2K" |
| `bookmarks_raw` | Original bookmark text | "890" |
| `comments_raw` | Original comment text | "450" |
| `scraped_at` | Timestamp | 2024-01-15T10:30:45.123456 |

## 🔧 Configuration

### Headless Mode
To run without showing the browser window, edit `tiktok_scraper.py`:
```python
chrome_options.add_argument("--headless")  # Uncomment this line
```

### Video Limit
By default, the scraper processes ALL videos on the profile. To set a custom limit, edit the configuration at the top of `tiktok_scraper.py`:
```python
MAX_VIDEOS_TO_SCRAPE = None  # None = all videos
# or
MAX_VIDEOS_TO_SCRAPE = 50    # Limit to 50 videos
```

## 📁 File Structure

```
tiktok-music-trends/
├── tiktok_scraper.py          # Main scraper script
├── setup_scraper.py           # Setup and installation script
├── requirements_scraper.txt   # Python dependencies
├── README_SCRAPER.md         # This file
└── data/                     # Output CSV files
    └── tiktok_scrape_YYYYMMDD_HHMMSS.csv
```

## 🎯 Supported URL Formats

- Profile URLs: `https://www.tiktok.com/@username`
- Profile URLs: `https://tiktok.com/@username`
- Short URLs: `https://www.tiktok.com/t/shortcode`
- Mobile URLs: `https://vm.tiktok.com/shortcode`

## ⚠️ Important Notes

1. **Profile URLs Only**: The scraper works with profile URLs, not individual video URLs
2. **Chrome Required**: Google Chrome browser must be installed
3. **ChromeDriver Auto-Managed**: ChromeDriver is automatically downloaded and updated
4. **Manual Navigation**: You manually navigate to "Oldest" for best results
5. **Scrapes All Videos**: By default processes ALL videos on the profile (configurable)
6. **TikTok's Actual Selectors**: Uses TikTok's real data-e2e selectors (`browse-like-count`, `browse-comment-count`, `undefined-count`)
7. **Randomized Timing**: Uses random delays (1-4 seconds) between actions to mimic human behavior
8. **Rate Limiting**: The scraper includes delays to avoid being blocked
9. **Terms of Service**: Please respect TikTok's terms of service and rate limits
10. **Public Data Only**: This scraper only accesses publicly available data

## 🐛 Troubleshooting

### Common Issues

**"No videos found"**
- Make sure the profile is public
- Check if the URL is correct
- Try scrolling down manually before pressing ENTER
- Some profiles may have different HTML structure

**Chrome/ChromeDriver Issues**
- Make sure Google Chrome is installed and up to date
- ChromeDriver is auto-managed, but if issues persist, try reinstalling
- Run `python3 setup_scraper.py` again

**"Chrome not detected"**
- Install Google Chrome browser first
- Check if Chrome is in the standard installation path
- Run the setup script to verify detection

**Permission Errors**
- Make sure you have write permissions in the current directory
- The script creates a `data/` folder automatically

### Debug Mode
The scraper runs with browser visible by default so you can see what's happening. This helps with debugging and verification.

## 🔄 Integration with Music Dashboard

The scraped CSV data can be imported into your TikTok Music Analytics dashboard:

1. Run the scraper on music artist profiles
2. Use the CSV data to populate your custom artists database
3. Convert metrics to match your dashboard format (likes, followers, trending score)

## 📈 Sample Output

```
🎵 TikTok Scraper - URL Input
========================================
Enter TikTok URL: https://www.tiktok.com/@d4vdd

✅ Valid TikTok URL detected: https://www.tiktok.com/@d4vdd

🚀 Starting TikTok profile scraping...
📱 Profile URL: https://www.tiktok.com/@d4vdd
🌐 Launching browser...
📄 Navigating to profile...

============================================================
🛠️  MANUAL NAVIGATION PHASE
============================================================
📋 Please perform the following steps manually:
   1. 📅 Click on 'Oldest' to sort videos chronologically
   2. 🔄 Wait for the page to fully load
   3. 📱 Scroll down if needed to see more videos
   4. ✅ Verify you can see the video thumbnails

💡 The browser window is open - you can interact with it now!
🚀 Once you're ready, press ENTER to start automated scraping...

🤖 Starting automated scraping phase...
   ⏱️  Waited 2.3s before starting automation
🔍 Finding video containers...
   ✅ Found video links: 47
📹 Found 47 videos to scrape
🎯 Will scrape all 47 videos found

📹 Processing video 1/47...
   ✅ Found profile view count: 142.5K
   ⏱️  Pre-click delay: 1.2s
   ⏱️  Video load delay: 3.7s
   🔍 Extracting metrics from video page...
   ✅ Found likes: 52.3K (TikTok selector: browse-like-count)
   ✅ Found bookmarks: 5198 (TikTok selector: undefined-count)
   ✅ Found comments: 1049 (TikTok selector: browse-comment-count)
   👁️  Views: 142.5K (142,500)
   ❤️  Likes: 52.3K (52,300)
   🔖 Bookmarks: 5198 (5,198)
   💬 Comments: 1049 (1,049)
   ⏱️  Back navigation delay: 2.1s

   ⏱️  Inter-video delay: 1.8s

📹 Processing video 2/47...
   ✅ Found profile view count: 3.8M
   ⏱️  Pre-click delay: 0.9s
   ⏱️  Video load delay: 4.2s
   🔍 Extracting metrics from video page...
   ✅ Found likes: 89.4K (TikTok selector: browse-like-count)
   ✅ Found bookmarks: 2156 (TikTok selector: undefined-count)
   ✅ Found comments: 3421 (TikTok selector: browse-comment-count)
   👁️  Views: 3.8M (3,800,000)
   ❤️  Likes: 89.4K (89,400)
   🔖 Bookmarks: 2156 (2,156)
   💬 Comments: 3421 (3,421)
   ⏱️  Back navigation delay: 1.6s

💾 Saving data to tiktok_scrape_20241215_143022.csv...
✅ Saved 47 videos to data/tiktok_scrape_20241215_143022.csv

📊 Scraping Summary:
   📹 Videos scraped: 47
   👁️  Total views: 12,543,891
   ❤️  Total likes: 1,247,382
   🔖 Total bookmarks: 89,574
   💬 Total comments: 234,891

🎉 Scraping completed successfully! 
```

## 🛠️ Requirements

- Python 3.7+
- Google Chrome browser
- selenium>=4.15.0
- webdriver-manager>=4.0.0

ChromeDriver is automatically downloaded and managed by webdriver-manager. 