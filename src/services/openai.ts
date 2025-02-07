import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateTutorial(topic: string): Promise<string> {
  try {
    console.log('Starting tutorial generation for topic:', topic);
    console.log('API Key available:', !!import.meta.env.VITE_OPENAI_API_KEY);

    const prompt = `Your task is to generate a nice in depth tutorial based on the input provided. Use simple language, and provide the article in markdown format.

Topic: ${topic}

Please create a comprehensive tutorial that includes:
1. Introduction
2. Prerequisites (if any)
3. Step-by-step instructions
4. Code examples (if applicable)
5. Best practices
6. Common pitfalls
7. Conclusion`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert technical writer who creates clear, concise, and comprehensive tutorials."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    console.log('OpenAI response received:', !!response);
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Detailed error in generateTutorial:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate tutorial: ${error.message}`);
    }
    throw new Error('Failed to generate tutorial. Please try again.');
  }
}