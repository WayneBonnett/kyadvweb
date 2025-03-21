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

## Deployment

### Web Hosting Setup

1. **Choose a Hosting Provider**

   - Recommended providers: Vercel, Netlify, or DigitalOcean App Platform
   - These platforms support Next.js out of the box

2. **Prepare Your Project**

   ```bash
   # Build the project
   npm run build

   # Test the production build locally
   npm start
   ```

3. **Environment Setup**

   - Set up environment variables in your hosting provider's dashboard
   - Required variables:
     ```
     ADMIN_USERNAME=your_username
     ADMIN_PASSWORD_HASH=your_bcrypt_hash
     NODE_ENV=production
     ```

4. **File Storage**

   - For production, consider using a cloud storage service:
     - AWS S3
     - Google Cloud Storage
     - Azure Blob Storage
   - Update the file storage paths in your code to use the cloud storage URLs

5. **Database Setup**

   - For production, set up a proper database:
     - MongoDB Atlas
     - PostgreSQL
     - MySQL
   - Update your API routes to use the database instead of file storage

6. **Domain and SSL**

   - Purchase a domain name
   - Set up SSL certificate (usually provided by hosting provider)
   - Configure domain DNS settings

7. **Deployment Steps**

   ```bash
   # For Vercel
   vercel deploy

   # For Netlify
   netlify deploy

   # For DigitalOcean
   doctl apps create
   ```

8. **Post-Deployment**
   - Test all features:
     - User authentication
     - File uploads
     - Blog post creation
     - Route management
   - Set up monitoring and logging
   - Configure backups
   - Set up CI/CD pipeline

### Production Considerations

1. **Performance**

   - Enable caching
   - Use CDN for static assets
   - Implement image optimization
   - Enable compression

2. **Security**

   - Enable HTTPS
   - Set up proper CORS policies
   - Implement rate limiting
   - Regular security updates

3. **Monitoring**

   - Set up error tracking (e.g., Sentry)
   - Monitor server resources
   - Set up uptime monitoring
   - Configure alerts

4. **Backup Strategy**
   - Regular database backups
   - File storage backups
   - Configuration backups
   - Disaster recovery plan

### Shared Hosting Setup (Without Bash Access)

1. **Choose a Hosting Provider**

   - Look for providers that support Node.js applications
   - Common options:
     - Hostinger
     - A2 Hosting
     - HostGator
     - Bluehost

2. **Prepare Your Project**

   ```bash
   # On your local machine:
   npm run build
   ```

   This will create a `.next` folder with the production build

3. **Upload Files**

   - Log into your hosting control panel
   - Use the File Manager or FTP client (like FileZilla) to upload:
     - All files from your project EXCEPT:
       - `node_modules` folder
       - `.git` folder
       - `.env` and `.env.local` files
     - Make sure to maintain the folder structure

4. **Environment Setup**

   - In your hosting control panel:
     - Find the "Environment Variables" or "Application Settings" section
     - Add these variables:
       ```
       ADMIN_USERNAME=your_username
       ADMIN_PASSWORD_HASH=your_bcrypt_hash
       NODE_ENV=production
       ```

5. **Node.js Setup**

   - In your hosting control panel:
     - Set Node.js version to 18 or newer
     - Set the entry point to `server.js` (create this file)
     - Set the application root to your project folder

6. **Create server.js**
   Create this file in your project root:

   ```javascript
   const { createServer } = require("http");
   const { parse } = require("url");
   const next = require("next");

   const dev = process.env.NODE_ENV !== "production";
   const app = next({ dev });
   const handle = app.getRequestHandler();

   app.prepare().then(() => {
     createServer((req, res) => {
       const parsedUrl = parse(req.url, true);
       handle(req, res, parsedUrl);
     }).listen(process.env.PORT || 3000, (err) => {
       if (err) throw err;
       console.log("> Ready on http://localhost:" + (process.env.PORT || 3000));
     });
   });
   ```

7. **File Storage**

   - Create a folder named `storage` in your project root
   - Update file paths in your code to use this folder
   - Make sure the folder has write permissions (usually 755)

8. **Domain Setup**

   - Point your domain to the hosting provider
   - Enable SSL certificate (usually available in hosting control panel)
   - Configure domain settings in your hosting control panel

9. **Post-Deployment**
   - Test all features through your domain
   - Check file uploads work
   - Verify authentication
   - Test blog functionality

### Troubleshooting Shared Hosting

1. **Common Issues**

   - If you get a 500 error:
     - Check the error logs in your hosting control panel
     - Verify all environment variables are set
     - Ensure Node.js version is correct
   - If file uploads fail:
     - Check folder permissions
     - Verify storage path is correct
   - If the site doesn't load:
     - Check if the Node.js application is running
     - Verify port settings

2. **Performance Tips**

   - Enable caching in your hosting control panel
   - Use a CDN for static assets
   - Optimize images before upload
   - Enable compression

3. **Security**
   - Keep your `.env` file secure
   - Use strong passwords
   - Enable SSL
   - Regular backups through hosting control panel

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
