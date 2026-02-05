# Recipe Finder - Frontend

A modern, responsive React application for searching and viewing recipes with an elegant UI powered by Tailwind CSS v4 and smooth animations using Framer Motion.

## 🚀 Features

- **Recipe Table**: Display recipes in a clean table with truncated titles, star ratings, cuisine, time, and servings
- **Star Rating System**: Visual star representation (★/☆) for recipe ratings
- **Slide-in Drawer**: Animated right-side panel showing full recipe details
- **Advanced Search**: Filter recipes by title, cuisine, rating (≥), time (≤), and calories (≤)
- **Smart Pagination**: Customizable items per page (15-50) with page navigation
- **Responsive Design**: Mobile-friendly layout with collapsible filters
- **Smooth Animations**: Framer Motion for stagger effects, fades, and spring transitions
- **Loading States**: Skeleton screens and loading indicators

## 🛠️ Tech Stack

- **React 19.2.0** - Latest React with modern hooks
- **Vite 7.2.4** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion 11** - Production-ready animation library
- **Axios** - Promise-based HTTP client

## 📋 Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Backend API running at `http://localhost:5000`

## 🔧 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Environment Setup

The frontend connects to the backend API at `http://localhost:5000/api/recipes`. If your backend runs on a different port, update `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:YOUR_PORT/api/recipes';
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── RecipeTable.jsx       # Main table component with star ratings
│   │   ├── RecipeDrawer.jsx      # Slide-in detail panel
│   │   ├── SearchFilters.jsx     # Search and filter form
│   │   └── Pagination.jsx        # Pagination controls
│   ├── services/
│   │   └── api.js                # Axios API client
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles + Tailwind v4
├── public/                       # Static assets
├── index.html                    # HTML template
├── vite.config.js                # Vite configuration
└── package.json                  # Dependencies
```

## 🎨 Component Overview

### RecipeTable
Displays recipes in a responsive table format with:
- Truncated titles (hover to see full text)
- Star rating visualization (★★★★☆)
- Cuisine, total time, and servings columns
- Click-to-view-details functionality
- Loading skeleton and empty state

### RecipeDrawer
Slide-in panel from the right showing:
- Recipe title and cuisine header
- Full description
- Expandable time section (prep, cook, total)
- 9-field nutrition grid (calories, protein, fat, etc.)
- Expandable ingredients list
- Step-by-step instructions
- Close button and backdrop overlay

### SearchFilters
Advanced filtering with:
- Text search by title
- Dropdown for cuisine selection
- Rating filter (≥ operator)
- Time filter (≤ operator)
- Calories filter (≤ operator)
- Search and Clear buttons
- Responsive collapse on mobile

### Pagination
Smart pagination controls:
- Items per page selector (15, 25, 50)
- Previous/Next navigation
- First/Last page jumps
- Current page display
- Disabled states for boundaries

## 🎭 Animation Features

- **Stagger animations**: Table rows fade in sequentially
- **Spring physics**: Drawer slides with natural spring motion
- **Fade transitions**: Smooth content loading
- **Hover effects**: Scale and color transitions on interactive elements
- **Layout animations**: Smooth height changes for expandable sections

## 🔍 API Integration

### Endpoints Used

1. **Get All Recipes**
   - `GET /api/recipes?page={page}&limit={limit}`
   - Returns paginated recipe list

2. **Search Recipes**
   - `POST /api/recipes/search`
   - Request body:
     ```json
     {
       "title": "pasta",
       "cuisine": "Italian",
       "rating": ">=4.5",
       "time": "<=30",
       "calories": "<=500"
     }
     ```

## 🚦 Running the Application

1. **Start the backend server** (in backend folder):
   ```bash
   node server.js
   ```
   Backend will run on `http://localhost:5000`

2. **Start the frontend** (in frontend folder):
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open your browser** to `http://localhost:5173`

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (collapsed filters, stacked layout)
- **Tablet**: 640px - 1024px (optimized table columns)
- **Desktop**: > 1024px (full layout with all features)

## 🎯 User Flow

1. **Landing**: See paginated recipe table with 15 recipes
2. **Search**: Enter filters and click "Search"
3. **View**: Click any recipe row to open detail drawer
4. **Navigate**: Use pagination to browse more recipes
5. **Adjust**: Change items per page for different views

## 🐛 Troubleshooting

**Issue**: Recipes not loading
- ✅ Ensure backend is running on port 5000
- ✅ Check browser console for CORS errors
- ✅ Verify MongoDB connection in backend

**Issue**: Animations stuttering
- ✅ Reduce `itemsPerPage` to 15
- ✅ Check browser performance
- ✅ Disable browser extensions

**Issue**: Stars not displaying
- ✅ Check font family supports star characters
- ✅ Verify recipe rating values in database

## 🔮 Future Enhancements

- [ ] Recipe favoriting/bookmarking
- [ ] User authentication
- [ ] Recipe creation/editing
- [ ] Image upload support
- [ ] Shopping list generation
- [ ] Meal planning calendar
- [ ] Recipe sharing via links
- [ ] Dark mode support

## 📄 License

This project is created for placement assessment purposes.

## 👨‍💻 Developer

Built with ❤️ by Gokul Raj V for placement portfolio
