# 📊 ملف التحسينات والأداء - Healthy Diet Academy

## **1️⃣ تحسينات الصور**

### ضغط الصور الحالية
استخدم أدوات مثل:
- [TinyPNG.com](https://tinypng.com) - ضغط PNG و JPG
- [ImageOptim](https://imageoptim.com) - للـ Mac
- [FileOptimizer](https://nikkhokkho.sourceforge.io/static.php?page=FileOptimizer) - للـ Windows

### خطوات الضغط:
```bash
# استخدم ImageMagick (إن كان مثبتاً)
convert السمنه_والنحافه_2.jpeg -strip -interlace Plane -gaussian-blur 0.05x20 -quality 85% السمنه_والنحافه_2.jpg

# أو استخدم FFmpeg
ffmpeg -i input.jpeg -q:v 5 output.jpg
```

### الحد الأدنى للأحجام:
- الشعار: < 50 KB
- صور المقالات: < 300 KB
- صور الشهادات: < 500 KB

---

## **2️⃣ تحسينات CSS/JavaScript**

### Minify CSS
أضف في Netlify build:
```bash
npm install -g csso-cli
csso index.html -o index.min.css
```

أو استخدم عبر الإنترنت:
- [CSS Minifier](https://cssminifier.com)
- [Minify Code](https://minifycode.com)

### Minify JavaScript
```bash
npm install -g uglify-js
uglifyjs server.js -o server.min.js -c -m
```

---

## **3️⃣ تحسينات الخادم**

### Gzip Compression
أضف في `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

ثم ثبّت:
```bash
npm install compression
```

### Caching Headers
أضف في `server.js`:
```javascript
app.use((req, res, next) => {
  if (req.url.endsWith('.jpg') || req.url.endsWith('.png')) {
    res.set('Cache-Control', 'public, max-age=31536000'); // سنة واحدة
  } else {
    res.set('Cache-Control', 'public, max-age=3600'); // ساعة واحدة
  }
  next();
});
```

### Rate Limiting
أضف في `server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب لكل IP
  message: 'طلبات كثيرة من هذا العنوان، يرجى المحاولة لاحقاً'
});

app.use('/api/', limiter);
```

ثبّت:
```bash
npm install express-rate-limit
```

---

## **4️⃣ تحسينات CDN**

### استخدام Cloudflare
1. اذهب إلى [cloudflare.com](https://cloudflare.com)
2. أضف موقعك
3. غيّر nameservers إلى Cloudflare
4. فعّل:
   - Auto Minify (JS + CSS)
   - Caching
   - Security

### استخدام Cloudinary للصور
```html
<img src="https://res.cloudinary.com/YOUR-CLOUD/image/upload/w_500,q_auto/السمنه_والنحافه_2.jpg" alt="">
```

---

## **5️⃣ تحسينات Frontend**

### Lazy Loading للصور
أضف في HTML:
```html
<img src="image.jpg" loading="lazy" alt="صورة">
```

### Preload الخطوط
أضف في `<head>`:
```html
<link rel="preload" as="font" href="fonts/cairo.woff2" crossorigin>
```

### Defer JavaScript غير الحرج
```html
<!-- ضع قبل </body> -->
<script defer src="analytics.js"></script>
```

---

## **6️⃣ تحسينات قاعدة البيانة**

### النسخ الاحتياطية
```bash
# نسخ احتياطية يومية
cp certificates.json certificates.json.backup.$(date +%Y-%m-%d)
```

### أرشفة البيانات
```bash
# أرشف البيانات القديمة (أكثر من سنة)
zip archive_2025.zip certificates.json
```

---

## **7️⃣ تقارير الأداء**

### Google PageSpeed Insights
```
https://pagespeed.web.dev/?url=healthyacademyegypt.com
```

### GTmetrix
```
https://gtmetrix.com
```

### WebPageTest
```
https://webpagetest.org
```

### الأهداف:
- Lighthouse Score: > 90
- Page Load Time: < 3 ثانية
- First Contentful Paint: < 1.8 ثانية

---

## **8️⃣ مراقبة الأمان**

### SSL/TLS
- تحقق من وجود 🔒 في المتصفح
- استخدم [SSL Labs](https://www.ssllabs.com/ssltest/) للاختبار

### أمان API
```javascript
// أضف CORS آمن
const cors = require('cors');
app.use(cors({
  origin: 'https://healthyacademyegypt.com',
  credentials: true
}));
```

### نسخة الرؤوس الأمنية
أضف في `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Strict-Transport-Security = "max-age=63072000"
```

---

## **9️⃣ التوثيق (Documentation)**

### API Documentation
أضف في `/api/docs`:
```json
{
  "endpoints": {
    "GET /api/health": "فحص حالة الخادم",
    "GET /api/cert/:id": "البحث عن شهادة",
    "POST /api/cert/search": "البحث المتقدم",
    "GET /api/courses": "جميع الكورسات",
    "GET /api/stats": "الإحصائيات"
  }
}
```

### Postman Collection
أنشئ مجموعة Postman لاختبار API:
```json
{
  "info": {
    "name": "Healthy Diet Academy API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Search Certificate",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/api/cert/HDA-2026-01"
      }
    }
  ]
}
```

---

## **🔟 مراقبة مستمرة**

### إعدادات Uptime Monitoring
استخدم:
- [UptimeRobot.com](https://uptimerobot.com) - مجاني
- [Pingdom](https://www.pingdom.com)

### أتمتة التنبيهات
```bash
# إضافة Webhook للتنبيهات
curl -X POST https://your-webhook.url/alert \
  -d "status=down&service=api"
```

---

## **Checklist الأداء النهائي**

- [ ] حجم الصور < 200 KB المجموع
- [ ] CSS مضغوط (< 50 KB)
- [ ] JavaScript مضغوط (< 30 KB)
- [ ] Gzip تفعيل
- [ ] Caching تفعيل
- [ ] HTTPS فعال
- [ ] Lighthouse > 90
- [ ] الزمن الأول < 3 ثانية
- [ ] Mobile responsive ✓
- [ ] API Response < 500ms

---

**آخر تحديث**: 23 يونيو 2026
