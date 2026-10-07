export const config = {
  runtime: 'edge', // This ensures it runs hyper-fast globally
};

export default async function handler(request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { message } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Call OpenAI
    const response = await fetch('https://openai.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
