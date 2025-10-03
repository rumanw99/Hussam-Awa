# دليل الإصلاح السريع - مشاكل Vercel

## المشاكل التي تم حلها ✅

### 1. تسجيل دخول الآدمن لا يعمل
**السبب:** متغيرات البيئة غير محددة على Vercel
**الحل:** 
- تم إضافة قيم افتراضية في الكود
- تم إنشاء ملف `vercel.json` مع المتغيرات المطلوبة

### 2. الصور لا تظهر
**السبب:** الصور محفوظة محلياً ولا تعمل على Vercel
**الحل:**
- تم تحديث نظام رفع الملفات لاستخدام Vercel Blob Storage
- تم تحديث `next.config.mjs` لدعم Vercel Blob domains

### 3. التعديلات لا تحفظ
**السبب:** ملف `data.json` لا يُحفظ على Vercel
**الحل:**
- تم تحديث نظام التخزين لاستخدام Vercel KV في الإنتاج
- تم تحديث جميع ملفات API لتستخدم `async/await`

## الخطوات التالية

### 1. أضف Vercel Blob Storage
```bash
# في Vercel Dashboard:
# 1. اذهب إلى Storage tab
# 2. أنشئ Blob Store جديد
# 3. انسخ BLOB_READ_WRITE_TOKEN
```

### 2. أضف Vercel KV Database
```bash
# في Vercel Dashboard:
# 1. اذهب إلى Storage tab  
# 2. أنشئ KV Database جديد
# 3. انسخ KV_REST_API_URL و KV_REST_API_TOKEN
```

### 3. أضف متغيرات البيئة
```bash
# في Vercel Dashboard > Settings > Environment Variables:
ADMIN_EMAIL=wardidea02@gmail.com
ADMIN_PASSWORD=ward123456
JWT_SECRET=mysecretkey
BLOB_READ_WRITE_TOKEN=your_blob_token
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
```

### 4. أعد النشر
```bash
git add .
git commit -m "Fix Vercel deployment issues"
git push origin main
```

## التحقق من الإصلاح

1. **تسجيل دخول الآدمن:** `/admin/login`
2. **رفع صورة جديدة:** Admin Panel > Photos
3. **تعديل محتوى:** Admin Panel > أي قسم
4. **التحقق من الصفحة الرئيسية:** تأكد من ظهور التعديلات

## إذا لم يعمل شيء

1. تحقق من متغيرات البيئة في Vercel Dashboard
2. تأكد من إعداد Vercel Blob و KV
3. أعد النشر بعد إضافة المتغيرات
4. تحقق من Console في Vercel Dashboard للأخطاء
