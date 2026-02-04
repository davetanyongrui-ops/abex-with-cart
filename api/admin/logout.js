const { sendJson } = require('../_lib/request');
const { clearAuthCookie } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
  }

  clearAuthCookie(res);
  return sendJson(res, 200, { success: true });
};
