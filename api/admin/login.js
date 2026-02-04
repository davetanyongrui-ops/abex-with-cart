const { getJsonBody, sendJson } = require('../_lib/request');
const { createAuthToken, setAuthCookie } = require('../_lib/auth');
const { getSupabaseAdmin } = require('../_lib/supabase');
const { verifyPassword } = require('../_lib/password');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
  }

  const body = await getJsonBody(req);
  if (!body) {
    return sendJson(res, 400, { success: false, message: 'Invalid JSON' });
  }

  const username = String(body.username || '').trim();
  const password = String(body.password || '').trim();

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('admin_users')
      .select('username, password_hash')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      return sendJson(res, 500, { success: false, message: error.message });
    }

    if (!data || !verifyPassword(password, data.password_hash)) {
      return sendJson(res, 401, { success: false, message: 'Invalid credentials' });
    }

    const token = createAuthToken(username);
    setAuthCookie(res, token, req.headers.host || '');
    return sendJson(res, 200, { success: true });
  } catch (error) {
    return sendJson(res, 500, { success: false, message: error.message });
  }
};
