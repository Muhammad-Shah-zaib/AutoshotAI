import { PRODUCT_CATEGORIES } from '@/features/studio-generation/services/generateImages'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const TEXT_MODEL = 'gemini-2.5-flash'

export async function generateProductDetails({ apiKey, categoryKey, images, apiProvider, proxyUrl }) {
  const category = PRODUCT_CATEGORIES[categoryKey]
  const categoryLabel = category?.label || 'Handmade Crochet Product'

  const prompt = buildPrompt(categoryLabel, images)

  let base64Image = null
  let mimeType = null

  const firstImage = images[0]
  if (firstImage?.url?.startsWith('data:')) {
    const [header, base64] = firstImage.url.split(',')
    const mimeMatch = header.match(/data:(.*?);/)
    base64Image = base64
    mimeType = mimeMatch ? mimeMatch[1] : 'image/png'
  }

  let text = ''

  if (apiProvider === 'proxy') {
    const { generateTextViaProxy } = await import('@/features/api-auth/services/proxyService.js')
    text = await generateTextViaProxy({
      proxyUrl,
      secretKey: apiKey,
      prompt,
      base64Image,
      mimeType,
    })
  } else {
    const body = {
      contents: [{ parts: buildParts(prompt, images) }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 300,
        responseMimeType: 'application/json',
      },
    }

    const url = `${GEMINI_API_BASE}/models/${TEXT_MODEL}:generateContent?key=${apiKey}`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message || `Gemini text API error: HTTP ${res.status}`)
    }

    const data = await res.json()
    text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }

  return parseResponse(text)
}

function buildPrompt(categoryLabel, images) {
  return `You are a product copywriter for "Dhaga Co.", a small handmade crochet brand. Based on the product images provided, generate a product name and description.

Category: ${categoryLabel}
Number of images: ${images.length}

Rules:
- The name should be 2-4 words, creative but simple. Think cozy, warm names like "Sunset Bloom Cardigan", "Berry Patch Beanie", "Meadow Star Keychain", "Cozy Cloud Slippers". Use easy everyday words.
- The description should be 1-2 short sentences. Keep it warm and inviting, easy to read. Mention what the product is, a key visual detail from the image (color, pattern, texture), and a feeling it evokes. No fancy vocabulary.
- Do NOT use words like: artisanal, bespoke, meticulously, exquisite, curated, unparalleled, epitome, luxuriant.
- Write like you're telling a friend about something cute you made.

Return valid JSON with exactly these keys:
{"name": "...", "description": "..."}`
}

function buildParts(prompt, images) {
  const parts = []

  const firstImage = images[0]
  if (firstImage?.url?.startsWith('data:')) {
    const [header, base64] = firstImage.url.split(',')
    const mimeMatch = header.match(/data:(.*?);/)
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png'
    parts.push({
      inlineData: { mimeType, data: base64 },
    })
  }

  parts.push({ text: prompt })
  return parts
}

function parseResponse(text) {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return {
      name: parsed.name || '',
      description: parsed.description || '',
    }
  } catch {
    return { name: '', description: '' }
  }
}
