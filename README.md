# Hostinger Ecommerce API

Production-oriented **Express** REST API with **Supabase (PostgreSQL)** or **MySQL**, **JWT admin auth**, **multer** image uploads, and Hostinger-friendly deployment.

## Features

- **API versioning**: `/api/v1/...`
- **Admin auth**: `POST /api/v1/auth/login` (bcrypt + JWT)
- **Products**: full CRUD, pagination metadata, search, filters, sorting, soft delete, image upload
- **Categories**: full CRUD, unlimited nesting via `parent_id`, tree or flat listing, image upload, soft delete
- **Security**: Helmet, CORS, rate limiting, JWT middleware on mutating routes, parameterized SQL, input validation

## Requirements

- Node.js **18+**
- **Supabase** project (PostgreSQL) **or** local MySQL **8+**

## Supabase setup

Your project URL and publishable key go in `.env` (already wired as `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`).

The **publishable key** is for client apps. This API uses **direct SQL** to Postgres, so you also need the **database password**:

1. [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings → Database**.
2. Copy the **database password** (or reset it).
3. Add to `.env` **one** of:

   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.vdasoslimprrlkjyuvjh.supabase.co:5432/postgres
   ```

   or:

   ```env
   SUPABASE_DB_PASSWORD=YOUR_PASSWORD
   SUPABASE_PROJECT_REF=vdasoslimprrlkjyuvjh
   ```

4. **SQL Editor** → run the full script in `database/schema.postgres.sql`.
5. **Connection string (IPv4 / Windows):** Settings → Database → if you see **“Not IPv4 compatible”**, open **Pooler settings** → **Session** mode → copy the **URI** into `.env` as `DATABASE_URL=...`  
   - Correct format: `postgresql://postgres:YOUR_PASSWORD@host:5432/postgres` (**colon** before password)  
   - Wrong (from some UI copies): `postgresql://postgresYOUR_PASSWORD@...` (missing `:`)  
   - Or set `SUPABASE_USE_POOLER=true` and `SUPABASE_POOLER_HOST=aws-0-....pooler.supabase.com` from Pooler settings.
6. Test: `node scripts/test-db.js` then `npm start`
7. `GET /api/v1/health` should show `"database": { "driver": "postgres", "connected": true }`.

Optional: add `SUPABASE_SERVICE_ROLE_KEY` from **Settings → API** if you later use `@supabase/supabase-js` for Storage/Auth on the server.

**Security:** If you shared API keys in chat or git, rotate them in Supabase → Settings → API.

## Quick start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and set database credentials and a strong `JWT_SECRET`.

3. **Create schema**

   - **Supabase:** run `database/schema.postgres.sql` in the SQL Editor.  
   - **MySQL:** import `database/schema.sql` (leave `DATABASE_URL` empty; use `DB_*` vars).

4. **Default admin (from seed SQL)**

   - Username: `admin`  
   - Email: `admin@example.com`  
   - Password: `Admin@123`  

   **Change this password immediately** in production (generate a bcrypt hash with Node and update the row).

5. **Run**

   ```bash
   npm start
   ```

   The server uses `process.env.PORT`, defaults to `3000`, and listens on **`0.0.0.0`** for shared hosting compatibility.

6. **Health check**

   `GET /api/v1/health`

## Hostinger (shared hosting) notes

- **Build command:** `npm run build` (required by Hostinger; this project has no compile step — the script exits successfully).
- **Start command:** `npm start` (runs `node server.js`).
- **Output directory:** leave empty or use project root (there is no `dist/` folder).
- **Do not upload `node_modules`** — Hostinger runs `npm install` during deploy.
- Set the application **entry file** to `server.js` (or your panel’s equivalent).
- Ensure **`PORT`** is provided by the host (the template uses `process.env.PORT || 3000`).
- Copy all variables from `.env.example` into hPanel → **Environment variables**.
- Node version in hPanel: **20** or **22** recommended (must match `engines` in `package.json`).
- Uploads are stored under `src/uploads/products` and `src/uploads/categories`, served at `/uploads/...`.
- Keep `JWT_SECRET` long and random; never commit real `.env` files.

## Main endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v1/auth/login` | No |
| GET | `/api/v1/products` | No |
| GET | `/api/v1/products/:id` | No |
| POST | `/api/v1/products` | JWT |
| PUT | `/api/v1/products/:id` | JWT |
| DELETE | `/api/v1/products/:id` | JWT |
| GET | `/api/v1/categories?format=tree\|flat` | No |
| GET | `/api/v1/categories/:id` | No |
| POST | `/api/v1/categories` | JWT |
| PUT | `/api/v1/categories/:id` | JWT |
| DELETE | `/api/v1/categories/:id` | JWT |

### Login response shape

```json
{
  "success": true,
  "token": "<jwt>",
  "admin": { "id": 1, "username": "admin" }
}
```

### Typical success envelope

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {}
}
```

### Image uploads

- Field name: **`image`**
- Allowed: **jpg, jpeg, png, webp**
- Max size: **5 MB**
- Returned/stored URL pattern: `/uploads/products/<file>` or `/uploads/categories/<file>`

Use `multipart/form-data` when sending a file; other fields can be sent in the same request.

## Project structure

```
server.js
src/
  app.js
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
  validations/
  uploads/
database/
  schema.sql
  schema.postgres.sql
```

## License

MIT
