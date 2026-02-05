# Recipe API Backend

Backend API for Recipe management system built with Node.js, Express.js, and MongoDB.

## Features

- RESTful API endpoints
- MongoDB database with Mongoose ODM
- Pagination and sorting
- Advanced search with multiple filters
- NaN value handling for data integrity

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

## Installation

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend folder with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipe_db
NODE_ENV=development
```

4. Make sure MongoDB is running on your system

## Import Recipe Data

Before starting the server, import the recipe data:

```bash
npm run import
```

This will:
- Clear existing data
- Parse the JSON file
- Handle NaN values by converting them to NULL
- Import all valid recipes into MongoDB

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on http://localhost:5000

## API Endpoints

### 1. Get All Recipes (Paginated and Sorted)

**Endpoint:** `GET /api/recipes`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Number of recipes per page (default: 10)

**Example:**
```
GET http://localhost:5000/api/recipes?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 1500,
  "page": 1,
  "totalPages": 150,
  "data": [...]
}
```

### 2. Search Recipes

**Endpoint:** `GET /api/recipes/search`

**Query Parameters:**
- `calories` - Filter by calories (supports <=, >=, ==, <, >)
- `title` - Search by recipe title (partial match)
- `cuisine` - Filter by cuisine type
- `total_time` - Filter by total time in minutes (supports <=, >=, ==, <, >)
- `rating` - Filter by rating (supports <=, >=, ==, <, >)

**Examples:**

Search for pies with calories <= 400 and rating >= 4.5:
```
GET http://localhost:5000/api/recipes/search?calories=<=400&title=pie&rating=>=4.5
```

Search by cuisine:
```
GET http://localhost:5000/api/recipes/search?cuisine=Italian
```

Search by title:
```
GET http://localhost:5000/api/recipes/search?title=chocolate
```

## Database Schema

```javascript
{
  cuisine: String,
  title: String,
  rating: Number (nullable),
  prep_time: Number (nullable),
  cook_time: Number (nullable),
  total_time: Number (nullable),
  description: String,
  nutrients: Object (nullable),
  serves: String,
  ingredients: [String],
  instructions: [String]
}
```

## NaN Value Handling

As per requirements, any numeric fields (rating, prep_time, cook_time, total_time) that contain NaN values are converted to NULL before storing in the database.

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── recipeController.js # Route controllers
├── models/
│   └── Recipe.js           # Recipe schema
├── routes/
│   └── recipeRoutes.js     # API routes
├── scripts/
│   └── importData.js       # Data import script
├── .env                    # Environment variables
├── .gitignore             
├── package.json            
├── README.md              
└── server.js              # Express server
```

## Technologies Used

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variables management
- **cors** - Cross-origin resource sharing
- **nodemon** - Development auto-reload

## Author

Built as part of Recipe API Project
