# GIST 5300 - Homework 6: Google Heat Maps

**Live Demo:** https://missionloyd.github.io/google-maps-heatmap/

This project demonstrates Google Maps Heat Map visualization using two distinct datasets showing interesting regional clustering patterns across the United States.

## Datasets

### 1. Tesla Super Charging Stations (3,536 locations)
- **File:** `USA - Tesla Super Charging Stations.csv`
- **Points:** 3,536 charging stations
- **Regionality:** Shows strong clustering in:
  - California (West Coast urban corridors)
  - East Coast metropolitan areas
  - Major interstate highway corridors
  - Growing presence in Texas and Florida
- **Pattern:** Reflects population density, Tesla adoption rates, and major travel routes

### 2. Rest Areas (3,032 locations)
- **File:** `RestAreasCombined_USA.csv`
- **Points:** 3,032 rest areas
- **Regionality:** Shows distinct clustering:
  - Interstate highway system distribution
  - Long-distance travel corridors
  - Rural highway infrastructure
  - State-managed rest stop networks
- **Pattern:** Reflects interstate commerce routes and highway infrastructure planning

## Visualization Features

- **Dual Heat Maps:** Toggle between two datasets independently
- **Custom Gradients:**
  - Tesla Stations: Red/Yellow gradient (default Google heat map colors)
  - Rest Areas: Blue/Purple gradient (custom cyan to purple to red)
- **Interactive Controls:** Toggle buttons to show/hide each heat map layer
- **Optimized Display:**
  - Centered on USA (39.8283°N, 98.5795°W)
  - Zoom level 4 for full continental view
  - Radius: 20 pixels for optimal clustering visualization

## Setup Instructions

Choose either the Docker setup (recommended) or manual local server setup.

### Option A: Docker Setup (Recommended)

#### Prerequisites
1. **Docker & Docker Compose** - Install from [docker.com](https://www.docker.com/)
2. **Google Cloud Account** - You'll need a Google Cloud account to get an API key

#### Quick Start

1. **Get Google Maps API Key** (see detailed steps below)
   - API Key from Google Cloud Console

2. **Configure Environment Variables**

   Edit `.env.local` file:
   ```bash
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   PORT=8000
   ```

3. **Run the Application**
   ```bash
   ./run.sh
   ```

4. **Access the Application**

   Open your browser to: `http://localhost:8000`

5. **Stop the Application**
   ```bash
   docker compose down
   ```

### Option B: Manual Local Server Setup

#### Prerequisites
1. **Google Cloud Account** - You'll need a Google Cloud account to get an API key
2. **Local Web Server** - Required to serve the HTML file (Python, Node.js, etc.)

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Maps SDK for Android** (if planning mobile use)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key
6. (Recommended) Restrict your API key:
   - Set application restrictions (HTTP referrers for web)
   - Set API restrictions (limit to Maps JavaScript API)

### Step 2: Configure the Application Files (Manual Setup Only)

**Note:** If using Docker, skip this step and configure `.env.local` instead.

Open `app/index.html` and replace:
```html
<!-- Line 27 - Replace with your API key -->
src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&libraries=visualization&callback=initMap"
```

### Step 3: Run Local Web Server (Manual Setup Only)

From the `hw6` directory, start a local server:

```bash
# Python 3
python3 -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Or if you have Node.js
npx http-server -p 8000
```

### Step 4: View the Heat Maps (Manual Setup Only)

1. Open your browser to: `http://localhost:8000/app/index.html`
2. Use the toggle buttons to show/hide each heat map:
   - **Toggle Tesla Charging Stations** - Red/Yellow heat map
   - **Toggle Rest Areas** - Blue/Purple heat map
3. Zoom and pan to explore regional clustering patterns

## Docker Deployment

### Docker Files

The project includes a complete Docker setup:

- **Dockerfile** - Uses nginx:alpine to serve static files with entrypoint script
- **entrypoint.sh** - Shell script that injects environment variables into HTML at runtime
- **docker-compose.yml** - Orchestrates the container with environment variables
- **run.sh** - Convenient script to build and run the application
- **.env.local** - Environment variables for configuration
- **.gitignore** - Prevents sensitive files from being committed

### How Environment Variable Injection Works

The Docker setup automatically injects your Google Maps API key from the `.env.local` file into the HTML file at container startup:

1. You set `GOOGLE_MAPS_API_KEY` in `.env.local`
2. Docker Compose passes it as an environment variable to the container
3. The `entrypoint.sh` script runs at container startup
4. It replaces `YOUR_API_KEY` in `index.html` with your actual API key
5. Nginx serves the updated HTML with your credentials

This means you don't need to manually edit the HTML file - just configure `.env.local` and run!

### Docker Commands

```bash
# Build and run with the convenience script
./run.sh

# Or manually:
docker compose build
docker compose up -d
docker compose logs -f

# Stop the application
docker compose down

# Rebuild from scratch
docker compose build --no-cache
```

### Environment Variables

The application uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_MAPS_API_KEY` | Your Google Maps API key | `YOUR_API_KEY_HERE` |
| `PORT` | Port to expose the application | `8000` |

## GitHub Pages Deployment

This project includes automatic deployment to GitHub Pages using GitHub Actions.

### Setup GitHub Pages

1. **Create GitHub Repository**
   - Create a new repository named `google-maps-heatmap`
   - Push your code to the repository

2. **Add GitHub Secret**
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GOOGLE_MAPS_API_KEY`
   - Value: Your Google Maps API key
   - Click "Add secret"

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"
   - Save

4. **Deploy**
   - Push to `main` branch or trigger workflow manually
   - GitHub Actions will automatically:
     - Inject your API key from secrets
     - Build and deploy to GitHub Pages
   - Your site will be live at: `https://yourusername.github.io/google-maps-heatmap/`

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` file handles automatic deployment:
- Triggers on push to `main` branch
- Can be manually triggered via workflow_dispatch
- Injects API key from GitHub Secrets
- Deploys to GitHub Pages automatically

## Technical Implementation

### Data Processing
- **CSV Format Handling:** Both CSVs use `longitude,latitude` format
- **Coordinate Validation:** Filters invalid coordinates outside valid lat/lng ranges
- **Encoding:** Uses `latin-1` encoding to handle special characters
- **Output Format:** JSON arrays of objects with `{lat: number, lon: number}` structure

### Code Structure

The application is organized into separate files for better maintainability:

**Data Files:**
- `teslaStations.js` - Contains array of 3,536 Tesla charging station locations
- `restAreas.js` - Contains array of 3,032 rest area locations

```javascript
// Example structure (teslaStations.js)
const teslaStations = [
  {lat: 39.025534, lon: -94.249102},
  {lat: 30.720702, lon: -86.116677},
  // ... 3,536 total locations
];

// Example structure (restAreas.js)
const restAreas = [
  {lat: 61.800549, lon: -147.814902},
  {lat: 62.108634, lon: -145.477366},
  // ... 3,032 total locations
];
```

**Application Files:**
- `app.js` - Main application logic with Google Maps initialization
- `styles.css` - Styling for map container and controls
- `index.html` - HTML structure that ties everything together

### Heat Map Configuration

Located in `app.js`:

```javascript
// Tesla Stations - Default gradient (red/yellow)
heatmap = new google.maps.visualization.HeatmapLayer({
  data: getPoints(teslaStations),
  map: map,
  radius: 20,
});

// Rest Areas - Custom blue/purple gradient
heatmap2 = new google.maps.visualization.HeatmapLayer({
  data: getPoints(restAreas),
  map: null, // Start hidden
  radius: 20,
  gradient: [
    "rgba(0, 255, 255, 0)",   // Transparent cyan
    "rgba(0, 255, 255, 1)",   // Cyan
    "rgba(0, 127, 255, 1)",   // Blue
    "rgba(0, 0, 255, 1)",     // Deep blue
    "rgba(63, 0, 91, 1)",     // Purple
    "rgba(191, 0, 31, 1)",    // Red-purple
    "rgba(255, 0, 0, 1)"      // Red
  ]
});
```

## Files Structure

```
hw6/
├── README.md                                    # This file
├── Dockerfile                                   # Docker container configuration
├── entrypoint.sh                                # Environment variable injection script
├── docker-compose.yml                           # Docker Compose orchestration
├── run.sh                                       # Convenience script to run Docker
├── .env.local                                   # Environment variables (not committed)
├── .env.example.local                           # Template for environment variables
├── .gitignore                                   # Git ignore rules
├── .github/
│   └── workflows/
│       └── deploy.yml                           # GitHub Actions deployment workflow
├── app/
│   ├── index.html                               # Main HTML file
│   ├── app.js                                   # Application logic (1.9 KB)
│   ├── styles.css                               # Styles for map and controls
│   ├── config.js                                # API configuration (not committed)
│   ├── config.example.js                        # Template for config.js
│   ├── teslaStations.js                         # Tesla data array (184 KB)
│   ├── restAreas.js                             # Rest areas data array (158 KB)
│   ├── USA - Tesla Super Charging Stations.csv  # Raw Tesla dataset (2.2 MB)
│   └── RestAreasCombined_USA.csv                # Raw rest areas dataset (282 KB)
└── SimpleDemo/                                  # (gitignored)
    ├── googleHeatMap-Students.html              # Original template
    ├── index.html                               # Demo examples
    └── indexS.js                                # Demo JavaScript
```

## Customization Options

You can modify the following in `app/app.js`:

1. **Heat Map Radius** (lines 18, 25):
   ```javascript
   radius: 20, // Adjust for more/less spread
   ```

2. **Color Gradients** (lines 26-41):
   ```javascript
   gradient: ["rgba(0, 255, 255, 0)", ...] // Customize colors
   ```

3. **Initial Zoom/Center** (lines 10-11):
   ```javascript
   zoom: 4,
   center: { lat: 39.8283, lng: -98.5795 },
   ```

4. **Initial Visibility** (lines 17, 24):
   ```javascript
   map: map,  // Visible on load
   map: null, // Hidden on load
   ```

You can also customize styles in `app/styles.css` such as button colors, panel positioning, and map container styling.

## Data Sources

- **Tesla Charging Stations:** Alternative Fuels Data Center (U.S. Department of Energy)
- **Rest Areas:** Combined state DOT rest area databases

## Technologies Used

- Google Maps JavaScript API
- Google Maps Visualization Library (Heat Map Layer)
- HTML5 / CSS3
- Vanilla JavaScript (ES6+)
- Docker & Docker Compose
- Nginx (Alpine Linux)
- GitHub Actions (CI/CD)
- Python (for CSV data processing)

## Assignment Requirements Met

- Two distinct datasets with 100+ points each
- Clear regional clustering and interesting patterns
- Arrays of objects using JSON notation
- Embedded in HTML template structure
- Custom color properties for differentiation
- Interactive toggle functionality

---

*Created for GIST 5300 - Advanced GIS Applications*
