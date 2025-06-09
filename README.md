# SEO SaaS Platform

Platform SEO berbasis AI yang menyediakan tools untuk analisis dan optimasi website.

## Fitur Utama

1. **SEO Scanner**
   - Analisis website dengan AI
   - Identifikasi masalah SEO
   - Rekomendasi perbaikan

2. **Keyword Heat Map**
   - Visualisasi distribusi keyword
   - Analisis performa konten
   - Optimasi keyword placement

3. **Citation Management**
   - Manajemen backlink
   - Analisis citations
   - Monitoring social mentions

## Teknologi yang Digunakan

- Next.js 14
- TypeScript
- Chakra UI
- Tailwind CSS
- Prisma (untuk database)
- NextAuth.js (untuk autentikasi)

## Cara Menjalankan Project

1. Clone repository
```bash
git clone [url-repository]
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env.local
```

4. Jalankan development server
```bash
npm run dev
```

5. Buka [http://localhost:3000](http://localhost:3000) di browser

## Deployment

Project ini dioptimalkan untuk deployment di Vercel. Untuk deploy:

1. Push code ke repository GitHub
2. Import project di Vercel
3. Setup environment variables
4. Deploy

## Kontribusi

Silakan buat issue atau pull request untuk kontribusi.

## Lisensi

MIT 

## Database Management

### SQLite Database

This project uses SQLite as the database. The database file is located at `./dev.db` in the project root.

#### Backup Instructions

1. **Manual Backup:**
   - Copy the `dev.db` file to a secure location
   - Recommended to backup before major updates or deployments

2. **Automated Backup (Optional):**
   ```bash
   # Create a backup directory
   mkdir backups
   
   # Create a backup script (backup.sh)
   #!/bin/bash
   cp dev.db backups/dev.db.$(date +%Y%m%d_%H%M%S)
   ```

#### Database Migration

The project uses Prisma for database management. To run migrations:

```bash
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Apply migrations
npx prisma migrate deploy
```

#### Testing Database

Run the database tests to ensure everything is working correctly:

```bash
npm run test
```

### Important Notes

1. **File Location:**
   - Database file: `./dev.db`
   - Migrations: `./prisma/migrations/`
   - Schema: `./prisma/schema.prisma`

2. **Environment Variables:**
   ```
   DATABASE_URL="file:./dev.db"
   ```

3. **Performance Considerations:**
   - SQLite is suitable for development and small to medium applications
   - For production with high concurrency, consider migrating to PostgreSQL

4. **Security:**
   - Add `dev.db` to `.gitignore`
   - Regularly backup the database file
   - Keep the database file in a secure location 