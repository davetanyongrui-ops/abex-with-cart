const Busboy = require('busboy');
const path = require('path');
const { requireAuth } = require('../_lib/auth');
const { sendJson } = require('../_lib/request');
const { getSupabaseAdmin, getSupabasePublicUrl } = require('../_lib/supabase');

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function sanitizeFilename(filename) {
  const base = path.basename(filename || 'upload');
  const ext = path.extname(base).toLowerCase();
  const name = base.replace(ext, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const safeExt = ext && ext.length <= 8 ? ext : '';
  return `${name || 'file'}${safeExt}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
  }

  if (!requireAuth(req, res)) {
    return;
  }

  const bucket = process.env.SUPABASE_BUCKET || 'product-images';

  let fileBuffer = null;
  let fileInfo = null;
  let uploadError = null;

  const busboy = Busboy({
    headers: req.headers,
    limits: {
      files: 1,
      fileSize: MAX_UPLOAD_BYTES
    }
  });

  busboy.on('file', (_field, file, info) => {
    const chunks = [];
    fileInfo = info;

    file.on('data', (chunk) => {
      chunks.push(chunk);
    });

    file.on('limit', () => {
      uploadError = 'File exceeds 10MB limit';
      file.resume();
    });

    file.on('end', () => {
      fileBuffer = Buffer.concat(chunks);
    });
  });

  busboy.on('error', (error) => {
    uploadError = error.message;
  });

  busboy.on('finish', async () => {
    if (uploadError) {
      return sendJson(res, 400, { success: false, message: uploadError });
    }

    if (!fileBuffer || !fileInfo) {
      return sendJson(res, 400, { success: false, message: 'No file uploaded' });
    }

    try {
      const supabase = getSupabaseAdmin();
      const filename = sanitizeFilename(fileInfo.filename);
      const objectPath = `products/${Date.now()}-${filename}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(objectPath, fileBuffer, {
          contentType: fileInfo.mimeType,
          upsert: false
        });

      if (error) {
        return sendJson(res, 500, { success: false, message: error.message });
      }

      const publicUrl = getSupabasePublicUrl(objectPath);
      return sendJson(res, 200, {
        success: true,
        url: publicUrl,
        path: objectPath
      });
    } catch (error) {
      return sendJson(res, 500, { success: false, message: error.message });
    }
  });

  req.pipe(busboy);
};
