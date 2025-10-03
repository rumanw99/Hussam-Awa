# دليل رفع الفيديوهات إلى Vercel

## المشكلة
الفيديوهات المحلية في مجلد `public/video` لا تعمل على Vercel لأن Vercel لا يدعم ملفات كبيرة مثل الفيديوهات في مجلد `public`.

## الحل
رفع الفيديوهات إلى Vercel Blob Storage واستخدام الروابط السحابية.

## الخطوات

### 1. إعداد متغير البيئة
أنشئ ملف `.env.local` في الجذر الرئيسي للمشروع:

```env
# Admin Authentication
ADMIN_EMAIL=wardidea02@gmail.com
ADMIN_PASSWORD=ward123456

# JWT Secret for token generation
JWT_SECRET=mysecretkey

# Next.js Environment
NODE_ENV=development

# Vercel Blob Storage (for file uploads)
BLOB_READ_WRITE_TOKEN=your_actual_blob_token_here
```

### 2. الحصول على BLOB_READ_WRITE_TOKEN
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك
3. اذهب إلى Storage tab
4. أنشئ Blob Store جديد إذا لم يكن موجود
5. انسخ `BLOB_READ_WRITE_TOKEN`

### 3. رفع الفيديوهات
```bash
# تشغيل سكريبت رفع الفيديوهات
node scripts/upload-videos.js
```

### 4. تحديث data.json
بعد رفع الفيديوهات، ستحصل على بيانات JSON جديدة. استبدل قسم `videos` في `data.json` بالبيانات الجديدة.

### 5. النشر
```bash
# نشر التحديثات إلى Vercel
git add .
git commit -m "Update videos to use Vercel Blob Storage"
git push
```

## ملاحظات مهمة
- تأكد من أن `BLOB_READ_WRITE_TOKEN` صحيح
- الفيديوهات الكبيرة قد تستغرق وقتاً أطول في الرفع
- بعد الرفع، احذف الفيديوهات من مجلد `public/video` لتوفير المساحة
