import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = 'everson@memorialconstrutora.com.br'

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('A chave da API do Resend (RESEND_API_KEY) não está configurada nas variáveis de ambiente da função.')
    }

    const { fullName, cpf, phone, email } = await req.json()

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
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
    })

    const data = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('Erro na API do Resend:', data)
      throw new Error(data.message || 'Falha ao enviar o e-mail de notificação.')
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})