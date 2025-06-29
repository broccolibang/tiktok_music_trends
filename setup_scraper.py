#!/usr/bin/env python3
"""
Setup script for TikTok Scraper
Installs Selenium and manages ChromeDriver.
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors."""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_chrome():
    """Check if Chrome is installed."""
    try:
        if sys.platform.startswith('win'):
            # Windows Chrome paths
            chrome_paths = [
                r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
            ]
            return any(os.path.exists(path) for path in chrome_paths)
        elif sys.platform.startswith('darwin'):
            # macOS Chrome path
            return os.path.exists("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        else:
            # Linux - try to run chrome command
            result = subprocess.run(['which', 'google-chrome'], capture_output=True)
            return result.returncode == 0
    except:
        return False

def main():
    """Main setup function."""
    print("🚗 TikTok Scraper Setup")
    print("=" * 40)
    
    # Check if Chrome is installed
    if not check_chrome():
        print("⚠️  Google Chrome not detected!")
        print("📥 Please install Google Chrome first:")
        print("   • Windows/Mac: https://www.google.com/chrome/")
        print("   • Ubuntu: sudo apt update && sudo apt install google-chrome-stable")
        print("   • CentOS: sudo yum install google-chrome-stable")
        print("\n💡 After installing Chrome, run this setup script again.")
        return
    else:
        print("✅ Google Chrome detected")
    
    # Install Selenium
    if not run_command("pip install selenium", "Installing Selenium"):
        sys.exit(1)
    
    # Install WebDriver Manager (automatically manages ChromeDriver)
    if not run_command("pip install webdriver-manager", "Installing WebDriver Manager"):
        sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\n📝 You can now run the scraper with:")
    print("   python3 tiktok_scraper.py")
    print("\n💡 Example TikTok profile URLs:")
    print("   https://www.tiktok.com/@d4vdd")
    print("   https://www.tiktok.com/@username")
    print("\n🔧 Notes:")
    print("   • ChromeDriver will be downloaded automatically on first run")
    print("   • The browser window will open so you can manually navigate")
    print("   • Press ENTER in the terminal when ready to start scraping")

if __name__ == "__main__":
    main() 