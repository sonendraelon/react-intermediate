# Store Browsing Web Application

## Overview
This is a React-based web application for browsing and filtering stores with advanced features like infinite scroll, category filtering, and local store bookmarking.

## Features
- Browse stores with infinite scrolling
- Filter stores by category
- Search stores by name
- Sort stores by various attributes
- Bookmark/favorite stores (persisted in local storage)
- Responsive design

## Prerequisites
- Node.js (v14+)
- npm

## Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/store-browsing-app.git
cd store-browsing-app
```

2. Install dependencies
```bash
npm install
```

3. Start JSON Server (Backend)
```bash
npx json-server --watch db.json --port 3001
```

4. Start React Development Server
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Technologies Used
- React
- React Router
- Axios
- JSON Server
- Tailwind CSS
- React Infinite Scroll Component

## API Endpoints
- Store List: `http://localhost:3001/stores`
- Categories: `http://localhost:3001/categories`

## Filtering and Sorting
The application supports various filtering and sorting options via URL parameters:
- Category filtering
- Store name search
- Sorting by name, featured status, popularity, and cashback

## Deployment
For deployment, consider using platforms like Netlify or Vercel, which support React applications.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss proposed changes.
