# متغيرات البيئة المطلوبة

## للتطوير المحلي
أنشئ ملف `.env.local` في الجذر الرئيسي للمشروع:

```env
# Admin Authentication
ADMIN_EMAIL=wardidea02@gmail.com
ADMIN_PASSWORD=ward123456

# JWT Secret for token generation
JWT_SECRET=mysecretkey

# Next.js Environment
NODE_ENV=development
```

## للإنتاج على Vercel
أضف هذه المتغيرات في Vercel Dashboard > Settings > Environment Variables:

```env
# Admin Authentication
ADMIN_EMAIL=wardidea02@gmail.com
ADMIN_PASSWORD=ward123456

# JWT Secret for token generation
JWT_SECRET=mysecretkey

# Vercel Blob Storage (for file uploads)
BLOB_READ_WRITE_TOKEN=your_blob_token_here

# Vercel KV Database (for data persistence)
KV_REST_API_URL=your_kv_url_here
KV_REST_API_TOKEN=your_kv_token_here

# Next.js Environment
NODE_ENV=production
```

## كيفية الحصول على القيم

### Vercel Blob Storage
1. اذهب إلى Vercel Dashboard
2. اختر مشروعك
3. اذهب إلى Storage tab
4. أنشئ Blob Store جديد
5. انسخ `BLOB_READ_WRITE_TOKEN`

### Vercel KV Database
1. اذهب إلى Vercel Dashboard
2. اختر مشروعك
3. اذهب إلى Storage tab
4. أنشئ KV Database جديد
5. انسخ `KV_REST_API_URL` و `KV_REST_API_TOKEN`
