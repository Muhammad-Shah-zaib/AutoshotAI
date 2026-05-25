/**
 * proxyService.js
 * Handles all communication with the vertex-ai-proxy backend.
 */
import { PROXY_SECRET_HEADER } from '../constants'

/**
 * Build the common headers for every proxy request.
 * @param {string} secretKey
 */
function buildHeaders(secretKey) {
  return {
    'Content-Type': 'application/json',
    [PROXY_SECRET_HEADER]: secretKey,
  }
}

/**
 * Validate the secret key against the proxy backend.
 * @param {string} proxyUrl   - Base URL of the proxy (e.g. http://localhost:4000)
 * @param {string} secretKey
 * @returns {Promise<{ valid: boolean, message: string }>}
 */
export async function validateProxyKey(proxyUrl, secretKey) {
  try {
    const res = await fetch(`${proxyUrl}/api/validate`, {
      method: 'POST',
      headers: buildHeaders(secretKey),
    })

    if (res.status === 401 || res.status === 403) {
      return { valid: false, message: 'Invalid secret key. Access denied.' }
    }

    if (!res.ok) {
      return { valid: false, message: `Proxy error: HTTP ${res.status}` }
    }

    const data = await res.json()
    return { valid: true, message: data.message || 'Connected to Vertex AI Proxy.' }
  } catch {
    return { valid: false, message: 'Could not reach the proxy server. Is it running?' }
  }
}

/**
 * Generate images via the proxy backend.
 *
 * @param {object} params
 * @param {string} params.proxyUrl       - Proxy base URL
 * @param {string} params.secretKey      - Proxy secret key
 * @param {string} params.prompt         - Generation prompt
 * @param {string} [params.base64Image]  - Base64 reference image (no data-uri prefix)
 * @param {string} [params.mimeType]     - MIME type of the reference image
 * @param {number} [params.sampleCount]  - Number of images to request (default 1)
 * @returns {Promise<Array<{ dataUrl: string, mimeType: string }>>}
 */
export async function generateViaProxy({ proxyUrl, secretKey, prompt, base64Image, mimeType, sampleCount = 1 }) {
  const res = await fetch(`${proxyUrl}/api/generate`, {
    method: 'POST',
    headers: buildHeaders(secretKey),
    body: JSON.stringify({
      prompt,
      referenceImage: base64Image || null,
      mimeType: mimeType || null,
      sampleCount,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error || `Proxy generation failed (HTTP ${res.status})`
    throw Object.assign(new Error(msg), { status: res.status })
  }

  const data = await res.json()
  return data.images || []
}

/**
 * Generate text via the proxy backend.
 *
 * @param {object} params
 * @param {string} params.proxyUrl       - Proxy base URL
 * @param {string} params.secretKey      - Proxy secret key
 * @param {string} params.prompt         - Text prompt
 * @param {string} [params.base64Image]  - Base64 reference image (no data-uri prefix)
 * @param {string} [params.mimeType]     - MIME type of the reference image
 * @returns {Promise<string>}            - Generated text
 */
export async function generateTextViaProxy({ proxyUrl, secretKey, prompt, base64Image, mimeType }) {
  const res = await fetch(`${proxyUrl}/api/generate-text`, {
    method: 'POST',
    headers: buildHeaders(secretKey),
    body: JSON.stringify({
      prompt,
      referenceImage: base64Image || null,
      mimeType: mimeType || null,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error || `Proxy text generation failed (HTTP ${res.status})`
    throw Object.assign(new Error(msg), { status: res.status })
  }

  const data = await res.json()
  return data.text || ''
}
