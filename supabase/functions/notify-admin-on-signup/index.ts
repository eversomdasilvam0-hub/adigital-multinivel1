import { corsHeaders } from '../_shared/cors.ts'

// ATENÇÃO: A chave da API do Resend será lida das variáveis de ambiente.
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = 'everson@memorialconstrutora.com.br';

Deno.serve(async (req: Request) => {
  // Trata a requisição de pre-flight do CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { fullName, cpf, phone, email } = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error('A chave da API do Resend (RESEND_API_KEY) não está configurada nas variáveis de ambiente da função.');
    }

    // Para enviar e-mails a partir do seu próprio domínio (ex: contato@sua-imobiliaria.com),
    // você precisa verificar seu domínio no painel do Resend.
    // Por enquanto, usaremos o domínio padrão de testes do Resend.
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Lasy App <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: 'Novo Corretor Cadastrado na Plataforma!',
        html: `
          <h1>Novo Cadastro de Corretor</h1>
          <p>Um novo corretor se cadastrou na plataforma Imobiliária MMN.</p>
          <hr>
          <h2>Dados do Corretor:</h2>
          <ul>
            <li><strong>Nome Completo:</strong> ${fullName}</li>
            <li><strong>CPF:</strong> ${cpf}</li>
            <li><strong>Telefone:</strong> ${phone}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Erro na API do Resend:', data);
        throw new Error(data.message || 'Falha ao enviar o e-mail de notificação.');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});