const { getSupabaseAdmin } = require('./_lib/supabase');
const { sendJson } = require('./_lib/request');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, price, image_url, category')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      return sendJson(res, 500, { success: false, message: error.message });
    }

    return sendJson(res, 200, {
      success: true,
      products: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    return sendJson(res, 500, { success: false, message: error.message });
  }
};
