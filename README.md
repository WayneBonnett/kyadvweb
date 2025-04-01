# Kentucky ADV Website

A modern web application for sharing and managing outdoor adventures in Kentucky, featuring GPX route sharing, blog posts, and interactive maps.

## Features

- 🗺️ Interactive GPX route visualization
- 📝 Blog post management
- 🔐 Secure admin authentication
- 📱 Responsive design
- 🗺️ Mapbox GL JS integration
- 📤 GPX file upload and management
- 🔒 Secure file handling

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

3. Create environment files:

   - Copy `.env.local.example` to `.env.local`
   - Update the values in `.env.local`:
     ```
     ADMIN_USERNAME=your_username
     ADMIN_PASSWORD_HASH=your_password_hash
     JWT_SECRET=your_jwt_secret
     NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
     ```
   - Generate a password hash using:
     ```bash
     npm run generate-password-hash
     ```

4. Create required directories:

   ```bash
   mkdir -p public/content/gpx public/content/blog
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
kyadvweb/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── api/            # API routes
│   │   ├── blog/           # Blog pages
│   │   └── routes/         # Route pages
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   └── types/              # TypeScript type definitions
├── public/
│   └── content/           # User-uploaded content
│       ├── gpx/           # GPX files
│       └── blog/          # Blog post images
└── scripts/               # Utility scripts
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run generate-password-hash` - Generate password hash for admin

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub

2. Connect your repository to Vercel:

   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository
   - Configure the project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next
     - Install Command: `npm install`

3. Set up environment variables in Vercel:

   - Go to Project Settings > Environment Variables
   - Add the following variables:
     ```
     ADMIN_USERNAME=your_username
     ADMIN_PASSWORD_HASH=your_password_hash
     JWT_SECRET=your_jwt_secret
     NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
     ```

4. Deploy:
   - Click "Deploy"
   - Vercel will automatically deploy your site

### Shared Hosting Deployment (Without Bash Access)

1. **Prepare Your Files**

   - Build your project locally:
     ```bash
     npm run build
     ```
   - Create a `server.js` file in the root directory:

     ```javascript
     const { createServer } = require("http");
     const { parse } = require("url");
     const next = require("next");

     const dev = process.env.NODE_ENV !== "production";
     const hostname = "localhost";
     const port = process.env.PORT || 3000;
     const app = next({ dev, hostname, port });
     const handle = app.getRequestHandler();

     app.prepare().then(() => {
       createServer(async (req, res) => {
         try {
           const parsedUrl = parse(req.url, true);
           await handle(req, res, parsedUrl);
         } catch (err) {
           console.error("Error occurred handling", req.url, err);
           res.statusCode = 500;
           res.end("Internal Server Error");
         }
       })
         .once("error", (err) => {
           console.error(err);
           process.exit(1);
         })
         .listen(port, () => {
           console.log(`> Ready on http://${hostname}:${port}`);
         });
     });
     ```

2. **Upload Files**

   - Use File Manager in your hosting control panel or FTP client (like FileZilla)
   - Upload all files maintaining the folder structure
   - Exclude:
     - `node_modules/`
     - `.git/`
     - `.env` files
     - `.next/` (will be rebuilt on the server)

3. **Configure Hosting**

   - Set Node.js version to 18 or newer
   - Set the entry point to `server.js`
   - Configure environment variables in your hosting control panel
   - Set up your domain and SSL certificate

4. **File Storage**

   - Create a `storage` folder for uploads
   - Set proper permissions (755)
   - Update file paths in your code to use this folder

5. **Start the Application**
   - The hosting provider should automatically start your application
   - If not, use their control panel to start the Node.js application

### Common Issues and Solutions

1. **File Upload Issues**

   - Ensure the upload directory exists and has proper permissions
   - Check file size limits in your hosting configuration
   - Verify the file path is correct for your hosting environment

2. **Environment Variables**

   - Double-check all environment variables are set correctly
   - Ensure sensitive data is not exposed in client-side code
   - Use proper environment variable naming conventions

3. **Build Errors**

   - Clear the `.next` directory and rebuild
   - Check Node.js version compatibility
   - Verify all dependencies are installed correctly

4. **Database Connection**
   - Ensure database credentials are correct
   - Check if the database server is accessible
   - Verify network security settings

## Security Considerations

1. **Environment Variables**

   - Never commit `.env` files to version control
   - Use different credentials for development and production
   - Regularly rotate sensitive credentials

2. **File Uploads**

   - Validate file types and sizes
   - Scan for malware
   - Use secure file storage locations

3. **Authentication**

   - Use secure session management
   - Implement rate limiting
   - Enable HTTPS

4. **API Security**
   - Validate all input
   - Implement proper CORS policies
   - Use secure headers

## File Storage

The application uses a file-based storage system for:

- GPX files: `public/content/gpx/`
- Blog post images: `public/content/blog/`

For production deployments, consider:

- Using a CDN for static assets
- Implementing cloud storage (e.g., AWS S3)
- Setting up proper backup systems

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the repository owner.
