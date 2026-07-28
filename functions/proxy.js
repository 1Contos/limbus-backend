const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const { action, token, email, password, session_token } = body;

    // --- NOVA FUNCIONALIDADE: VALIDAR LICENÇA ---
    if (action === 'validate_license') {
      if (!token) {
        return { statusCode: 400, headers, body: JSON.stringify({ valid: false, message: 'Token ausente' }) };
      }

      const { data, error } = await supabase
        .from('limbus_licenses')
        .select('is_active, plan')
        .eq('token', token)
        .single();

      if (error || !data) {
        return { statusCode: 404, headers, body: JSON.stringify({ valid: false, message: 'Licença inválida' }) };
      }

      if (!data.is_active) {
        return { statusCode: 403, headers, body: JSON.stringify({ valid: false, message: 'Licença bloqueada' }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ valid: true, plan: data.plan }) };
    }

    // --- FUNCIONALIDADE ANTIGA: POOL DE CONTAS ---
    if (action === 'get_token') {
      const { data, error } = await supabase
        .from('accounts_pool')
        .select('session_token')
        .eq('active', true)
        .order('last_used_at', { ascending: true })
        .limit(1)
        .single();

      if (error || !data) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'No tokens available' }) };
      }

      await supabase
        .from('accounts_pool')
        .update({ last_used_at: new Date() })
        .eq('session_token', data.session_token);

      return { statusCode: 200, headers, body: JSON.stringify({ token: data.session_token }) };
    }

    if (action === 'add_token') {
      const { error } = await supabase
        .from('accounts_pool')
        .insert([{ email, password, session_token, active: true }]);

      if (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to add token' }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action' }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
