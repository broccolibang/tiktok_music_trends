#!/usr/bin/env python3
"""
TikTok Scraper - Enhanced with Selenium
A TikTok scraper that extracts video metrics and saves to CSV.
"""

import re
import sys
import csv
import time
import random
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager
import os

# Configuration
MAX_VIDEOS_TO_SCRAPE = None  # Set to None for all videos, or a number like 50 to limit

def random_delay(min_seconds=1.0, max_seconds=3.0):
    """
    Generate a random delay to make scraping more human-like.
    
    Args:
        min_seconds (float): Minimum delay in seconds
        max_seconds (float): Maximum delay in seconds
    """
    delay = random.uniform(min_seconds, max_seconds)
    time.sleep(delay)
    return delay

def validate_tiktok_url(url):
    """
    Validate if the provided URL is a valid TikTok URL.
    
    Args:
        url (str): The URL to validate
        
    Returns:
        bool: True if valid TikTok URL, False otherwise
    """
    # TikTok URL patterns
    tiktok_patterns = [
        r'https?://(?:www\.)?tiktok\.com/@[\w.-]+/video/\d+',  # Standard video URL
        r'https?://(?:www\.)?tiktok\.com/t/\w+',              # Short URL
        r'https?://vm\.tiktok\.com/\w+',                      # Mobile short URL
        r'https?://(?:www\.)?tiktok\.com/@[\w.-]+',           # Profile URL
    ]
    
    return any(re.match(pattern, url.strip()) for pattern in tiktok_patterns)

def get_tiktok_urls():
    """
    Get multiple TikTok URLs from user input with validation.
    
    Returns:
        list: List of valid TikTok URLs
    """
    print("🎵 TikTok Scraper - Multiple URL Input")
    print("=" * 50)
    print("Please enter TikTok URLs to scrape (one per line):")
    print("Supported formats:")
    print("  • https://www.tiktok.com/@username/video/1234567890")
    print("  • https://tiktok.com/t/shortcode")
    print("  • https://vm.tiktok.com/shortcode")
    print("  • https://www.tiktok.com/@username")
    print()
    print("💡 Tips:")
    print("  • Enter one URL per line")
    print("  • Press ENTER on an empty line when done")
    print("  • Type 'exit' to quit")
    print()
    
    urls = []
    url_count = 1
    
    while True:
        try:
            prompt = f"Enter TikTok URL #{url_count} (or press ENTER to finish): "
            url = input(prompt).strip()
            
            # Check if user wants to exit
            if url.lower() in ['exit', 'quit', 'q']:
                print("👋 Goodbye!")
                sys.exit(0)
            
            # Check if user is done (empty input)
            if not url:
                if urls:
                    break
                else:
                    print("❌ Please enter at least one URL or type 'exit' to quit.")
                    continue
            
            # Validate TikTok URL
            if validate_tiktok_url(url):
                # Check if it's a profile URL (not individual video)
                if not ('/@' in url and '/video/' not in url):
                    print("❌ Please provide a TikTok profile URL (not an individual video)")
                    print("   Example: https://www.tiktok.com/@username")
                    continue
                
                urls.append(url)
                print(f"✅ Added URL #{url_count}: {url}")
                url_count += 1
            else:
                print("❌ Invalid TikTok URL. Please enter a valid TikTok URL.")
                print("   Example: https://www.tiktok.com/@username")
                continue
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            sys.exit(0)
        except Exception as e:
            print(f"❌ Error: {e}")
            continue
    
    print(f"\n🎯 Total URLs queued: {len(urls)}")
    for i, url in enumerate(urls, 1):
        print(f"   {i}. {url}")
    
    return urls

def parse_count(count_str):
    """
    Parse TikTok count strings like '142.5K', '1.2M' to integers.
    
    Args:
        count_str (str): Count string from TikTok
        
    Returns:
        int: Parsed count as integer
    """
    if not count_str:
        return 0
    
    count_str = count_str.strip().upper()
    
    # Remove any non-numeric characters except K, M, B and decimal points
    import re
    clean_str = re.sub(r'[^0-9KMB.]', '', count_str)
    
    if 'K' in clean_str:
        return int(float(clean_str.replace('K', '')) * 1000)
    elif 'M' in clean_str:
        return int(float(clean_str.replace('M', '')) * 1000000)
    elif 'B' in clean_str:
        return int(float(clean_str.replace('B', '')) * 1000000000)
    else:
        try:
            return int(float(clean_str))
        except:
            return 0

def scrape_tiktok_profile(url):
    """
    Scrape TikTok profile videos using Selenium.
    
    Args:
        url (str): TikTok profile URL
        
    Returns:
        list: List of video data dictionaries
    """
    print(f"\n🚀 Starting TikTok profile scraping...")
    print(f"📱 Profile URL: {url}")
    
    video_data = []
    driver = None
    
    try:
        # Setup Chrome options
        print("🌐 Launching browser...")
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        
        # Uncomment the next line for headless mode
        # chrome_options.add_argument("--headless")
        
        # Initialize WebDriver with automatic ChromeDriver management
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        wait = WebDriverWait(driver, 10)
        
        # Navigate to the profile page
        print(f"📄 Navigating to profile...")
        driver.get(url)
        delay = random_delay(1, 2)  # Random delay for page load
        print(f"   ⏱️  Waited {delay:.1f}s for page to load")
        
        # Automatic scrolling phase to load ALL videos
        print("\n🤖 Starting automatic scrolling to load ALL videos...")
        print("📜 This may take several minutes for profiles with many videos...")
        
        # Wait for initial page load
        time.sleep(5)
        
        # Get initial state
        last_height = driver.execute_script("return document.body.scrollHeight")
        scroll_attempts = 0
        no_change_count = 0
        max_no_change = 5  # More attempts before giving up
        
        print("📜 Scrolling to bottom repeatedly until all videos are loaded...")
        
        while no_change_count < max_no_change and scroll_attempts < 100:  # Higher limit for large profiles
            scroll_attempts += 1
            
            # Get current video count for progress tracking
            current_videos = len(driver.find_elements(By.CSS_SELECTOR, 'a[href*="/video/"]'))
            if current_videos == 0:
                current_videos = len(driver.find_elements(By.CSS_SELECTOR, '[data-e2e="user-post-item"]'))
            
            # Scroll all the way to the absolute bottom
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            
            # Wait longer for TikTok's lazy loading to kick in
            time.sleep(6)  # Longer wait for content to load
            
            # Get new height after scrolling
            new_height = driver.execute_script("return document.body.scrollHeight")
            
            # Get new video count
            new_video_count = len(driver.find_elements(By.CSS_SELECTOR, 'a[href*="/video/"]'))
            if new_video_count == 0:
                new_video_count = len(driver.find_elements(By.CSS_SELECTOR, '[data-e2e="user-post-item"]'))
            
            if new_height == last_height:
                no_change_count += 1
                print(f"   📜 Scroll {scroll_attempts}: No height change ({no_change_count}/{max_no_change}) - Videos: {new_video_count}")
            else:
                no_change_count = 0  # Reset counter when new content loads
                videos_loaded = new_video_count - current_videos
                print(f"   📜 Scroll {scroll_attempts}: Page expanded! Videos: {new_video_count} (+{videos_loaded})")
                last_height = new_height
            
            # Extra check: try a small additional scroll to trigger any remaining lazy loading
            if no_change_count == 0:  # Only if we just loaded new content
                driver.execute_script("window.scrollBy(0, 500);")
                time.sleep(2)
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
        
        # Final count
        final_video_count = len(driver.find_elements(By.CSS_SELECTOR, 'a[href*="/video/"]'))
        if final_video_count == 0:
            final_video_count = len(driver.find_elements(By.CSS_SELECTOR, '[data-e2e="user-post-item"]'))
        
        if scroll_attempts >= 100:
            print(f"   ⚠️ Reached maximum scroll attempts (100) - may have more videos")
        else:
            print(f"   ✅ Completed scrolling - no more content loading")
            
        print(f"🎯 FINAL RESULT: {final_video_count} videos loaded after {scroll_attempts} scroll attempts")
        
        # Scroll back to top to start scraping from the beginning
        print("🔝 Scrolling back to top to start scraping...")
        driver.execute_script("window.scrollTo(0, 0);")
        time.sleep(3)
        
        print("🤖 Starting automated scraping phase...")
        delay = random_delay(1, 2)  # Random delay before starting
        print(f"   ⏱️  Waited {delay:.1f}s before starting automation")
        
        # Find all video containers
        print("🔍 Finding video containers...")
        video_containers = []
        
        try:
            # Try TikTok's actual video link selectors
            video_containers = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/video/"]')
            print(f"   ✅ Found video links: {len(video_containers)}")
        except:
            pass
        
        if not video_containers:
            try:
                # Try the specific video container class from TikTok
                video_containers = driver.find_elements(By.CSS_SELECTOR, 'a.css-1mdo0pl-AVideoContainer')
                print(f"   ✅ Found video containers by class: {len(video_containers)}")
            except:
                pass
        
        if not video_containers:
            try:
                # Fallback to generic video containers
                video_containers = driver.find_elements(By.CSS_SELECTOR, '[data-e2e="user-post-item"]')
                print(f"   ✅ Found generic containers: {len(video_containers)}")
            except:
                pass
        
        video_count = len(video_containers)
        print(f"📹 Found {video_count} videos to scrape")
        
        if video_count == 0:
            print("❌ No videos found on this profile")
            print("💡 Try scrolling down manually or check if the profile has videos")
            return video_data
        
        # Determine how many videos to scrape
        videos_to_scrape = video_count if MAX_VIDEOS_TO_SCRAPE is None else min(video_count, MAX_VIDEOS_TO_SCRAPE)
        
        if MAX_VIDEOS_TO_SCRAPE is None:
            print(f"🎯 Will scrape all {videos_to_scrape} videos found")
        else:
            print(f"🎯 Will scrape {videos_to_scrape} videos (limited by MAX_VIDEOS_TO_SCRAPE = {MAX_VIDEOS_TO_SCRAPE})")
        
        for i in range(videos_to_scrape):
            try:
                # Add a random delay between videos (except for the first one)
                if i > 0:
                    between_videos_delay = random_delay(1, 2)
                    print(f"   ⏱️  Inter-video delay: {between_videos_delay:.1f}s")
                
                print(f"\n📹 Processing video {i + 1}/{videos_to_scrape}...")
                
                # Re-find video containers (they might change after navigation)
                try:
                    video_containers = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/video/"]')
                    if not video_containers:
                        video_containers = driver.find_elements(By.CSS_SELECTOR, 'a.css-1mdo0pl-AVideoContainer')
                    if not video_containers:
                        video_containers = driver.find_elements(By.CSS_SELECTOR, '[data-e2e="user-post-item"]')
                except:
                    print(f"❌ Could not find video containers after navigation")
                    break
                
                if i >= len(video_containers):
                    print(f"❌ Video {i + 1} not found in updated container list")
                    break
                
                video_container = video_containers[i]
                
                # Extract view count from the profile page using TikTok's actual selector
                view_count = "0"
                try:
                    # Use TikTok's exact selector for video views
                    view_element = video_container.find_element(By.CSS_SELECTOR, 'strong[data-e2e="video-views"]')
                    view_count = view_element.text
                    print(f"   ✅ Found profile view count: {view_count}")
                except:
                    try:
                        # Alternative selector with class
                        view_element = video_container.find_element(By.CSS_SELECTOR, 'strong.video-count')
                        view_count = view_element.text
                        print(f"   ✅ Found profile view count (alt): {view_count}")
                    except:
                        print(f"   ⚠️  No view count found on profile page")
                        pass
                
                # Click on the video to open detailed view
                click_delay = random_delay(1, 2)  # Random delay before click
                print(f"   ⏱️  Pre-click delay: {click_delay:.1f}s")
                
                driver.execute_script("arguments[0].click();", video_container)
                
                # Random delay for video page to load
                load_delay = random_delay(1, 2)  # Longer delay for video loading
                print(f"   ⏱️  Video load delay: {load_delay:.1f}s")
                
                # Extract detailed metrics from the video page
                likes = "0"
                bookmarks = "0" 
                comments = "0"
                
                print(f"   🔍 Extracting metrics from video page...")
                
                # Use TikTok's exact selectors for individual video page metrics
                # These selectors are based on the actual TikTok HTML structure
                
                # Extract likes using TikTok's browse-like-count selector
                try:
                    like_element = driver.find_element(By.CSS_SELECTOR, 'strong[data-e2e="browse-like-count"]')
                    likes = like_element.text.strip()
                    print(f"   ✅ Found likes: {likes} (TikTok selector: browse-like-count)")
                except:
                    print(f"   ⚠️  No likes found with TikTok selector")
                
                # Extract bookmarks using TikTok's undefined-count selector 
                # Note: TikTok actually uses "undefined-count" for bookmarks/saves - this is their internal naming!
                try:
                    bookmark_element = driver.find_element(By.CSS_SELECTOR, 'strong[data-e2e="undefined-count"]')
                    bookmarks = bookmark_element.text.strip()
                    print(f"   ✅ Found bookmarks: {bookmarks} (TikTok selector: undefined-count)")
                except:
                    print(f"   ⚠️  No bookmarks found with TikTok selector")
                
                # Extract comments using TikTok's browse-comment-count selector
                try:
                    comment_element = driver.find_element(By.CSS_SELECTOR, 'strong[data-e2e="browse-comment-count"]')
                    comments = comment_element.text.strip()
                    print(f"   ✅ Found comments: {comments} (TikTok selector: browse-comment-count)")
                except:
                    print(f"   ⚠️  No comments found with TikTok selector")
                
                # Try to get view count from individual video page if we didn't get it from profile
                if view_count == "0":
                    try:
                        # Try to find view count on the individual video page
                        view_element = driver.find_element(By.CSS_SELECTOR, 'strong[data-e2e="video-views"]')
                        view_count = view_element.text.strip()
                        print(f"   ✅ Found views on video page: {view_count}")
                    except:
                        print(f"   ⚠️  No view count found on video page either")
                
                # If any metrics are still missing, try fallback selectors (but TikTok's selectors should work)
                if likes == "0" or comments == "0" or bookmarks == "0":
                    print(f"   🔄 Some metrics missing, trying fallback selectors...")
                    
                    if likes == "0":
                        try:
                            # Fallback like selectors
                            fallback_like = driver.find_element(By.CSS_SELECTOR, 'strong[data-e2e*="like"]')
                            likes = fallback_like.text.strip()
                            print(f"   ✅ Found likes (fallback): {likes}")
                        except:
                            pass
                    
                    if comments == "0":
                        try:
                            # Fallback comment selectors
                            fallback_comment = driver.find_element(By.CSS_SELECTOR, 'strong[data-e2e*="comment"]')
                            comments = fallback_comment.text.strip()
                            print(f"   ✅ Found comments (fallback): {comments}")
                        except:
                            pass
                    
                    if bookmarks == "0":
                        try:
                            # Fallback bookmark selectors
                            fallback_bookmark = driver.find_element(By.CSS_SELECTOR, 'strong[data-e2e*="bookmark"], strong[data-e2e*="collect"], strong[data-e2e*="save"]')
                            bookmarks = fallback_bookmark.text.strip()
                            print(f"   ✅ Found bookmarks (fallback): {bookmarks}")
                        except:
                            pass
                
                # Get video URL
                current_url = driver.current_url
                
                # Parse the counts
                parsed_views = parse_count(view_count)
                parsed_likes = parse_count(likes)
                parsed_bookmarks = parse_count(bookmarks)
                parsed_comments = parse_count(comments)
                
                video_info = {
                    'video_url': current_url,
                    'views': parsed_views,
                    'likes': parsed_likes,
                    'bookmarks': parsed_bookmarks,
                    'comments': parsed_comments,
                    'views_raw': view_count,
                    'likes_raw': likes,
                    'bookmarks_raw': bookmarks,
                    'comments_raw': comments,
                    'scraped_at': datetime.now().isoformat()
                }
                
                video_data.append(video_info)
                
                print(f"   👁️  Views: {view_count} ({parsed_views:,})")
                print(f"   ❤️  Likes: {likes} ({parsed_likes:,})")
                print(f"   🔖 Bookmarks: {bookmarks} ({parsed_bookmarks:,})")
                print(f"   💬 Comments: {comments} ({parsed_comments:,})")
                
                # Go back to profile
                driver.back()
                back_delay = random_delay(1, 2)  # Random delay after going back
                print(f"   ⏱️  Back navigation delay: {back_delay:.1f}s")
                
            except Exception as e:
                print(f"❌ Error processing video {i + 1}: {e}")
                try:
                    driver.back()
                    error_delay = random_delay(1, 2)  # Random delay after error
                    print(f"   ⏱️  Error recovery delay: {error_delay:.1f}s")
                except:
                    pass
                continue
        
    except Exception as e:
        print(f"❌ Error during scraping: {e}")
    
    finally:
        if driver:
            print("🔒 Closing browser...")
            driver.quit()
    
    return video_data

def save_to_csv(video_data, filename=None):
    """
    Save video data to CSV file.
    
    Args:
        video_data (list): List of video data dictionaries
        filename (str): Optional filename, defaults to timestamp-based name
    """
    if not video_data:
        print("❌ No data to save")
        return
    
    if not filename:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"tiktok_scrape_{timestamp}.csv"
    
    print(f"\n💾 Saving data to {filename}...")
    
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    filepath = os.path.join('data', filename)
    
    with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['video_url', 'views', 'likes', 'bookmarks', 'comments', 
                     'views_raw', 'likes_raw', 'bookmarks_raw', 'comments_raw', 'scraped_at']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for video in video_data:
            writer.writerow(video)
    
    print(f"✅ Saved {len(video_data)} videos to {filepath}")
    
    # Print summary
    total_views = sum(video['views'] for video in video_data)
    total_likes = sum(video['likes'] for video in video_data)
    total_bookmarks = sum(video['bookmarks'] for video in video_data)
    total_comments = sum(video['comments'] for video in video_data)
    
    print(f"\n📊 Scraping Summary:")
    print(f"   📹 Videos scraped: {len(video_data)}")
    print(f"   👁️  Total views: {total_views:,}")
    print(f"   ❤️  Total likes: {total_likes:,}")
    print(f"   🔖 Total bookmarks: {total_bookmarks:,}")
    print(f"   💬 Total comments: {total_comments:,}")

def save_to_csv_combined(video_data, filename=None):
    """
    Save combined video data from multiple profiles to CSV file.
    
    Args:
        video_data (list): List of video data dictionaries with profile info
        filename (str): Optional filename, defaults to timestamp-based name
    """
    if not video_data:
        print("❌ No data to save")
        return
    
    if not filename:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"tiktok_scrape_combined_{timestamp}.csv"
    
    print(f"\n💾 Saving combined data to {filename}...")
    
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    filepath = os.path.join('data', filename)
    
    with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['profile_name', 'profile_url', 'video_url', 'views', 'likes', 'bookmarks', 'comments', 
                     'views_raw', 'likes_raw', 'bookmarks_raw', 'comments_raw', 'scraped_at']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for video in video_data:
            writer.writerow(video)
    
    print(f"✅ Saved {len(video_data)} videos from multiple profiles to {filepath}")
    
    # Print summary by profile
    profiles = {}
    for video in video_data:
        profile_name = video.get('profile_name', 'unknown')
        if profile_name not in profiles:
            profiles[profile_name] = {
                'videos': 0,
                'views': 0,
                'likes': 0,
                'bookmarks': 0,
                'comments': 0
            }
        profiles[profile_name]['videos'] += 1
        profiles[profile_name]['views'] += video.get('views', 0)
        profiles[profile_name]['likes'] += video.get('likes', 0)
        profiles[profile_name]['bookmarks'] += video.get('bookmarks', 0)
        profiles[profile_name]['comments'] += video.get('comments', 0)
    
    print(f"\n📊 Combined Scraping Summary by Profile:")
    for profile_name, stats in profiles.items():
        print(f"   👤 @{profile_name}:")
        print(f"      📹 Videos: {stats['videos']}")
        print(f"      👁️  Views: {stats['views']:,}")
        print(f"      ❤️  Likes: {stats['likes']:,}")
        print(f"      🔖 Bookmarks: {stats['bookmarks']:,}")
        print(f"      💬 Comments: {stats['comments']:,}")

def main():
    """
    Main function to run the TikTok scraper.
    """
    try:
        # Step 1: Get TikTok URLs from user
        tiktok_urls = get_tiktok_urls()
        
        if not tiktok_urls:
            print("❌ No URLs provided")
            return
        
        # Step 2: Ask user for output preference
        print("\n📂 Output Options:")
        print("  1. Separate CSV file for each profile")
        print("  2. Combined CSV file for all profiles")
        
        while True:
            try:
                choice = input("Choose option (1 or 2): ").strip()
                if choice == '1':
                    separate_files = True
                    break
                elif choice == '2':
                    separate_files = False
                    break
                else:
                    print("❌ Please enter 1 or 2")
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                return
        
        # Step 3: Process each URL
        all_video_data = []
        successful_scrapes = 0
        
        print(f"\n🚀 Starting to process {len(tiktok_urls)} profile(s)...")
        print("=" * 60)
        
        for i, url in enumerate(tiktok_urls, 1):
            print(f"\n📱 Processing Profile {i}/{len(tiktok_urls)}")
            print(f"🔗 URL: {url}")
            print("-" * 40)
            
            try:
                # Scrape this profile
                video_data = scrape_tiktok_profile(url)
                
                if video_data:
                    successful_scrapes += 1
                    
                    if separate_files:
                        # Save each profile to its own file
                        profile_name = url.split('/@')[1].split('?')[0].split('/')[0] if '/@' in url else f"profile_{i}"
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        filename = f"{profile_name}_{timestamp}.csv"
                        save_to_csv(video_data, filename)
                    else:
                        # Add to combined data
                        # Add profile info to each video record
                        profile_name = url.split('/@')[1].split('?')[0].split('/')[0] if '/@' in url else f"profile_{i}"
                        for video in video_data:
                            video['profile_name'] = profile_name
                            video['profile_url'] = url
                        all_video_data.extend(video_data)
                    
                    print(f"✅ Profile {i} completed: {len(video_data)} videos scraped")
                else:
                    print(f"❌ Profile {i} failed: No data extracted")
                
            except Exception as e:
                print(f"❌ Error processing profile {i}: {e}")
                continue
            
            # Add delay between profiles if there are more to process
            if i < len(tiktok_urls):
                print(f"\n⏳ Waiting before next profile...")
                between_profiles_delay = random_delay(1, 2)
                print(f"   ⏱️  Inter-profile delay: {between_profiles_delay:.1f}s")
        
        # Step 4: Handle combined output if needed
        if not separate_files and all_video_data:
            print(f"\n💾 Saving combined data from all profiles...")
            # Update CSV fieldnames to include profile info
            save_to_csv_combined(all_video_data)
        
        # Step 5: Final summary
        print("\n" + "=" * 60)
        print("🎉 SCRAPING QUEUE COMPLETED!")
        print("=" * 60)
        print(f"📊 Summary:")
        print(f"   🎯 Total profiles queued: {len(tiktok_urls)}")
        print(f"   ✅ Successfully processed: {successful_scrapes}")
        print(f"   ❌ Failed: {len(tiktok_urls) - successful_scrapes}")
        
        if not separate_files and all_video_data:
            total_videos = len(all_video_data)
            total_views = sum(video['views'] for video in all_video_data)
            total_likes = sum(video['likes'] for video in all_video_data)
            total_bookmarks = sum(video['bookmarks'] for video in all_video_data)
            total_comments = sum(video['comments'] for video in all_video_data)
            
            print(f"   📹 Total videos scraped: {total_videos}")
            print(f"   👁️  Total views: {total_views:,}")
            print(f"   ❤️  Total likes: {total_likes:,}")
            print(f"   🔖 Total bookmarks: {total_bookmarks:,}")
            print(f"   💬 Total comments: {total_comments:,}")
        
        if successful_scrapes == 0:
            print("❌ No data was extracted from any profile")
            return
        
        print("\n🎉 All profiles processed successfully!")
        
    except Exception as e:
        print(f"❌ An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
