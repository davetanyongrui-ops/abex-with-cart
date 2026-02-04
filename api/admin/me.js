const { sendJson } = require('../_lib/request');
const { requireAuth } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
  }

  if (!requireAuth(req, res)) {
    return;
  }

  return sendJson(res, 200, { success: true, user: req.admin.sub });
};
