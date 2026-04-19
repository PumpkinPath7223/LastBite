const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY

export async function generateDealDescription({ title, originalPrice, dealPrice, category, restaurantName }) {
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key not configured')
  }

  const prompt = `Write a short, enticing 2-3 sentence description for a food deal at a restaurant near Ohio State University campus.
Restaurant: ${restaurantName}
Item: ${title}
Original price: $${originalPrice}
Deal price: $${dealPrice}
Category: ${category}

Make it appeal to hungry college students. Be fun and brief. Do not use hashtags.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6-20250116',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('Claude API error:', data)
    throw new Error(data?.error?.message || 'Claude API request failed')
  }

  return data.content[0].text
}
