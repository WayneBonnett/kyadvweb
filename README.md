# Kentucky Adventure Website

A Next.js-based website for managing and displaying adventure routes, blog posts, and GPX tracks.

## Features

- 🗺️ GPX Route Management

  - Upload and manage GPX files
  - Display routes on interactive maps
  - Route statistics (distance, elevation)

- 📝 Blog System

  - Create, edit, and delete blog posts
  - Rich text editor
  - Image upload support
  - Markdown support

- 🔐 Admin Panel
  - Secure authentication
  - Route management
  - Blog post management
  - Content moderation

## Prerequisites

- Node.js (v18 or newer)
- npm (included with Node.js)
- Git

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/WayneBonnett/kyadvweb.git
   cd kyadvweb
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.local.example` to `.env.local`:
     ```bash
     cp .env.local.example .env.local
     ```
   - Update `.env.local` with your credentials:
     ```
     ADMIN_USERNAME=your_username
     ADMIN_PASSWORD_HASH=your_bcrypt_hash
     ```
     Note: To generate a bcrypt hash for your password, you can use an online bcrypt generator or a Node.js script.

4. Create required directories:

   ```bash
   mkdir -p public/content/gpx public/content/blog
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000` in your browser

## Project Structure

```
kyadvweb/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   └── utils/           # Utility functions
├── public/
│   └── content/
│       ├── gpx/         # Uploaded GPX files
│       └── blog/        # Blog content and images
├── scripts/             # Utility scripts
└── content/            # Static content
```

## Development

- The project uses Next.js 14 with App Router
- Styling is done with Tailwind CSS
- Authentication uses HTTP-only cookies
- File storage is used for blog posts and GPX files

## Production Deployment

For production deployment, consider:

1. Setting up proper environment variables
2. Implementing a database for content storage
3. Setting up HTTPS
4. Configuring proper file storage solution
5. Setting up proper backup systems

## File Storage

The project currently uses file-based storage:

- GPX files are stored in `/public/content/gpx/`
- Blog posts and images are stored in `/public/content/blog/`

When moving to a new environment, you'll need to:

1. Create these directories
2. Transfer any existing content
3. Ensure proper permissions are set

## Security Notes

1. Always use HTTPS in production
2. Keep your `.env.local` file secure and never commit it
3. Regularly update dependencies
4. Use strong passwords and secure password hashes
5. Consider implementing rate limiting for the admin login

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is private and proprietary. All rights reserved.

## Support

For support, please contact the repository owner.
