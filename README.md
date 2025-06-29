# TikTok Music Trends Dashboard

A comprehensive Next.js dashboard for analyzing TikTok music trends with real-time data visualization and filtering capabilities.

## Features

### 🎛️ Interactive Sidebar Filters
- **Hashtag Autocomplete**: Search and select hashtags with real-time suggestions
- **Date Range Picker**: Select custom date ranges for trend analysis
- **Region Selector**: Filter data by geographical regions
- **Genre Selector**: Filter by music genres
- **Apply Filters**: Trigger data refresh with selected filters

### 📊 Header
- **Logo & Branding**: TikTok Music Trends branding with gradient logo
- **Last Updated**: Real-time timestamp showing when data was last refreshed
- **User Menu**: Avatar dropdown with user profile and settings options

### 📈 Key Performance Indicators (KPIs)
- **Total Plays**: Aggregate play count with growth percentage
- **Total Likes**: Aggregate like count with growth percentage  
- **Total Shares**: Aggregate share count with growth percentage
- **Save-to-Play Ratio**: Conversion rate metric with trend indicator

### 📊 Data Visualizations

#### Line Chart - Plays Over Time
- Responsive line chart showing 30-day trends
- Multiple data series (plays, likes, shares)
- Interactive tooltips with formatted numbers
- Custom styling with gradient colors

#### Horizontal Bar Chart - Top Rising Artists
- Artists ranked by percentage growth
- Custom tooltips showing growth rate and total plays
- Purple gradient styling matching brand colors

#### Hashtag Word Cloud
- Visual representation of hashtag co-occurrence
- Font sizes based on frequency
- Color-coded by popularity
- Interactive hover effects with occurrence counts

#### Artist Performance Table
- Sortable columns for all metrics
- Pagination (10 artists per page)
- Genre badges for each artist
- Trending status indicators (Hot, Rising, Trending, Stable)
- External links to sample videos
- Responsive design for mobile/desktop

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization
- **TypeScript**: Full type safety throughout
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/
│   ├── ui/                # shadcn/ui components
│   └── dashboard/         # Dashboard-specific components
│       ├── header.tsx
│       ├── sidebar.tsx
│       ├── kpi-cards.tsx
│       ├── plays-chart.tsx
│       ├── artist-growth-chart.tsx
│       ├── hashtag-wordcloud.tsx
│       └── artist-table.tsx
├── lib/
│   ├── api.ts            # Mock API functions (Cursor queries simulation)
│   └── utils.ts          # Utility functions
└── types/
    └── dashboard.ts      # TypeScript type definitions
```

## Data Architecture

### Mock API (Simulating Cursor Queries)
The application includes mock API functions that simulate "Cursor queries" for data fetching:

- `fetchDashboardData()`: Main dashboard data aggregation
- `fetchHashtagSuggestions()`: Autocomplete functionality
- `fetchRegions()`: Available geographical regions
- `fetchGenres()`: Available music genres

### Type Safety
Comprehensive TypeScript interfaces ensure type safety:
- `DashboardData`: Main data structure
- `DashboardFilters`: Filter state management
- `KPIMetrics`: Key performance indicators
- `ArtistMetrics`: Individual artist data
- `PlayTrendData`: Time series data
- `HashtagData`: Word cloud data

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Dashboard**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features in Detail

### Server-Side Data Fetching
- Initial data loaded server-side for optimal performance
- Filter application triggers new data requests
- Loading states during data transitions

### Client-Side Interactivity
- Real-time filter updates without page refresh
- Sortable table columns with visual indicators
- Pagination controls for large datasets
- Interactive charts with hover states

### Responsive Design
- Mobile-first approach using Tailwind CSS
- Collapsible sidebar for mobile devices
- Responsive grid layouts for charts
- Adaptive table design for smaller screens

### Performance Optimizations
- Component-level code splitting
- Optimized bundle with Next.js 14
- Efficient re-rendering with React hooks
- Lazy loading for non-critical components

## Customization

### Adding New Filters
1. Update `DashboardFilters` interface in `types/dashboard.ts`
2. Add form controls to `components/dashboard/sidebar.tsx`
3. Update API functions in `lib/api.ts` to handle new filters

### Adding New Charts
1. Create new component in `components/dashboard/`
2. Add data interface to `types/dashboard.ts`
3. Import and place in main dashboard layout

### Styling Customization
- Modify Tailwind config for brand colors
- Update shadcn/ui component themes
- Customize chart colors in individual components

## Future Enhancements

- [ ] Real TikTok API integration
- [ ] Advanced filtering options
- [ ] Export functionality (PDF, CSV)
- [ ] Real-time data streaming
- [ ] User authentication and personalization
- [ ] Mobile app version
- [ ] Advanced analytics and insights

## License

This project is created for demonstration purposes. Please ensure compliance with TikTok's API terms of service if integrating with real TikTok data.
