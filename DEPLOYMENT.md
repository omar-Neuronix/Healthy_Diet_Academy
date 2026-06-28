# 🚀 دليل التثبيت والنشر - Healthy Diet Academy

## **المرحلة 1: التجهيز المحلي**

### الخطوة 1.1: نسخ متغيرات البيئة
```bash
cp .env.example .env
```

قم بتعديل `.env` وأضف قيمك الخاصة (Google Analytics ID، مفتاح المسؤول، إلخ).

### الخطوة 1.2: تثبيت المكتبات
```bash
npm install
```

### الخطوة 1.3: تشغيل الخادم محلياً
```bash
npm start
```

ستظهر رسالة:
```
✅ الخادم يعمل على: http://localhost:3000
📊 التحقق من الصحة: http://localhost:3000/api/health
🔍 البحث عن شهادة: POST http://localhost:3000/api/cert/:certId
📚 الكورسات: http://localhost:3000/api/courses
📈 الإحصائيات: http://localhost:3000/api/stats
```

### الخطوة 1.4: اختبار الخادم
افتح في المتصفح:
```
http://localhost:3000/api/health
http://localhost:3000/api/courses
http://localhost:3000/api/stats
```

جرّب البحث عن شهادة:
```
http://localhost:3000/api/cert/HDA-2026-01
```

---

## **المرحلة 2: إعداد Git و GitHub**

### الخطوة 2.1: إنشاء مستودع محلي
```bash
cd "منصة Healthy Diet Academy"
git init
git add .
git commit -m "Initial commit: Healthy Diet Academy Platform"
```

### الخطوة 2.2: إنشاء مستودع على GitHub
1. اذهب إلى [github.com](https://github.com)
2. أنقر على `New Repository`
3. أسمه: `healthy-diet-academy`
4. اختر `Public` (ليظهر في البحث)
5. انقر `Create Repository`

### الخطوة 2.3: ربط المستودع و دفع الملفات
```bash
git remote add origin https://github.com/YOUR-USERNAME/healthy-diet-academy.git
git branch -M main
git push -u origin main
```

---

## **المرحلة 3: نشر Frontend على Netlify**

### الخطوة 3.1: تحضير الملفات للنشر
```bash
# تأكد من أن جميع الملفات موجودة:
# - index.html
# - verify.html
# - sitemap.xml
# - robots.txt
# - certificates.json
# - public/images/
```

### الخطوة 3.2: نشر على Netlify
**الطريقة الأولى: عبر Netlify UI**
1. اذهب إلى [netlify.com](https://netlify.com)
2. اضغط `Sign up` > اختر GitHub
3. اضغط `New site from Git`
4. اختر repository `healthy-diet-academy`
5. اترك الإعدادات الافتراضية و اضغط `Deploy site`

**الطريقة الثانية: عبر CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

سيمنحك Netlify عنوان URL مؤقت مثل:
```
https://XXXXX.netlify.app
```

---

## **المرحلة 4: نشر Backend على Railway / Render**

### الخطوة 4.1: إنشاء حساب على Railway
1. اذهب إلى [railway.app](https://railway.app)
2. اضغط `Login with GitHub`
3. اختر Repository `healthy-diet-academy`

### الخطوة 4.2: إضافة متغيرات البيئة
في لوحة Railway:
```
PORT=3000
NODE_ENV=production
ADMIN_KEY=your-secure-key-here
```

### الخطوة 4.3: النشر التلقائي
Railway سينشر تلقائياً مع كل push على GitHub.

العنوان سيكون مثل:
```
https://healthy-diet-academy-prod.up.railway.app
```

---

## **المرحلة 5: شراء نطاق و تشغيل DNS**

### الخطوة 5.1: شراء نطاق
خيارات موثوقة:
- [Namecheap](https://namecheap.com)
- [GoDaddy](https://godaddy.com)
- [Google Domains](https://domains.google.com)

اشتري: `healthyacademyegypt.com` (~$10-15/سنة)

### الخطوة 5.2: ربط النطاق بـ Netlify
في Netlify:
1. اذهب إلى `Domain settings`
2. اضغط `Add a domain`
3. أدخل `healthyacademyegypt.com`
4. انسخ nameservers من Netlify
5. اذهب إلى لوحة تحكم النطاق و أضف nameservers

### الخطوة 5.3: إعداد HTTPS
Netlify يوفر SSL مجاني تلقائياً.

---

## **المرحلة 6: تسجيل في Google Search Console**

### الخطوة 6.1: التسجيل
1. اذهب إلى [search.google.com/search-console](https://search.google.com/search-console)
2. اضغط `Start now`
3. أضف Property: `https://healthyacademyegypt.com`

### الخطوة 6.2: التحقق من الملكية
اختر:
- HTML tag (انسخ واضفه في `<head>`)
- أو DNS record

### الخطوة 6.3: إرسال Sitemap
1. اذهب إلى `Sitemaps`
2. أضف: `https://healthyacademyegypt.com/sitemap.xml`
3. اضغط `Submit`

---

## **المرحلة 7: إضافة Google Analytics**

### الخطوة 7.1: إنشاء GA4 Property
1. اذهب إلى [analytics.google.com](https://analytics.google.com)
2. اضغط `Create property`
3. أسم: `Healthy Diet Academy`
4. انسخ ID (مثل: `G-XXXXXXXXXX`)

### الخطوة 7.2: تحديث الكود
استبدل في `index.html` و `verify.html`:
```
G-XXXXXXXXXX → (ضع ID الحقيقي)
```

---

## **المرحلة 8: اختبار شامل**

### الاختبار الوظيفي
- [ ] افتح الموقع: https://healthyacademyegypt.com
- [ ] جرّب البحث: `HDA-2026-01`
- [ ] تحقق من الشهادة تظهر
- [ ] حمّل الصورة
- [ ] اختبر الروابط
- [ ] تفقد الصيانة على الهاتف

### اختبار SEO
- [ ] افتح Google Search Console
- [ ] اختبر الفهرسة: `site:healthyacademyegypt.com`
- [ ] تحقق من Sitemap: `site:healthyacademyegypt.com/sitemap.xml`

### اختبار الأداء
- [ ] استخدم [PageSpeed Insights](https://pagespeed.web.dev)
- [ ] أدخل: `healthyacademyegypt.com`
- [ ] حسّن حسب التوصيات

---

## **المرحلة 9: تحسينات إضافية**

### إضافة اسم نطاق ثانوي للـ API
أضف DNS record:
```
Name: api
Type: CNAME
Value: healthy-diet-academy-prod.up.railway.app
```

### تفعيل caching في Netlify
أنشئ `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "max-age=3600"
```

### تفعيل Redirects
أضف في `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://api.healthyacademyegypt.com/api/:splat"
  status = 200
```

---

## **الخطوات التشغيلية المستمرة**

### النسخ الاحتياطية
```bash
# النسخ الاحتياطية اليومية
git push origin main
```

### مراقبة الأداء
- راقب Google Search Console أسبوعياً
- راقب Google Analytics للزيارات
- راقب Railway/Netlify للأخطاء

### تحديث المحتوى
```bash
# تعديل البيانات
nano certificates.json

# دفع التحديثات
git add certificates.json
git commit -m "Update certificates"
git push origin main
```

---

## **الأوامر السريعة**

```bash
# بدء التطوير
npm start

# إيقاف الخادم
Ctrl + C

# نشر على Netlify
netlify deploy --prod

# نشر على Railway
git push origin main

# تحديث المستودع
git pull origin main
```

---

## **استكشاف الأخطاء**

| المشكلة | الحل |
|--------|-----|
| `npm: command not found` | ثبّت Node.js من [nodejs.org](https://nodejs.org) |
| خطأ في الاتصال بـ API | تحقق من أن Railway API يعمل |
| الموقع لا يظهر | انتظر 5-10 دقائق للفهرسة |
| DNS لم يعمل | انتظر 24-48 ساعة لتحديث DNS |

---

**آخر تحديث**: 23 يونيو 2026
