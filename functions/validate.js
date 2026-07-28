exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    const { token } = JSON.parse(event.body);
    
    // Validação simples (substitua pela sua lógica de banco depois)
    const isValid = token && token.startsWith('LIMBUS-');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        valid: isValid, 
        plan: isValid ? 'pro' : null,
        message: isValid ? 'Sucesso' : 'Token inválido'
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno' })
    };
  }
};
