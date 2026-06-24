const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true,
  methods: ['GET', 'POST'],
  credentials: false
}));
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// تقديم الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// تحميل قاعدة البيانات
let certificatesDB = {};
const CERTIFICATES_PATH = path.join(__dirname, 'certificates.json');
try {
  const data = fs.readFileSync(CERTIFICATES_PATH, 'utf8');
  certificatesDB = JSON.parse(data);
} catch (err) {
  console.error('خطأ في تحميل قاعدة البيانات:', err);
  certificatesDB = { certificates: {}, courses: {}, stats: {}, settings: {} };
}


// =====================
// API Routes
// =====================

// الصحة
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

function parseBearerToken(authHeader) {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const parts = authHeader.trim().split(/\s+/);
  if (parts.length === 2 && /^bearer$/i.test(parts[0])) return parts[1];
  return null;
}

function requireAdmin(req, res) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    res.status(500).json({
      success: false,
      message: 'سوء إعداد السيرفر: يرجى ضبط ADMIN_KEY في المتغيرات البيئية'
    });
    return null;
  }
  const token = parseBearerToken(req.headers.authorization);
  if (!token || token !== adminKey) {
    res.status(401).json({
      success: false,
      message: 'غير مصرح'
    });
    return null;
  }
  return token;
}

// التحقق من الشهادة
app.get('/api/cert/:certId', (req, res) => {
  try {
    const certId = req.params.certId.toUpperCase().trim();
    
    if (!certId) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال رمز الشهادة'
      });
    }

    const certificate = certificatesDB.certificates[certId];

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'الرمز غير صحيح أو الشهادة غير مسجلة في أنظمتنا'
      });
    }

if (!certificate.isValid) {
      return res.status(403).json({
        success: false,
        message: 'هذه الشهادة ملغاة أو منتهية الصلاحية'
      });
    }

    const expiryDate = certificate.expiryDate || null;

    // إرجاع بيانات الشهادة
    res.json({
      success: true,
      data: {
        id: certificate.id,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        issueDate: certificate.issueDate,
        grade: certificate.grade,
        score: certificate.score,
        verificationCode: certificate.verificationCode,
        issuer: certificate.issuer,
        expiryDate: expiryDate,
        stamp: certificate.stamp,
        certificateImage: certificate.certificateImage
      }
    });
  } catch (err) {
    console.error('خطأ في البحث:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// البحث عن الشهادات
app.post('/api/cert/search', (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال معايير البحث'
      });
    }

    const searchTerm = query.toLowerCase();
    const results = [];

    for (const [key, cert] of Object.entries(certificatesDB.certificates)) {
      if (
        cert.studentName.includes(searchTerm) ||
        cert.courseName.includes(searchTerm) ||
        key.includes(searchTerm)
      ) {
        results.push({
          id: cert.id,
          studentName: cert.studentName,
          courseName: cert.courseName,
          issueDate: cert.issueDate
        });
      }
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (err) {
    console.error('خطأ في البحث:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// الحصول على الكورسات
app.get('/api/courses', (req, res) => {
  try {
    const courses = Object.values(certificatesDB.courses);
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    console.error('خطأ في جلب الكورسات:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// الحصول على الإحصائيات
app.get('/api/stats', (req, res) => {
  try {
    res.json({
      success: true,
      data: certificatesDB.stats
    });
  } catch (err) {
    console.error('خطأ في جلب الإحصائيات:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// جلب رابط الامتحان (عام)
app.get('/api/exam-link', (req, res) => {
  try {
    const settings = certificatesDB.settings || {};
    res.json({
      success: true,
      data: {
        active_exam_link: settings.active_exam_link || null
      }
    });
  } catch (err) {
    console.error('خطأ في جلب رابط الامتحان:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// تحديث رابط الامتحان (إداري ومحمى)
app.post('/api/admin/exam-link', (req, res) => {
  try {
    const token = requireAdmin(req, res);
    if (!token) return;

    const { active_exam_link } = req.body || {};


    if (!active_exam_link || typeof active_exam_link !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'يرجى إرسال active_exam_link كنص URL صالح'
      });
    }

    let url;
    try {
      url = new URL(active_exam_link);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'active_exam_link ليس URL صالح'
      });
    }

    certificatesDB.settings = certificatesDB.settings || {};
    certificatesDB.settings.active_exam_link = url.toString();

    fs.writeFileSync(
      CERTIFICATES_PATH,
      JSON.stringify(certificatesDB, null, 2)
    );

    res.json({
      success: true,
      message: 'تم تحديث رابط الامتحان بنجاح',
      data: { active_exam_link: certificatesDB.settings.active_exam_link }
    });
  } catch (err) {
    console.error('خطأ في تحديث رابط الامتحان:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// =====================
// إدارة الشهادات (Admin)
// =====================

// ملاحظة: Endpoints إداريّة ويجب حمايتها بـ ADMIN_KEY في المتغيرات البيئية.

// عرض جميع الشهادات
app.get('/api/admin/certs', (req, res) => {
  try {
    const token = requireAdmin(req, res);
    if (!token) return;

    const certs = certificatesDB.certificates || {};
    const data = Object.values(certs).map(c => ({
      id: c.id,
      studentName: c.studentName,
      courseName: c.courseName,
      issueDate: c.issueDate,
      expiryDate: c.expiryDate || null,
      grade: c.grade,
      score: c.score,
      verificationCode: c.verificationCode,
      issuer: c.issuer,
      stamp: c.stamp,
      certificateImage: c.certificateImage,
      isValid: c.isValid
    }));

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    console.error('خطأ في عرض الشهادات:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// تفاصيل شهادة
app.get('/api/admin/cert/:certId', (req, res) => {
  try {
    const token = requireAdmin(req, res);
    if (!token) return;

    const certId = (req.params.certId || '').toUpperCase().trim();
    if (!certId) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال رمز الشهادة' });
    }

    const certificate = (certificatesDB.certificates || {})[certId];
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'الشهادة غير موجودة' });
    }

    res.json({ success: true, data: certificate });
  } catch (err) {
    console.error('خطأ في جلب تفاصيل الشهادة:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
  }
});

// تعديل شهادة
app.put('/api/admin/cert/:certId', (req, res) => {
  try {
    const token = requireAdmin(req, res);
    if (!token) return;

    const certId = (req.params.certId || '').toUpperCase().trim();
    if (!certId) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال رمز الشهادة' });
    }

    const { certData } = req.body || {};
    if (!certData || typeof certData !== 'object') {
      return res.status(400).json({ success: false, message: 'certData غير صحيح' });
    }

    if (!certificatesDB.certificates) certificatesDB.certificates = {};
    if (!certificatesDB.certificates[certId]) {
      return res.status(404).json({ success: false, message: 'الشهادة غير موجودة' });
    }

    // id يجب أن يبقى كما هو
    const updated = {
      ...certificatesDB.certificates[certId],
      ...certData,
      id: certId
    };

    // تطبيع بعض الحقول
    if (updated.issueDate) updated.issueDate = new Date(updated.issueDate).toISOString();
    if (updated.expiryDate) updated.expiryDate = new Date(updated.expiryDate).toISOString();
    if (updated.score !== undefined) updated.score = Number(updated.score);

    certificatesDB.certificates[certId] = updated;

    fs.writeFileSync(CERTIFICATES_PATH, JSON.stringify(certificatesDB, null, 2));

    res.json({ success: true, message: 'تم تحديث الشهادة بنجاح', data: updated });
  } catch (err) {
    console.error('خطأ في تحديث الشهادة:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
  }
});

// حذف شهادة
app.delete('/api/admin/cert/:certId', (req, res) => {
  try {
    const token = requireAdmin(req, res);
    if (!token) return;

    const certId = (req.params.certId || '').toUpperCase().trim();
    if (!certId) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال رمز الشهادة' });
    }

    if (!certificatesDB.certificates || !certificatesDB.certificates[certId]) {
      return res.status(404).json({ success: false, message: 'الشهادة غير موجودة' });
    }

    delete certificatesDB.certificates[certId];

    fs.writeFileSync(CERTIFICATES_PATH, JSON.stringify(certificatesDB, null, 2));

    res.json({ success: true, message: 'تم حذف الشهادة بنجاح' });
  } catch (err) {
    console.error('خطأ في حذف الشهادة:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
  }
});

// إضافة شهادة جديدة (للاستخدام الداخلي)
app.post('/api/cert/add', (req, res) => {
  try {
    const token = requireAdmin(req, res);
    if (!token) return;

    const { certData } = req.body;

    if (!certData || !certData.id) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير كاملة'
      });
    }

    certificatesDB.certificates[certData.id] = {
      ...certData,
      createdAt: new Date().toISOString()
    };

    // حفظ في قاعدة البيانات
    fs.writeFileSync(
      CERTIFICATES_PATH,
      JSON.stringify(certificatesDB, null, 2)
    );


    res.json({
      success: true,
      message: 'تم إضافة الشهادة بنجاح',
      data: certData
    });
  } catch (err) {
    console.error('خطأ في إضافة الشهادة:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// معالج الأخطاء 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'الصفحة غير موجودة',
    path: req.path
  });
});

// معالج الأخطاء العام
app.use((err, req, res, next) => {
  console.error('خطأ:', err);
  res.status(500).json({
    success: false,
    message: 'حدث خطأ في الخادم',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// =====================
// Start Server
// =====================

app.listen(PORT, () => {
  console.log(`\n✅ الخادم يعمل على: http://localhost:${PORT}`);
  console.log(`📊 التحقق من الصحة: http://localhost:${PORT}/api/health`);
  console.log(`🔍 البحث عن شهادة: POST http://localhost:${PORT}/api/cert/:certId`);
  console.log(`📚 الكورسات: http://localhost:${PORT}/api/courses`);
  console.log(`📈 الإحصائيات: http://localhost:${PORT}/api/stats\n`);
});

module.exports = app;
