   const { createClient } = require('@supabase/supabase-js');

   // Inicializa o cliente Supabase
   const supabase = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_KEY
   );

   exports.handler = async (event, context) => {
     // Permite CORS (importante para a extensão chamar a API)
     const headers = {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Headers': 'Content-Type',
       'Access-Control-Allow-Methods': 'POST, OPTIONS'
     };

     // Trata preflight request do CORS
     if (event.httpMethod === 'OPTIONS') {
       return { statusCode: 204, headers, body: '' };
     }

     if (event.httpMethod !== 'POST') {
       return {
         statusCode: 405,
         headers,
         body: JSON.stringify({ error: 'Method not allowed' })
       };
     }

     try {
       const { action, email, password, session_token } = JSON.parse(event.body);

       if (action === 'get_token') {
         // Busca um token ativo
         const { data, error } = await supabase
           .from('accounts_pool')
           .select('session_token')
           .eq('active', true)
           .order('last_used_at', { ascending: true })
           .limit(1)
           .single();

         if (error || !data) {
           return {
             statusCode: 500,
             headers,
             body: JSON.stringify({ error: 'No tokens available' })
           };
         }

         // Atualiza data de uso
         await supabase
           .from('accounts_pool')
           .update({ last_used_at: new Date() })
           .eq('session_token', data.session_token);

         return {
           statusCode: 200,
           headers,
           body: JSON.stringify({ token: data.session_token })
         };
       }

       if (action === 'add_token') {
         // Adiciona novo token
         const { error } = await supabase
           .from('accounts_pool')
           .insert([{ email, password, session_token, active: true }]);

         if (error) {
           return {
             statusCode: 500,
             headers,
             body: JSON.stringify({ error: 'Failed to add token' })
           };
         }

         return {
           statusCode: 200,
           headers,
           body: JSON.stringify({ success: true })
         };
       }

       return {
         statusCode: 400,
         headers,
         body: JSON.stringify({ error: 'Invalid action' })
       };

     } catch (err) {
       return {
         statusCode: 500,
         headers,
         body: JSON.stringify({ error: err.message })
       };
     }
   };
