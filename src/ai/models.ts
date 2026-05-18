import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'

export const defaultModel = anthropic('claude-sonnet-4-5-20250514')

// Gemini 3.1 Flash Lite — leve e rápido para o assistente de gráficos
export const geminiModel = google('gemini-3.1-flash-lite')
