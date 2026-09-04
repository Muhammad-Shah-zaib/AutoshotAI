/**
 * Image Generation Service, Dhaga Co. Crochet Studio
 * Consolidated category-aware prompt system for artisanal handmade product photography.
 * Each category carries per-angle smart prompts that instruct the AI to analyse the
 * uploaded product image and choose contextually fitting companion props & backgrounds.
 */
import { PROVIDERS } from '@/features/api-auth/constants'

// ─────────────────────────────────────────────
// PRODUCT CATEGORIES, Dhaga Co.
// Each category: label, icon, description, and per-angle SMART prompts.
// The AI sees the uploaded product photo and decides props + background automatically.
// ─────────────────────────────────────────────
export const PRODUCT_CATEGORIES = {

  jerseys: {
    label: 'Jerseys & Jackets',
    icon: 'mdi:tshirt-crew',
    description: 'Crochet tops, cardigans, and outerwear',
    prompts: {
      topView:
        'Flat-lay photograph taken from directly above of this exact handmade crochet garment laid neatly on a minimal plain background indoors. The main product should be in the center. Place one extra handmade crochet companion item beside it. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'This exact handmade crochet garment hung on some plain wall with minimal look, photographed from a side angle. The main product should be in the center. Place one extra handmade crochet companion item in the scene. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'This exact handmade crochet garment hung on some plain wall with minimal look, photographed straight on from the front. The main product should be in the center. Place one extra handmade crochet companion item in the scene. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },

  keychains: {
    label: 'Keychains',
    icon: 'mdi:key',
    description: 'All crochet keychains, animals, food, floral, geometric, seasonal',
    prompts: {
      topView:
        'Flat-lay shot from directly above of this exact handmade crochet keychain laid on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'This exact handmade crochet keychain placed on a natural plain wooden table indoors, photographed from a side angle. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'Front-facing shot of this exact handmade crochet keychain placed on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },

  shoes: {
    label: 'Shoes',
    icon: 'mdi:shoe-sneaker',
    description: 'Crochet slippers, boots, mary-janes, sneakers, and sandals',
    prompts: {
      topView:
        'Top-down flat-lay of this exact pair of handmade crochet shoes placed on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'Side-profile shot of this exact pair of handmade crochet shoes resting on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'Front-facing shot of this exact pair of handmade crochet shoes placed on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },

  decor: {
    label: 'Décor Pieces',
    icon: 'mdi:flower',
    description: 'Crochet pot covers, wall hangings, coasters, baskets, and bowls',
    prompts: {
      topView:
        'Top-down shot of this exact handmade crochet décor piece on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'This exact handmade crochet décor piece displayed on a natural plain wooden table indoors, photographed from a side angle. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'Front-facing shot of this exact handmade crochet décor piece placed on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },

  toys: {
    label: 'Toys & Dolls',
    icon: 'mdi:teddy-bear',
    description: 'Crochet bears, bunnies, dolls, animals, and fantasy creatures',
    prompts: {
      topView:
        'Top-down flat-lay of this exact handmade crochet toy sitting upright on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'This exact handmade crochet toy sitting on a natural plain wooden table indoors, photographed from a side angle. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'Front-facing shot of this exact handmade crochet toy placed centred on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },

  bookCovers: {
    label: 'Book Covers',
    icon: 'mdi:book-open-page-variant',
    description: 'Crochet-covered journals, diaries, planners, and gift notebooks',
    prompts: {
      topView:
        'Top-down flat-lay of this exact crochet-covered book lying closed on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'Side-profile shot of this exact crochet-covered book propped upright on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'Front-facing shot of this exact crochet-covered book propped gently on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },

  gajray: {
    label: 'Gajray',
    icon: 'mdi:flower-poppy',
    description: 'Crochet floral garlands, hair, wrist, and bridal sets',
    prompts: {
      topView:
        'Top-down flat-lay of this exact handmade crochet floral garland arranged gently on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'This exact handmade crochet floral garland draped on a natural plain wooden table indoors, photographed from a side angle. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'Front-facing shot of this exact handmade crochet floral garland laid flat on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },

  bouquets: {
    label: 'Bouquets',
    icon: 'mdi:flower-tulip',
    description: 'Crochet flower bouquets, roses, tulips, mixed arrangements, and gift wraps',
    prompts: {
      topView:
        'Top-down flat-lay of this exact handmade crochet flower bouquet laid on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'This exact handmade crochet flower bouquet on a natural plain wooden table indoors, photographed from a side angle. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'Front-facing shot of this exact handmade crochet flower bouquet placed on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },

  gloves: {
    label: 'Gloves & Mittens',
    icon: 'mdi:hand-back-right',
    description: 'Crochet gloves, mittens, fingerless gloves, and wrist warmers',
    prompts: {
      topView:
        'Flat-lay photograph taken from directly above of this exact pair of handmade crochet gloves laid neatly on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'This exact pair of handmade crochet gloves on a natural plain wooden table indoors, photographed from a side angle. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'Front-facing shot of this exact pair of handmade crochet gloves placed on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },

  toteBags: {
    label: 'Tote Bags & Handbags',
    icon: 'mdi:bag-personal',
    description: 'Crochet totes, shoulder bags, clutches, and market bags',
    prompts: {
      topView:
        'Flat-lay from directly above of this exact handmade crochet bag laid on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'This exact handmade crochet bag placed on a natural plain wooden table indoors, photographed from a side angle. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'Front-facing shot of this exact handmade crochet bag placed upright on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },

  wallets: {
    label: 'Wallets & Coin Purses',
    icon: 'mdi:wallet',
    description: 'Crochet wallets, coin purses, card holders, and mini pouches',
    prompts: {
      topView:
        'Flat-lay photograph taken from directly above of this exact handmade crochet wallet or coin purse laid on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'This exact handmade crochet wallet or coin purse on a natural plain wooden table indoors, photographed from a side angle. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'Front-facing shot of this exact handmade crochet wallet or coin purse placed on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },

  babySets: {
    label: 'Baby Sets',
    icon: 'mdi:baby-face-outline',
    description: 'Crochet baby sets, shirt or jersey, knicker, shoes, and cap combinations',
    prompts: {
      topView:
        'Top-down flat-lay of this exact handmade crochet baby set arranged on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      sideView:
        'This exact handmade crochet baby set on a natural plain wooden table indoors, photographed from a side angle. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
      frontView:
        'Front-facing shot of this exact handmade crochet baby set arranged on a natural plain wooden table indoors. The main product should be in the center. Adjust lighting so that it looks a little cozy, professional photo, clean background. Must look natural and not AI generated, don\'t put too much extra things.',
    },
  },
}

// ─────────────────────────────────────────────
// SHOT TYPE METADATA (labels & descriptions, category-agnostic)
// ─────────────────────────────────────────────
export const SHOT_ANGLES = {
  topView: {
    label: 'Top View',
    description: "Bird's-eye perspective, great for flat-lays and layouts",
  },
  sideView: {
    label: 'Side View',
    description: 'Side angle, highlights depth, texture, and silhouette',
  },
  frontView: {
    label: 'Front View',
    description: 'Hero shot, direct front angle, ideal for listing thumbnails',
  },
}

// ─────────────────────────────────────────────
// DEFAULT CATEGORY
// ─────────────────────────────────────────────
export const DEFAULT_CATEGORY = 'jerseys'

/**
 * Get the prompts for a given category.
 * Falls back to jerseys if category is unknown.
 * @param {string} categoryKey
 * @returns {{ topView: string, sideView: string, frontView: string }}
 */
export function getPromptsForCategory(categoryKey) {
  return (PRODUCT_CATEGORIES[categoryKey] || PRODUCT_CATEGORIES[DEFAULT_CATEGORY]).prompts
}

/**
 * Returns all shot type definitions enriched with the active category prompts.
 * @param {string} categoryKey
 * @returns {Array<{ key, label, description, prompt }>}
 */
export function getAllShotTypes(categoryKey = DEFAULT_CATEGORY) {
  const prompts = getPromptsForCategory(categoryKey)
  return Object.entries(SHOT_ANGLES).map(([key, meta]) => ({
    key,
    label: meta.label,
    description: meta.description,
    prompt: prompts[key] || '',
  }))
}

// ─────────────────────────────────────────────
// MOCK IMAGE DATA (picsum seeds per angle, used when no API key/image)
// ─────────────────────────────────────────────
const MOCK_IMAGES = {
  topView: [
    { url: 'https://picsum.photos/seed/dhaga-top1/600/600', name: 'Top-View A' },
    { url: 'https://picsum.photos/seed/dhaga-top2/600/600', name: 'Top-View B' },
  ],
  sideView: [
    { url: 'https://picsum.photos/seed/dhaga-side1/600/600', name: 'Side-View A' },
    { url: 'https://picsum.photos/seed/dhaga-side2/600/600', name: 'Side-View B' },
  ],
  frontView: [
    { url: 'https://picsum.photos/seed/dhaga-front1/600/600', name: 'Front-View A' },
    { url: 'https://picsum.photos/seed/dhaga-front2/600/600', name: 'Front-View B' },
  ],
}

/**
 * Generate product images for active shot types.
 *
 * When apiKey + uploadedImage are provided → calls the real Gemini API.
 * Otherwise → falls back to picsum placeholder images (dev / no-key mode).
 *
 * @param {string[]} activeShots    - Shot keys to generate (e.g. ['topView', 'sideView'])
 * @param {Object}  customPrompts   - Per-shot prompt overrides
 * @param {Function} onProgress     - Progress callback (0–100)
 * @param {Object}  apiContext      - Optional { apiKey, uploadedImage: { base64, mimeType } }
 * @returns {Promise<Array>}        - Generated image objects
 */
export async function generateImages(
  activeShots,
  customPrompts = {},
  onProgress = () => {},
  apiContext = null,
) {
  const useRealApi =
    apiContext?.apiKey &&
    apiContext?.uploadedImage?.base64 &&
    apiContext?.uploadedImage?.mimeType

  if (useRealApi) {
    const provider = apiContext.apiProvider || PROVIDERS.GEMINI
    console.log(`[generateImages] Using Real API (${provider}) for`, activeShots)

    if (provider === PROVIDERS.OPENROUTER) {
      const rawResults = await generateWithOpenRouterApi(activeShots, customPrompts, onProgress, apiContext)
      return postProcessImages(rawResults)
    }
    if (provider === PROVIDERS.PROXY) {
      const rawResults = await generateWithProxyApi(activeShots, customPrompts, onProgress, apiContext)
      return postProcessImages(rawResults)
    }
    const rawResults = await generateWithGeminiApi(activeShots, customPrompts, onProgress, apiContext)
    return postProcessImages(rawResults)
  }

  console.warn('[generateImages] Falling back to MOCK images. Reason:',
    !apiContext?.apiKey ? 'Missing API Key' :
    !apiContext?.uploadedImage ? 'Missing Uploaded Image' : 'Incomplete apiContext'
  )
  const mockResults = await generateMock(activeShots, customPrompts, onProgress)
  return postProcessImages(mockResults)
}

/**
 * Post-processes generated images: resizes to 600px and converts to WebP.
 * This ensures "high resolution" images are never stored on the frontend.
 */
async function postProcessImages(images) {
  const { compressImage, dataURLtoFile } = await import('@/features/gallery-export/services/imageCompression')
  
  const processed = await Promise.all(images.map(async (img) => {
    let file
    if (img.url.startsWith('data:')) {
      file = dataURLtoFile(img.url, `${img.shotType}.png`)
    } else {
      const res = await fetch(img.url)
      const blob = await res.blob()
      file = new File([blob], `${img.shotType}.png`, { type: blob.type })
    }

    const compressedFile = await compressImage(file)
    
    const reader = new FileReader()
    const compressedUrl = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(compressedFile)
    })

    return {
      ...img,
      url: compressedUrl,
      resolution: '600 × 600 (Optimized)',
      format: 'WebP',
      size: `${(compressedFile.size / 1024).toFixed(1)} KB`
    }
  }))

  return processed
}

// ─────────────────────────────────────────────
// REAL GEMINI GENERATION
// ─────────────────────────────────────────────
async function generateWithGeminiApi(activeShots, customPrompts, onProgress, apiContext) {
  const { generateWithGemini } = await import('./geminiService.js')
  const results = []
  const total = activeShots.length

  for (let i = 0; i < total; i++) {
    const shotKey = activeShots[i]
    const angleMeta = SHOT_ANGLES[shotKey]
    const prompt = customPrompts[shotKey] || ''

    onProgress(Math.round((i / total) * 90))

    const generatedDataUrl = await generateWithGemini({
      apiKey: apiContext.apiKey,
      base64Image: apiContext.uploadedImage.base64,
      mimeType: apiContext.uploadedImage.mimeType,
      prompt,
    })

    results.push({
      id: `${shotKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      shotType: shotKey,
      shotLabel: angleMeta.label,
      name: `${angleMeta.label}, AI Generated`,
      prompt,
      url: generatedDataUrl,
      size: 'AI Generated',
      resolution: 'Gemini Output',
      format: 'PNG',
      createdAt: new Date().toISOString(),
    })

    onProgress(Math.round(((i + 1) / total) * 95))
  }

  onProgress(100)
  return results
}

// ─────────────────────────────────────────────
// REAL OPENROUTER GENERATION
// ─────────────────────────────────────────────
async function generateWithOpenRouterApi(activeShots, customPrompts, onProgress, apiContext) {
  const { generateWithOpenRouter } = await import('./openRouterService.js')
  const results = []
  const total = activeShots.length

  for (let i = 0; i < total; i++) {
    const shotKey = activeShots[i]
    const angleMeta = SHOT_ANGLES[shotKey]
    const prompt = customPrompts[shotKey] || ''

    onProgress(Math.round((i / total) * 90))

    const generatedDataUrl = await generateWithOpenRouter({
      apiKey: apiContext.apiKey,
      base64Image: apiContext.uploadedImage.base64,
      mimeType: apiContext.uploadedImage.mimeType,
      prompt,
    })

    results.push({
      id: `${shotKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      shotType: shotKey,
      shotLabel: angleMeta.label,
      name: `${angleMeta.label}, AI Generated (OpenRouter)`,
      prompt,
      url: generatedDataUrl,
      size: 'AI Generated',
      resolution: 'OpenRouter Output',
      format: 'PNG',
      createdAt: new Date().toISOString(),
    })

    onProgress(Math.round(((i + 1) / total) * 95))
  }

  onProgress(100)
  return results
}

// ─────────────────────────────────────────────
// VERTEX AI PROXY GENERATION
// ─────────────────────────────────────────────
async function generateWithProxyApi(activeShots, customPrompts, onProgress, apiContext) {
  const { generateViaProxy } = await import('@/features/api-auth/services/proxyService.js')
  const results = []
  const total = activeShots.length

  for (let i = 0; i < total; i++) {
    const shotKey = activeShots[i]
    const angleMeta = SHOT_ANGLES[shotKey]
    const prompt = customPrompts[shotKey] || ''

    onProgress(Math.round((i / total) * 90))

    const images = await generateViaProxy({
      proxyUrl: apiContext.proxyUrl,
      secretKey: apiContext.apiKey,
      prompt,
      base64Image: apiContext.uploadedImage.base64,
      mimeType: apiContext.uploadedImage.mimeType,
    })

    const first = images[0]
    if (!first) throw new Error(`Proxy returned no image for shot: ${shotKey}`)

    results.push({
      id: `${shotKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      shotType: shotKey,
      shotLabel: angleMeta.label,
      name: `${angleMeta.label}, Vertex AI (Imagen)`,
      prompt,
      url: first.dataUrl,
      size: 'AI Generated',
      resolution: 'Imagen Output',
      format: 'PNG',
      createdAt: new Date().toISOString(),
    })

    onProgress(Math.round(((i + 1) / total) * 95))
  }

  onProgress(100)
  return results
}

// ─────────────────────────────────────────────
// MOCK / FALLBACK GENERATION
// ─────────────────────────────────────────────
async function generateMock(activeShots, customPrompts, onProgress) {
  const totalSteps = activeShots.length * 10
  let currentStep = 0
  const results = []

  for (const shotKey of activeShots) {
    const angleMeta = SHOT_ANGLES[shotKey]
    const mockImages = MOCK_IMAGES[shotKey] || []
    const usedPrompt = customPrompts[shotKey] || ''

    for (const img of mockImages) {
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 200))
        currentStep++
        onProgress(Math.min(Math.round((currentStep / totalSteps) * 100), 99))
      }

      results.push({
        id: `${shotKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        shotType: shotKey,
        shotLabel: angleMeta.label,
        name: img.name,
        prompt: usedPrompt,
        url: img.url,
        size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
        resolution: '4096 × 4096',
        format: 'PNG',
        createdAt: new Date().toISOString(),
      })
    }
  }

  onProgress(100)
  return results
}