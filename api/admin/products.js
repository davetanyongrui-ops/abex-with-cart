const { getJsonBody, sendJson } = require('../_lib/request');
const { requireAuth } = require('../_lib/auth');
const { getSupabaseAdmin } = require('../_lib/supabase');

function parseIdFromUrl(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return url.searchParams.get('id');
  } catch (error) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (!requireAuth(req, res)) {
    return;
  }

  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, price, image_url, category')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      return sendJson(res, 500, { success: false, message: error.message });
    }

    return sendJson(res, 200, { success: true, products: data || [] });
  }

  if (req.method === 'POST') {
    const body = await getJsonBody(req);
    if (!body) {
      return sendJson(res, 400, { success: false, message: 'Invalid JSON' });
    }

    const product = {
      id: String(body.id || '').trim(),
      name: String(body.name || '').trim(),
      description: String(body.description || '').trim(),
      price: Number(body.price),
      image_url: String(body.image_url || '').trim(),
      category: String(body.category || '').trim()
    };

    if (!product.id || !product.name || Number.isNaN(product.price)) {
      return sendJson(res, 400, { success: false, message: 'Missing required fields' });
    }

    const { error } = await supabase.from('products').insert([product]);
    if (error) {
      return sendJson(res, 500, { success: false, message: error.message });
    }

    return sendJson(res, 200, { success: true });
  }

  if (req.method === 'PUT') {
    const body = await getJsonBody(req);
    if (!body) {
      return sendJson(res, 400, { success: false, message: 'Invalid JSON' });
    }

    const id = String(body.id || '').trim();
    if (!id) {
      return sendJson(res, 400, { success: false, message: 'Missing product id' });
    }

    const updates = {
      name: String(body.name || '').trim(),
      description: String(body.description || '').trim(),
      price: Number(body.price),
      image_url: String(body.image_url || '').trim(),
      category: String(body.category || '').trim()
    };

    if (!updates.name || Number.isNaN(updates.price)) {
      return sendJson(res, 400, { success: false, message: 'Missing required fields' });
    }

    const { error } = await supabase.from('products').update(updates).eq('id', id);
    if (error) {
      return sendJson(res, 500, { success: false, message: error.message });
    }

    return sendJson(res, 200, { success: true });
  }

  if (req.method === 'DELETE') {
    const id = parseIdFromUrl(req);
    if (!id) {
      return sendJson(res, 400, { success: false, message: 'Missing product id' });
    }

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      return sendJson(res, 500, { success: false, message: error.message });
    }

    return sendJson(res, 200, { success: true });
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return sendJson(res, 405, { success: false, message: 'Method not allowed' });
};
