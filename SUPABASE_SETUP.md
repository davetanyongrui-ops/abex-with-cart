# Supabase Setup for ABEX Admin (Vercel)

This guide sets up the product database + image uploads so `/admin` works on Vercel.

## 1) Create Supabase project
- Go to Supabase and create a new project.
- Keep the database password safe.

## 2) Create products table
Run this SQL in Supabase SQL editor:

```sql
create table if not exists products (
  id text primary key,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  category text
);
```

## 2b) Create admin users table
Run this SQL in Supabase SQL editor:

```sql
create table if not exists admin_users (
  username text primary key,
  password_hash text not null
);
```

## 2c) Add your first admin user
Generate a password hash, then insert it:

```sql
insert into admin_users (username, password_hash)
values ('admin', 'REPLACE_WITH_HASH');
```

I included a quick way to generate the hash below.

## 3) Add a storage bucket
- Go to Storage and create a bucket named `product-images`.
- Make the bucket **public** (so images can be shown on the website).

## 4) Add environment variables in Vercel
In Vercel Project Settings → Environment Variables, set:

- `SUPABASE_URL` = Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = Service role key (keep private)
- `SUPABASE_BUCKET` = `product-images`
- `ADMIN_TOKEN_SECRET` = random secret string (32+ chars recommended)

## 5) Local dev (optional)
If you want to test locally, create a `.env` file:

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_BUCKET=product-images
ADMIN_TOKEN_SECRET=...
```

## 5b) Generate password hash
You can generate the hash locally with Node:

```bash
node -e \"const crypto=require('crypto');const salt=crypto.randomBytes(16);crypto.scrypt('YOUR_PASSWORD',salt,64,(e,dk)=>{if(e)throw e;console.log(salt.toString('hex')+':'+dk.toString('hex'))});\"\n```

## 6) Deploy
- Deploy to Vercel.
- Visit `/admin` and log in.
- Add products and upload images.

## Notes
- Image uploads are limited to **10MB** by the server.
- The public website pulls product data from `/api/products`.
