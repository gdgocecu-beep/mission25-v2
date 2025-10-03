import type { NextRequest } from 'next/server'

type Req = {
  message: string
  language?: string
  apiKey?: string
}

const cannedReply = (message = '', language = 'en') =>
  language === 'ar'
    ? 'أنا زيرو جي — أستطيع مساعدتك في أسئلة عن محطة الفضاء وNBL. كيف يمكنني مساعدتك؟'
    : "I'm Zero G — I can help with ISS and NBL questions. What would you like to know?"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Req
    const envKey = process.env.DEEPSEEK_API_KEY
    const envEndpoint = process.env.DEEPSEEK_ENDPOINT
    const key = envKey ?? body.apiKey
    if (!key || !envEndpoint) {
      return new Response(
        JSON.stringify({ error: 'ChatGPT_API_KEY or ChatGPT_ENDPOINT not set. Or include apiKey in request.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Forward message to Deepseek (adjust payload/headers per Deepseek docs)
    const resp = await fetch(envEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        // adapt field names to Deepseek API; many providers use "input" or "prompt"
        input: body.message ?? '',
        // include language if useful:
        language: body.language ?? 'en',
      }),
    })

    const text = await resp.text()
    if (!resp.ok) {
      // return provider error text to help debugging (do not log keys)
      return new Response(JSON.stringify({ error: text }), { status: resp.status, headers: { 'Content-Type': 'application/json' } })
    }

    // Try parse JSON and extract common reply fields; fallback to raw text
    let reply = ''
    try {
      const data = JSON.parse(text)
      // check common shapes; adjust as needed for Deepseek response format
      reply = data?.reply ?? data?.output ?? data?.text ?? (Array.isArray(data?.responses) ? data.responses[0]?.text : undefined) ?? JSON.stringify(data)
    } catch {
      reply = text
    }

    return new Response(JSON.stringify({ reply }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}