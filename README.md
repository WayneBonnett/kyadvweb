# Kentucky ADV Blog

A personal blog website for sharing motorcycle adventures and GPX routes in Kentucky. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- GPX file upload and management
- Route visualization with Mapbox GL JS
- Public route downloads
- Responsive design
- Admin interface for content management

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Mapbox GL JS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file from `.env.local.example`
4. Add your Mapbox GL JS access token
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - React components
- `/src/utils` - Utility functions
- `/public/routes` - GPX files
- `/public/images` - Route images
- `/content/blog` - Blog posts

## License

MIT
