// functions/validate.js
const { createClient } = require('@supabase/supabase-js');

// Pega as variáveis do ambiente do Netlify
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Inicializa o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  // Configuração de CORS para permitir acesso da Extensão Chrome
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Responde ao preflight do navegador
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Só aceita POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido' }) };
  }

  try {
    // Extrai o token enviado pela extensão
    const { token } = JSON.parse(event.body);

    if (!token) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ valid: false, message: 'Nenhuma chave fornecida' }) 
      };
    }

    // Busca na tabela 'licenses' onde a coluna 'key' seja igual ao token
    const { data, error } = await supabase
      .from('licenses')
      .select('key, status, plan') // Ajuste os campos conforme sua tabela
      .eq('key', token)
      .single();

    // Se não achar ou der erro
    if (error || !data) {
      return { 
        statusCode: 404, 
        headers, 
        body: JSON.stringify({ valid: false, message: 'Licença inválida' }) 
      };
    }

    // Verifica se a licença está ativa (se você tiver a coluna 'status')
    // Se não tiver coluna status, remova esse bloco 'if'
    if (data.status && data.status !== 'active') {
      return { 
        statusCode: 403, 
        headers, 
        body: JSON.stringify({ valid: false, message: 'Licença bloqueada' }) 
      };
    }

    // Sucesso
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ 
        valid: true, 
        plan: data.plan || 'basic',
        message: 'Licença ativada com sucesso' 
      }) 
    };

  } catch (err) {
    console.error('Erro na validação:', err);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ valid: false, message: 'Erro no servidor' }) 
    };
  }
};
