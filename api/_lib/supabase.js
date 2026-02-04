const { createClient } = require('@supabase/supabase-js');

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, key, {
    auth: { persistSession: false }
  });
}

function getSupabasePublicUrl(path) {
  const url = process.env.SUPABASE_URL;
  const bucket = process.env.SUPABASE_BUCKET || 'product-images';
  if (!url) {
    throw new Error('Missing SUPABASE_URL');
  }
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}

module.exports = {
  getSupabaseAdmin,
  getSupabasePublicUrl
};
