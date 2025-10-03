# حل سريع لمشكلة الفيديوهات على Vercel

## المشكلة
الفيديوهات تعمل محلياً ولكن لا تعمل على Vercel.

## الحل السريع

### 1. إعداد متغير البيئة
أنشئ ملف `.env.local` في الجذر الرئيسي:

```env
BLOB_READ_WRITE_TOKEN=your_actual_blob_token_here
```

### 2. الحصول على BLOB_READ_WRITE_TOKEN
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك
3. اذهب إلى Storage tab
4. أنشئ Blob Store جديد
5. انسخ `BLOB_READ_WRITE_TOKEN`

### 3. رفع الفيديوهات الموجودة
```bash
# رفع الفيديوهات المحلية إلى Vercel Blob Storage
pnpm run upload-videos

# تحديث data.json بالروابط الجديدة
pnpm run update-videos-data
```

### 4. النشر
```bash
git add .
git commit -m "Fix videos: Use Vercel Blob Storage"
git push
```

## النتيجة
✅ الفيديوهات ستعمل على Vercel
✅ يمكن رفع فيديوهات جديدة من لوحة الإدارة
✅ تحسين الأداء والسرعة

## ملاحظة
بعد النجاح، يمكن حذف الفيديوهات من مجلد `public/video` لتوفير المساحة.
