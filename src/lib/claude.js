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
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error('Claude API request failed')
  }

  const data = await response.json()
  return data.content[0].text
}
