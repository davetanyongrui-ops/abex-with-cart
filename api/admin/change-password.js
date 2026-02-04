const { getJsonBody, sendJson } = require('../_lib/request');
const { requireAuth } = require('../_lib/auth');
const { getSupabaseAdmin } = require('../_lib/supabase');
const { verifyPassword, hashPassword } = require('../_lib/password');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
  }

  if (!requireAuth(req, res)) {
    return;
  }

  const body = await getJsonBody(req);
  if (!body) {
    return sendJson(res, 400, { success: false, message: 'Invalid JSON' });
  }

  const currentPassword = String(body.current_password || '').trim();
  const newPassword = String(body.new_password || '').trim();

  if (!currentPassword || !newPassword) {
    return sendJson(res, 400, { success: false, message: 'Missing password fields' });
  }

  if (newPassword.length < 8) {
    return sendJson(res, 400, { success: false, message: 'New password must be at least 8 characters' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const username = req.admin.sub;

    const { data, error } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      return sendJson(res, 500, { success: false, message: error.message });
    }

    if (!data || !verifyPassword(currentPassword, data.password_hash)) {
      return sendJson(res, 401, { success: false, message: 'Current password is incorrect' });
    }

    const passwordHash = hashPassword(newPassword);
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ password_hash: passwordHash })
      .eq('username', username);

    if (updateError) {
      return sendJson(res, 500, { success: false, message: updateError.message });
    }

    return sendJson(res, 200, { success: true });
  } catch (error) {
    return sendJson(res, 500, { success: false, message: error.message });
  }
};
