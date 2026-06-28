# 📋 نظام إدارة المحتوى (CMS) - خطوات التنفيذ

## **المرحلة الأولى: CMS بسيط يدوي**

### الخطوة 1: تحديث قاعدة البيانات يدويًا

**تعديل `certificates.json`:**
```json
{
  "certificates": {
    "HDA-2026-05": {
      "id": "HDA-2026-05",
      "studentName": "أحمد محمد",
      "courseName": "دبلومة جديدة",
      "issueDate": "2026-06-23",
      "grade": "امتياز",
      "certificateImage": "new-cert.png"
    }
  }
}
```

ثم:
```bash
git add certificates.json
git commit -m "Add new certificate"
git push origin main
```

---

## **المرحلة الثانية: CMS باستخدام Node/Express (متقدم)**

### الخطوة 1: تثبيت المكتبات الإضافية
```bash
npm install express-fileupload multer sharp dotenv
```

### الخطوة 2: إنشاء API للإضافة
أضف في `server.js`:
```javascript
// تحميل ملف للشهادة
app.post('/api/admin/cert/add', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id, studentName, courseName, issueDate, expiryDate, grade, score } = req.body;
    
    // التحقق من البيانات
    if (!id || !studentName || !courseName) {
      return res.status(400).json({ error: 'بيانات غير كاملة' });
    }

    // معالجة الصورة
    let imagePath = req.file ? req.file.filename : 'default.png';

    const newCert = {
      id,
      studentName,
      courseName,
      issueDate,
      expiryDate,
      grade: grade || 'جيد',
      score: score || 0,
      certificateImage: imagePath,
      isValid: true,
      createdAt: new Date().toISOString()
    };

    certificatesDB.certificates[id] = newCert;
    fs.writeFileSync('certificates.json', JSON.stringify(certificatesDB, null, 2));

    res.json({ success: true, message: 'تمت إضافة الشهادة', data: newCert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## **المرحلة الثالثة: CMS كامل مع واجهة (Headless CMS)**

### الخيار 1: استخدام Strapi (مجاني & قوي)
```bash
# تثبيت
npx create-strapi-app my-cms --quickstart

# تشغيل
npm run develop
```

**المميزات:**
- واجهة رسومية كاملة
- REST API تلقائي
- صلاحيات أدمن متقدمة
- مرن وموسع

### الخيار 2: استخدام Directus (مجاني & احترافي)
```bash
# تثبيت
npm install -g @directus/cli

# إنشاء project
directus create my-cms
```

### الخيار 3: استخدام Supabase (قاعدة بيانات + API)
1. اذهب إلى [supabase.com](https://supabase.com)
2. إنشاء project جديد
3. أنشئ جداول:
   - `certificates`
   - `courses`
   - `students`

---

## **المرحلة الرابعة: لوحة تحكم للمسؤول**

### إنشاء `/admin/index.html`:
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>لوحة التحكم - أكاديمية التغذية</title>
    <style>
        body { font-family: 'Cairo', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .dashboard { max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 8px; padding: 20px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn { background: #4A704A; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #385438; }
        input, textarea { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: right; padding: 10px; border-bottom: 1px solid #ddd; }
        th { background: #4A704A; color: white; }
    </style>
</head>
<body>
    <div class="dashboard">
        <h1>🎯 لوحة تحكم أكاديمية التغذية</h1>
        
        <!-- إضافة شهادة جديدة -->
        <div class="card">
            <h2>إضافة شهادة جديدة</h2>
            <form id="addCertForm">
                <input type="text" id="certId" placeholder="رمز الشهادة (HDA-2026-XX)" required>
                <input type="text" id="studentName" placeholder="اسم الخريج" required>
                <input type="text" id="courseName" placeholder="اسم الكورس" required>
                <input type="date" id="issueDate" required>
                <input type="date" id="expiryDate" required>
                <input type="number" id="score" placeholder="الدرجة" min="0" max="100">
                <input type="text" id="grade" placeholder="التقدير (امتياز/جيد...)">
                <input type="file" id="certImage" accept="image/*">
                <button type="submit" class="btn">إضافة الشهادة</button>
            </form>
        </div>

        <!-- قائمة الشهادات -->
        <div class="card">
            <h2>الشهادات المسجلة</h2>
            <table id="certificatesTable">
                <thead>
                    <tr>
                        <th>الرمز</th>
                        <th>اسم الخريج</th>
                        <th>الكورس</th>
                        <th>التقدير</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody id="certsBody"></tbody>
            </table>
        </div>
    </div>

    <script>
        const API_URL = 'http://localhost:3000';
        const ADMIN_KEY = localStorage.getItem('adminKey');

        // تحميل الشهادات
        async function loadCertificates() {
            const res = await fetch(`${API_URL}/api/courses`);
            const data = await res.json();
            // عرض في الجدول
        }

        // إضافة شهادة
        document.getElementById('addCertForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const certData = {
                id: document.getElementById('certId').value,
                studentName: document.getElementById('studentName').value,
                courseName: document.getElementById('courseName').value,
                issueDate: document.getElementById('issueDate').value,
                expiryDate: document.getElementById('expiryDate').value,
                score: parseInt(document.getElementById('score').value) || 0,
                grade: document.getElementById('grade').value
            };

            const res = await fetch(`${API_URL}/api/cert/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ADMIN_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ certData })
            });

            const result = await res.json();
            if (result.success) {
                alert('تمت إضافة الشهادة بنجاح');
                document.getElementById('addCertForm').reset();
                loadCertificates();
            } else {
                alert('خطأ: ' + result.message);
            }
        });

        loadCertificates();
    </script>
</body>
</html>
```

---

## **المرحلة الخامسة: نظام المستخدمين**

### جدول قاعدة البيانات (SQL):
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    role ENUM('admin', 'instructor', 'student'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    course_id VARCHAR(50),
    enrollment_date TIMESTAMP,
    completion_date TIMESTAMP NULL,
    progress INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## **نصائح الأمان للـ CMS**

```javascript
// حماية المسؤول
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const adminKey = process.env.ADMIN_KEY;
  
  if (token !== adminKey) {
    return res.status(403).json({ error: 'غير مصرح' });
  }
  next();
};

// تحقق من البيانات المدخلة
const validateInput = (data) => {
  if (!data.id || !data.studentName) {
    throw new Error('بيانات غير كاملة');
  }
  if (data.id.length > 50) {
    throw new Error('الرمز طويل جداً');
  }
};
```

---

## **خريطة الطريق المستقبلية**

| الميزة | الأولوية | الجدول الزمني |
|--------|----------|-------------|
| لوحة تحكم أساسية | عالية | الأسبوع 1 |
| نظام المستخدمين | عالية | الأسبوع 2-3 |
| نظام الدفع | متوسطة | الشهر 2 |
| تطبيق جوال | متوسطة | الشهر 3 |
| الذكاء الاصطناعي | منخفضة | الشهر 4+ |

---

**آخر تحديث**: 23 يونيو 2026
