const crypto = require('crypto');
const { sendJson } = require('./request');

const COOKIE_NAME = 'abex_admin';
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function base64Url(input) {
  return Buffer.from(input).toString('base64url');
}

function signToken(payload, secret) {
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64Url(payloadJson);
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

function verifyToken(token, secret) {
  if (!token) return null;
  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return null;
  const expected = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch (error) {
    return null;
  }
}

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    if (!cookie) continue;
    const [key, ...rest] = cookie.split('=');
    if (key === name) {
      return rest.join('=');
    }
  }
  return null;
}

function isLocalhost(host) {
  if (!host) return false;
  return host.includes('localhost') || host.includes('127.0.0.1');
}

function setCookie(res, name, value, options = {}) {
  const parts = [`${name}=${value}`];
  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }
  if (options.path) {
    parts.push(`Path=${options.path}`);
  }
  if (options.httpOnly) {
    parts.push('HttpOnly');
  }
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }
  if (options.secure) {
    parts.push('Secure');
  }
  res.setHeader('Set-Cookie', parts.join('; '));
}

function createAuthToken(username) {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) {
    throw new Error('Missing ADMIN_TOKEN_SECRET');
  }
  const payload = {
    sub: username,
    exp: Date.now() + TOKEN_TTL_SECONDS * 1000
  };
  return signToken(payload, secret);
}

function setAuthCookie(res, token, host) {
  setCookie(res, COOKIE_NAME, token, {
    maxAge: TOKEN_TTL_SECONDS,
    path: '/',
    httpOnly: true,
    sameSite: 'Strict',
    secure: !isLocalhost(host)
  });
}

function clearAuthCookie(res) {
  setCookie(res, COOKIE_NAME, '', {
    maxAge: 0,
    path: '/',
    httpOnly: true,
    sameSite: 'Strict'
  });
}

function requireAuth(req, res) {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) {
    sendJson(res, 500, { success: false, message: 'Server missing ADMIN_TOKEN_SECRET' });
    return false;
  }
  const token = getCookie(req, COOKIE_NAME);
  const payload = verifyToken(token, secret);
  if (!payload) {
    sendJson(res, 401, { success: false, message: 'Unauthorized' });
    return false;
  }
  req.admin = payload;
  return true;
}

module.exports = {
  COOKIE_NAME,
  createAuthToken,
  setAuthCookie,
  clearAuthCookie,
  requireAuth,
  verifyToken,
  getCookie
};
