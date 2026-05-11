import { streamText } from 'ai'
import { geminiModel } from '@/ai/models'

export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT = `Você é o FinBot, um assistente financeiro amigável do aplicativo Finwise, especializado em ajudar investidores iniciantes a entender gráficos de preços de ativos financeiros.

Suas diretrizes:
- Use linguagem simples e acessível, sem jargões técnicos desnecessários
- Quando usar termos técnicos (ex: "tendência de alta", "suporte", "resistência"), explique brevemente o que significa
- Seja encorajador e educativo, nunca assustador ou alarmista
- NUNCA dê recomendações de compra ou venda específicas
- Foque em educar o investidor para que ele mesmo tome decisões
- Responda sempre em português brasileiro
- Seja conciso mas completo — respostas entre 3 e 8 parágrafos curtos
- Use emojis ocasionalmente para tornar a conversa mais leve 📊

Quando analisar um gráfico:
1. Descreva o que o gráfico mostra (período, ativo, variação)
2. Identifique a tendência geral (alta, baixa, lateralização)
3. Explique o que isso pode significar de forma simples
4. Mencione o volume se relevante
5. Conclua com uma perspectiva educativa`

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: Request) {
  try {
    const { messages, ticker, chartSummary } = await request.json() as {
      messages: Message[]
      ticker?: string
      chartSummary?: string
    }

    const contextMessage = ticker
      ? `\n\n[CONTEXTO DO GRÁFICO ATUAL]\nAtivo analisado: ${ticker}\n${chartSummary ?? ''}`
      : ''

    const result = streamText({
      model: geminiModel,
      system: SYSTEM_PROMPT + contextMessage,
      messages,
      maxOutputTokens: 1024,
    })

    return result.toTextStreamResponse()
  } catch (err) {
    console.error('[chart-assistant]', err)
    return Response.json(
      { error: 'Erro ao processar sua pergunta. Tente novamente.' },
      { status: 500 }
    )
  }
}
