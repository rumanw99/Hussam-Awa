# إعداد المشروع على Vercel

## المشاكل التي تم حلها

### 1. مشكلة تسجيل دخول الآدمن
- ✅ تم إضافة متغيرات البيئة الافتراضية في الكود
- ✅ تم إنشاء ملف `vercel.json` مع متغيرات البيئة المطلوبة

### 2. مشكلة عدم ظهور الصور
- ✅ تم تحديث نظام رفع الملفات لاستخدام Vercel Blob Storage
- ✅ تم تحديث `next.config.mjs` لدعم Vercel Blob domains

### 3. مشكلة عدم حفظ التعديلات
- ✅ تم تحديث نظام التخزين لاستخدام Vercel KV في الإنتاج
- ✅ تم تحديث جميع ملفات API لتستخدم `async/await`

## المتطلبات

### 1. إعداد Vercel Blob Storage
1. اذهب إلى Vercel Dashboard
2. اختر مشروعك
3. اذهب إلى Storage tab
4. أنشئ Blob Store جديد
5. انسخ `BLOB_READ_WRITE_TOKEN` من Environment Variables

### 2. إعداد Vercel KV
1. اذهب إلى Vercel Dashboard
2. اختر مشروعك
3. اذهب إلى Storage tab
4. أنشئ KV Database جديد
5. انسخ `KV_REST_API_URL` و `KV_REST_API_TOKEN` من Environment Variables

### 3. متغيرات البيئة المطلوبة
في Vercel Dashboard > Settings > Environment Variables:

```
ADMIN_EMAIL=wardidea02@gmail.com
ADMIN_PASSWORD=ward123456
JWT_SECRET=mysecretkey
BLOB_READ_WRITE_TOKEN=your_blob_token
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
```

## كيفية النشر

1. **ارفع الكود إلى GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment issues"
   git push origin main
   ```

2. **اربط المشروع مع Vercel**
   - اذهب إلى Vercel Dashboard
   - اضغط "New Project"
   - اختر GitHub repository
   - اربط المشروع

3. **أضف متغيرات البيئة**
   - اذهب إلى Project Settings > Environment Variables
   - أضف جميع المتغيرات المذكورة أعلاه

4. **أضف Vercel Blob و KV**
   - اذهب إلى Storage tab
   - أضف Blob Store و KV Database
   - انسخ المتغيرات المطلوبة

## التحقق من الإعداد

بعد النشر، تحقق من:

1. **تسجيل دخول الآدمن**
   - اذهب إلى `/admin/login`
   - استخدم: `wardidea02@gmail.com` / `ward123456`

2. **رفع الصور**
   - اذهب إلى Admin Panel > Photos
   - جرب رفع صورة جديدة
   - تأكد من ظهورها في الصفحة الرئيسية

3. **حفظ التعديلات**
   - عدل أي محتوى في Admin Panel
   - تأكد من ظهور التعديلات في الصفحة الرئيسية

## استكشاف الأخطاء

### إذا لم يعمل تسجيل الدخول:
- تحقق من متغيرات البيئة في Vercel Dashboard
- تأكد من أن `ADMIN_EMAIL` و `ADMIN_PASSWORD` و `JWT_SECRET` محددة

### إذا لم تظهر الصور:
- تحقق من إعداد Vercel Blob Storage
- تأكد من `BLOB_READ_WRITE_TOKEN` في Environment Variables

### إذا لم تحفظ التعديلات:
- تحقق من إعداد Vercel KV
- تأكد من `KV_REST_API_URL` و `KV_REST_API_TOKEN` في Environment Variables

## ملاحظات مهمة

- المشروع يستخدم نظام هجين: ملفات محلية في التطوير، Vercel KV في الإنتاج
- جميع الصور الجديدة ستُحفظ في Vercel Blob Storage
- البيانات ستُحفظ في Vercel KV Database
- متغيرات البيئة لها قيم افتراضية للعمل في التطوير المحلي
