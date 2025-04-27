require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { google } = require('googleapis');
const stream = require('stream');

const app = express();

// 기본 라우트 추가
app.get('/', (req, res) => {
  res.send('Wedding Photo Upload Server is running');
});

// CORS 설정
app.use(cors());

// Multer 설정
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 제한
  }
});

// Google Drive API 설정
const auth = new google.auth.JWT(
  process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/drive.file']
);

const drive = google.drive({ version: 'v3', auth });

// 파일 업로드 엔드포인트
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ success: false, message: '파일이 없습니다.' });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${timestamp}_${file.originalname}`;
    
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream
      }
    });
    
    res.json({ success: true, fileId: response.data.id });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
