require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { google } = require('googleapis');
const stream = require('stream');
const path = require('path');

const app = express();

// 기본 라우트 추가
app.get('/', (req, res) => {
  res.send('Wedding Photo Upload Server is running');
});

// CORS 설정
app.use(cors());

// Multer 설정
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 10
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('이미지 파일만 업로드 가능합니다.'));
        }
    }
}).array('photoInput', 10); // HTML input의 id와 일치하도록 'photoInput'으로 변경

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            error: `파일 업로드 오류: ${err.message}`
        });
    }
    res.status(500).json({
        success: false,
        error: err.message || '서버 오류가 발생했습니다.'
    });
});

app.post('/upload', async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }

        if (!req.files || !req.files.length) {
            return res.status(400).json({
                success: false,
                error: '업로드할 파일이 없습니다.'
            });
        }

        try {
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_CLIENT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
                },
                scopes: ['https://www.googleapis.com/auth/drive.file']
            });

            const drive = google.drive({ version: 'v3', auth });
            const uploadedFiles = [];

            for (const file of req.files) {
                const timestamp = new Date().getTime();
                const safeFileName = `${timestamp}_${file.originalname.replace(/[^a-zA-Z0-9가-힣\s.-]/g, '_')}`;

                const fileMetadata = {
                    name: safeFileName,
                    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
                };

                const media = {
                    mimeType: file.mimetype,
                    body: bufferToStream(file.buffer)
                };

                const driveResponse = await drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id,name,webViewLink'
                });

                uploadedFiles.push({
                    originalName: file.originalname,
                    driveId: driveResponse.data.id,
                    webViewLink: driveResponse.data.webViewLink
                });
            }

            res.json({
                success: true,
                files: uploadedFiles
            });
        } catch (error) {
            console.error('Upload to Drive error:', error);
            res.status(500).json({
                success: false,
                error: '파일 업로드 중 오류가 발생했습니다.'
            });
        }
    });
});

function bufferToStream(buffer) {
    const { Readable } = require('stream');
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    return readable;
}

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
