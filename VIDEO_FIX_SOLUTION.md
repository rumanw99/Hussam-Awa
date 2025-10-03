# حل مشكلة الفيديوهات على Vercel

## المشكلة
الفيديوهات تعمل محلياً ولكن لا تعمل على Vercel لأن:
- Vercel لا يدعم ملفات كبيرة مثل الفيديوهات في مجلد `public`
- الفيديوهات المحلية لا يمكن الوصول إليها من الخادم السحابي

## الحل
رفع الفيديوهات إلى Vercel Blob Storage واستخدام الروابط السحابية.

## الخطوات التفصيلية

### 1. إعداد متغير البيئة
أنشئ ملف `.env.local` في الجذر الرئيسي:

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
6. ضعه في ملف `.env.local`

### 3. رفع الفيديوهات
```bash
# رفع الفيديوهات إلى Vercel Blob Storage
pnpm run upload-videos
```

### 4. تحديث البيانات
```bash
# تحديث data.json بالروابط الجديدة
pnpm run update-videos-data
```

### 5. النشر
```bash
# إضافة التغييرات
git add .

# عمل commit
git commit -m "Fix videos: Upload to Vercel Blob Storage"

# رفع التغييرات
git push
```

## الملفات المضافة
- `scripts/upload-videos.mjs` - سكريبت رفع الفيديوهات
- `scripts/update-videos-data.mjs` - سكريبت تحديث البيانات
- `VIDEO_UPLOAD_GUIDE.md` - دليل مفصل
- `VIDEO_FIX_SOLUTION.md` - هذا الملف

## النتيجة المتوقعة
بعد تطبيق هذه الخطوات:
- ✅ الفيديوهات ستعمل على Vercel
- ✅ تحسين سرعة التحميل
- ✅ دعم أفضل للمتصفحات المختلفة
- ✅ إمكانية إدارة الفيديوهات من لوحة الإدارة

## ملاحظات مهمة
- تأكد من صحة `BLOB_READ_WRITE_TOKEN`
- الفيديوهات الكبيرة قد تستغرق وقتاً أطول
- احتفظ بنسخة احتياطية من `data.json`
- بعد النجاح، يمكن حذف الفيديوهات من `public/video`
