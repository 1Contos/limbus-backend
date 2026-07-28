// functions/validate.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  // Headers CORS agressivos para funcionar em mobile/extensões
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { token } = JSON.parse(event.body);

    if (!token) {
      return { statusCode: 400, headers, body: JSON.stringify({ valid: false, message: 'Token ausente' }) };
    }

    const { data, error } = await supabase
      .from('licenses')
      .select('key, status, plan')
      .eq('key', token)
      .single();

    if (error || !data) {
      return { statusCode: 404, headers, body: JSON.stringify({ valid: false, message: 'Licença inválida' }) };
    }

    if (data.status && data.status !== 'active') {
      return { statusCode: 403, headers, body: JSON.stringify({ valid: false, message: 'Licença inativa' }) };
    }

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ valid: true, plan: data.plan || 'basic' }) 
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ valid: false, message: 'Erro interno' }) };
  }
};
