/**
 * Image Generation Service — Dhaga Co. Crochet Studio
 * Consolidated category-aware prompt system for artisanal handmade product photography.
 * Each category carries per-angle smart prompts that instruct the AI to analyse the
 * uploaded product image and choose contextually fitting companion props & backgrounds.
 */
import { PROVIDERS } from '@/features/api-auth/constants'

// ─────────────────────────────────────────────
// PRODUCT CATEGORIES — Dhaga Co.
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
        'Flat-lay photograph taken from directly above of this exact handmade crochet garment laid neatly on a light natural wooden floor indoors. Study the garment\'s colour palette and style, then place one small handmade crochet companion item beside it that visually complements it — for example a tiny crochet animal, flower motif, or miniature accessory that matches or harmonises with the garment\'s yarn colours. Add a spool of yarn in a toning shade and one or two subtle natural accents such as a dried sprig or a small wooden button scattered casually nearby. Soft diffused warm indoor light with absolutely no harsh highlights or direct sunlight. The wooden floor grain is faintly visible. The entire scene must feel like a genuine, unposed, cozy home flat-lay — never a studio setup. The garment is the clear hero; companion props support but never compete.',
      sideView:
        'This exact handmade crochet garment hanging on a simple wooden hanger from a wall hook in a real lived-in indoor room, photographed from a gentle three-quarter side angle. Study the garment\'s colour palette and texture, then place one small handmade crochet companion item on a nearby wooden ledge or shelf — choose something that complements the garment\'s colours, such as a tiny crochet animal, flower, or decorative motif. The wall behind has a soft natural matte texture in a warm neutral tone. Warm ambient indoor lighting with no direct sunlight and no harsh shadows. A hint of a cozy room interior softly blurred in the background. The crochet stitch texture of the garment is sharp and clearly visible. The scene feels authentically homey and inviting.',
      frontView:
        'This exact handmade crochet garment hanging on a wooden hanger fixed to a hook on a soft matte white indoor wall, photographed straight on from the front. Study the garment\'s colour palette and character, then arrange two or three small complementary props in the scene — choose from items like a tiny handmade crochet animal on a small wooden stool, a few crochet flowers near the base, or a small potted indoor plant on a tiny wall shelf — selecting those whose colours and mood harmonise with the garment. Warm and even ambient room lighting with no harsh sunlight. The scene must feel like a real cozy room corner, not a photography studio. The garment dominates the frame; props add warmth without clutter.',
    },
  },

  keychains: {
    label: 'Keychains',
    icon: 'mdi:key',
    description: 'All crochet keychains — animals, food, floral, geometric, seasonal',
    prompts: {
      topView:
        'Flat-lay shot from directly above of this exact handmade crochet keychain laid on a light oak wooden surface indoors. Carefully observe the keychain\'s shape, character, and colour palette, then place one tiny handmade crochet companion item right beside it that thematically and chromatically complements it — for instance a miniature crochet animal if it\'s a character keychain, a tiny crochet fruit if it\'s food-themed, a small crochet flower if it\'s floral, or a crochet star or moon if it\'s abstract. Add a small ball of pastel yarn or a few loose yarn threads in a toning colour scattered naturally nearby. Soft diffused daylight from a nearby window, warm and natural home atmosphere, the wood grain texture clearly visible. Unposed, genuine, and inviting — looks like a real lifestyle product photo. The keychain is the undisputed hero of the composition.',
      sideView:
        'This exact handmade crochet keychain hanging from a small brass wall hook indoors, photographed from a gentle side angle. Study the keychain\'s design and colours, then place one tiny complementary handmade crochet companion item on a small wooden ledge just below the hook — choose something that matches the keychain\'s theme and palette. Soft warm ambient room light with no harsh shadows. The wall behind shows a faint natural matte texture in a warm neutral tone. The keychain is sharp and in clear focus, with a softly blurred cozy room interior in the background. The scene feels like a real home setting, never a studio.',
      frontView:
        'Front-facing close-up of this exact handmade crochet keychain lying centred on a light wooden table indoors. Observe the keychain\'s character and colour scheme, then tuck one tiny complementary handmade crochet companion naturally beside it — something that echoes its theme and harmonises with its palette. The keychain is the clear hero of the shot. A soft blurred warm room in the background, gentle natural light falling evenly across the scene from the front, the crochet texture crisp and richly detailed. Looks like a genuine lifestyle e-commerce product photo.',
    },
  },

  shoes: {
    label: 'Shoes',
    icon: 'mdi:shoe-sneaker',
    description: 'Crochet slippers, boots, mary-janes, sneakers, and sandals',
    prompts: {
      topView:
        'Top-down flat-lay of this exact pair of handmade crochet shoes placed neatly on a light oak wooden floor indoors. Observe the shoe style, silhouette, and colour palette, then place one small handmade crochet companion item beside one shoe — choose something that complements the shoe\'s aesthetic: a tiny crochet animal for cozy slippers, a crochet flower for elegant flats, a crochet star for sporty sneakers, or a crochet bear for boots. Add one subtle accent nearby such as a loose yarn spool or a few natural elements in toning colours. Soft diffused daylight from a nearby window falling gently across them. The wooden floor grain is faintly visible. Warm and cozy home setting, no person or mannequin. Looks like a real candid lifestyle product photo.',
      sideView:
        'Side-profile shot of this exact pair of handmade crochet shoes resting on a light wooden indoor surface. Study the shoe style and colours, then place one small handmade crochet companion item beside them — something that visually complements the shoe type and palette. A softly blurred warm white room wall behind them. Gentle natural light from a side window highlighting the crochet stitch texture and silhouette clearly. No model or mannequin. The shoes are positioned as if naturally set down. Real and inviting home atmosphere.',
      frontView:
        'Front-facing shot of this exact pair of handmade crochet shoes placed on a light wooden floor in a cozy indoor room, shoes slightly angled for natural depth. Observe the shoe style and colours, then place one tiny complementary handmade crochet item to one side on the floor — chosen to match the shoe\'s mood and palette. Warm diffused ambient light from the front. No person or mannequin. A softly blurred warm room interior visible behind them. The crochet texture is crisp and detailed. Feels like a genuine home lifestyle photograph.',
    },
  },

  decor: {
    label: 'Décor Pieces',
    icon: 'mdi:flower',
    description: 'Crochet pot covers, wall hangings, coasters, baskets, and bowls',
    prompts: {
      topView:
        'Top-down shot of this exact handmade crochet décor piece on a light wooden surface indoors. Carefully observe the item\'s type, shape, and colour palette, then place one or two small complementary props nearby — for a pot cover add a tiny crochet leaf and a few smooth pebbles, for a wall hanging lay a small crochet moon charm beside it, for coasters place a small ceramic mug on one and a tiny crochet flower beside the set, for a basket tuck a small folded linen cloth inside and a tiny crochet mushroom beside it. Choose props whose colours harmonise with the piece. Soft warm window light from above and the side. The surface texture is faintly visible. Cozy and genuine home interior, never a studio. Looks like a real lifestyle flat-lay photo.',
      sideView:
        'This exact handmade crochet décor piece displayed on a light wooden shelf or surface in a real lived-in indoor room, photographed from a gentle side angle to show depth and texture. Study the item\'s type and colours, then add one small complementary handmade crochet companion — something that matches the décor piece\'s theme and colour palette, placed naturally beside it on the same surface. A softly blurred warm living room interior behind it. Natural window light from the side catching the crochet stitches. The décor piece is the clear focus. Cozy and real home feel.',
      frontView:
        'Front-facing shot of this exact handmade crochet décor piece placed on a wooden surface against a soft matte white indoor wall. Observe the item\'s character and palette, then add one small complementary handmade crochet companion beside it and one subtle natural accent — selected to match the piece\'s mood and colours. Warm and even ambient room lighting. The room background is softly blurred. The crochet stitching is crisp and the colours rich and true. Looks like a real home shelf styled for an e-commerce listing.',
    },
  },

  toys: {
    label: 'Toys & Dolls',
    icon: 'mdi:teddy-bear',
    description: 'Crochet bears, bunnies, dolls, animals, and fantasy creatures',
    prompts: {
      topView:
        'Top-down flat-lay of this exact handmade crochet toy sitting upright on a light oak wooden surface indoors. Study the toy\'s character type and colour palette, then place one small complementary handmade crochet accent beside it — a crochet star for classic bears, a crochet heart for dolls, a crochet leaf for animals, or a crochet moon for fantasy creatures — choosing the one that best matches the toy\'s theme and colours. Add a tiny ball of pastel yarn or a few loose yarn strands in a toning shade nearby. Soft natural daylight from a nearby window. Warm and cozy home setting, the table grain texture faintly visible. Unposed and genuine, looks like a real candid lifestyle product photo.',
      sideView:
        'This exact handmade crochet toy sitting on a small wooden table in a bright cozy indoor room, photographed from a gentle side angle. Observe the toy\'s character and colour scheme, then place one small complementary handmade crochet item beside it on the table — selected to match its theme and harmonise with its colours. A soft white or warm pastel wall blurred in the background. Warm natural window light from the side catching the yarn texture and any embroidered details. The toy is the clear focus. Feels genuinely handmade and real.',
      frontView:
        'Front-facing shot of this exact handmade crochet toy placed centred on a light wooden table in a warm indoor room. Study the toy\'s character and palette, then place one small complementary handmade crochet companion to one side — chosen to echo the toy\'s theme and colours. The toy is sharp and clearly detailed with any embroidered features visible. A softly blurred cozy room interior behind it. Gentle even natural light from the front. Looks like a genuine and inviting e-commerce product photo.',
    },
  },

  bookCovers: {
    label: 'Book Covers',
    icon: 'mdi:book-open-page-variant',
    description: 'Crochet-covered journals, diaries, planners, and gift notebooks',
    prompts: {
      topView:
        'Top-down flat-lay of this exact crochet-covered book lying closed on a light wooden desk indoors. Observe the cover\'s colour palette and style, then place one tiny complementary handmade crochet accent on or beside the cover — a crochet butterfly for personal journals, a crochet heart for gift notebooks, or a crochet star for planners — whichever best matches the cover\'s mood and colours. Add a slim pen and one small natural accent like a dried flower or paper clip in a toning shade placed casually nearby. Soft warm natural daylight from a nearby window. The desk surface texture is visible. Cozy and real study or bedroom setting. Unposed and natural, looks like a genuine lifestyle product photo.',
      sideView:
        'Side-profile shot of this exact crochet-covered book propped upright on a light wooden desk indoors, showing the spine and the handmade cover texture. Study the cover\'s colours, then perch one tiny complementary handmade crochet accent naturally on or near the top edge — chosen to harmonise with the cover\'s palette. A slim pen resting beside it on the desk. Soft warm ambient light from a side window. A blurred cozy room behind it. The book is sharp and in clear detail. Feels like a real and inviting home workspace.',
      frontView:
        'Front-facing shot of this exact crochet-covered book propped gently on a light wooden desk in a warm cozy indoor room. Observe the cover\'s design and palette, then place one tiny complementary handmade crochet companion beside it on the desk surface — selected to match its mood and colours. A slim pen and one small natural accent resting nearby. The cover is sharp and the crochet texture rich and detailed. Soft natural light from the front. The room interior softly blurred behind. Looks like a genuine and professional e-commerce listing photo.',
    },
  },

  gajray: {
    label: 'Gajray',
    icon: 'mdi:flower-poppy',
    description: 'Crochet floral garlands — hair, wrist, and bridal sets',
    prompts: {
      topView:
        'Top-down flat-lay of this exact handmade crochet floral garland arranged in a gentle natural shape on a light wooden vanity surface indoors. Observe the garland\'s flower colours and style, then place one tiny complementary handmade crochet companion beside it — a crochet bird for hair garlands, a crochet butterfly for wrist pieces, or both for a bridal set — chosen to harmonise with the garland\'s colour palette. Add a few small dried petals or seed pearl beads in toning colours scattered softly around. Soft warm diffused daylight from a nearby window. Delicate and natural home setting, the surface texture faintly visible. Looks like a real and graceful lifestyle product photo.',
      sideView:
        'This exact handmade crochet floral garland draped over a small wooden jewellery stand or decorative hook on a dressing table indoors. Study the garland\'s flower colours and arrangement, then place one tiny complementary handmade crochet companion at the base of the stand — selected to match the garland\'s palette and mood. The individual crochet flowers are clearly visible and in sharp focus. Soft warm light from a nearby window or vanity lamp. A softly blurred feminine room interior in the background. The garland is the clear hero. Natural and elegant.',
      frontView:
        'Front-facing shot of this exact handmade crochet floral garland laid flat and centred on a light wooden dressing table. Observe the flower colours and design, then place one tiny complementary handmade crochet companion delicately to one side — chosen to echo the garland\'s palette. The individual crochet flower details are sharp and richly coloured. Warm and even indoor ambient light. A softly blurred feminine room interior behind it. Looks like a genuine and inviting e-commerce product photo.',
    },
  },

  bouquets: {
    label: 'Bouquets',
    icon: 'mdi:flower-tulip',
    description: 'Crochet flower bouquets — roses, tulips, mixed arrangements, and gift wraps',
    prompts: {
      topView:
        'Top-down flat-lay of this exact handmade crochet flower bouquet laid on a light wooden surface indoors. Observe the bouquet\'s flower types, colours, and arrangement, then place one tiny complementary handmade crochet companion beside it — a crochet butterfly, a small crochet bee, or a crochet ribbon bow — chosen to harmonise with the bouquet\'s palette. Add a few loose yarn strands or a small spool in a toning shade nearby. Soft warm diffused daylight from a window. The wood grain faintly visible. Genuine and delicate home flat-lay, never a studio. The bouquet is the clear hero.',
      sideView:
        'This exact handmade crochet flower bouquet standing in a simple glass jar or wrapped in craft paper on a light wooden surface indoors, photographed from a gentle side angle. Study the bouquet\'s flower colours and arrangement, then place one tiny complementary handmade crochet companion at the base — a crochet leaf, butterfly, or small bird — selected to match the bouquet\'s palette. Soft warm ambient light from a nearby window. A softly blurred cozy room behind. The individual crochet petals and stems are sharp and clearly detailed. Natural and elegant.',
      frontView:
        'Front-facing shot of this exact handmade crochet flower bouquet placed centred on a light wooden table in a warm indoor room. Observe the flower colours and design, then place one tiny complementary handmade crochet accent to one side — chosen to echo the bouquet\'s palette and mood. The individual crochet flowers are crisp and richly coloured with visible stitch detail. Soft even natural light from the front. A warm room interior softly blurred behind. Looks like a genuine and inviting e-commerce product photo.',
    },
  },

  gloves: {
    label: 'Gloves & Mittens',
    icon: 'mdi:hand-back-right',
    description: 'Crochet gloves, mittens, fingerless gloves, and wrist warmers',
    prompts: {
      topView:
        'Flat-lay photograph taken from directly above of this exact pair of handmade crochet gloves laid neatly side by side on a light natural wooden surface indoors. Study the gloves\' colour palette, stitch pattern, and style, then place one small handmade crochet companion item beside them that visually complements the set — for example a tiny crochet snowflake for winter mittens, a crochet flower motif for fingerless gloves, or a small crochet heart for cozy wrist warmers — choosing whichever best harmonises with the gloves\' yarn colours and mood. Add a small spool of yarn in a toning shade and one or two subtle natural accents such as a dried sprig or a few small wooden buttons scattered casually nearby. Soft diffused warm indoor light with absolutely no harsh highlights or direct sunlight. The wooden surface grain is faintly visible. The entire scene must feel like a genuine, unposed, cozy home flat-lay — never a studio setup. The gloves are the clear hero; companion props support but never compete.',
      sideView:
        'This exact pair of handmade crochet gloves draped naturally over the edge of a small wooden shelf or hung from a simple wooden peg on a matte textured wall indoors, photographed from a gentle three-quarter side angle to showcase their texture, cuff detail, and silhouette. Study the gloves\' colour palette and stitch work, then place one small handmade crochet companion item on the shelf or ledge beside them — choose something that complements the gloves\' colours and character, such as a tiny crochet star for winter styles, a crochet leaf for earthy tones, or a miniature crochet animal for playful designs. Warm ambient indoor lighting with no direct sunlight and no harsh shadows. A hint of a cozy room interior softly blurred in the background. The crochet stitch texture of the gloves is sharp and clearly visible. The scene feels authentically homey and inviting.',
      frontView:
        'Front-facing shot of this exact pair of handmade crochet gloves placed flat and centred on a light wooden table in a warm cozy indoor room, gloves slightly overlapping for natural depth and composition. Observe the gloves\' colour palette, cuff style, and stitch detail, then arrange one or two small complementary props in the scene — a tiny handmade crochet companion such as a snowflake charm, a crochet flower, or a small yarn ball — selecting those whose colours and mood harmonise with the gloves. Soft even warm ambient room lighting with no harsh sunlight. The crochet texture is crisp and richly detailed with the stitch pattern clearly visible. The scene must feel like a real cozy room setting, not a photography studio. The gloves dominate the frame; props add warmth without clutter. Looks like a genuine and professional e-commerce product photo.',
    },
  },

  toteBags: {
    label: 'Tote Bags & Handbags',
    icon: 'mdi:bag-personal',
    description: 'Crochet totes, shoulder bags, clutches, and market bags',
    prompts: {
      topView:
        'Flat-lay from directly above of this exact handmade crochet tote bag laid open on a light wooden surface indoors. Observe the bag\'s colour palette and weave pattern, then place one small complementary handmade crochet item beside it — a tiny crochet flower for market totes, a crochet coin purse for shoulder bags, or a crochet leaf for earthy styles — chosen to harmonise with the bag\'s colours. Add a small spool of toning yarn and one subtle natural accent like a dried sprig nearby. Soft diffused warm daylight from a window. The wood grain is faintly visible. Cozy and genuine home flat-lay, never a studio. The bag is the clear hero.',
      sideView:
        'This exact handmade crochet bag standing upright on a light wooden surface in a real indoor room, photographed from a gentle three-quarter side angle to show its depth, structure, and handle. Study the bag\'s colour palette and texture, then place one small complementary handmade crochet companion on the surface beside it — chosen to match the bag\'s style and colours. Warm ambient indoor lighting with no harsh shadows. A softly blurred cozy room interior behind. The crochet stitch texture and bag silhouette are sharp and clearly visible. Authentically homey and inviting.',
      frontView:
        'Front-facing shot of this exact handmade crochet bag placed upright and centred on a light wooden table in a warm indoor room. Observe the bag\'s design and colour scheme, then place one small complementary handmade crochet accent to one side — selected to echo the bag\'s mood and palette. The bag\'s texture, handle, and structure are crisp and detailed. Soft even natural light from the front. A warm room interior softly blurred behind. Looks like a genuine and professional e-commerce lifestyle product photo.',
    },
  },
}

// ─────────────────────────────────────────────
// SHOT TYPE METADATA (labels & descriptions — category-agnostic)
// ─────────────────────────────────────────────
export const SHOT_ANGLES = {
  topView: {
    label: 'Top View',
    description: "Bird's-eye perspective — great for flat-lays and layouts",
  },
  sideView: {
    label: 'Side View',
    description: 'Side angle — highlights depth, texture, and silhouette',
  },
  frontView: {
    label: 'Front View',
    description: 'Hero shot — direct front angle, ideal for listing thumbnails',
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
// MOCK IMAGE DATA (picsum seeds per angle — used when no API key/image)
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
      name: `${angleMeta.label} — AI Generated`,
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
      name: `${angleMeta.label} — AI Generated (OpenRouter)`,
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
      name: `${angleMeta.label} — Vertex AI (Imagen)`,
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