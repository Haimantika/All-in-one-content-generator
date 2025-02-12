import OpenAI from "openai";


const SECURE_AGENT_KEY = import.meta.env.VITE_SECURE_AGENT_KEY;
const AGENT_BASE_URL = import.meta.env.VITE_AGENT_BASE_URL;
const AGENT_ENDPOINT = `${AGENT_BASE_URL}/api/v1/`;

if (!SECURE_AGENT_KEY || !AGENT_BASE_URL) {
  throw new Error("Missing agent access key or base URL! Ensure VITE_SECURE_AGENT_KEY and VITE_AGENT_BASE_URL are set in .env");
}


const client = new OpenAI({
  apiKey: SECURE_AGENT_KEY,
  baseURL: AGENT_ENDPOINT, 
  dangerouslyAllowBrowser: true
});


export async function generateTutorial(topic: string): Promise<string> {
  try {
    console.log("Starting tutorial generation for topic:", topic);

    const prompt = `Your task is to generate a nice in-depth tutorial based on the input provided. Use simple language and provide the article in markdown format.\n\nTopic: ${topic}\n\nPlease create a comprehensive tutorial that includes:\n1. Introduction\n2. Prerequisites (if any)\n3. Step-by-step instructions\n4. Code examples (if applicable)\n5. Best practices\n6. Common pitfalls\n7. Conclusion`;

    const response = await client.chat.completions.create({
      model: "llama3.3-70b-instruct",
      messages: [
        { role: "system", content: "You are an expert technical writer who creates clear, concise, and comprehensive tutorials." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    console.log("OpenAI response received:", response);
    
    const content = response.choices[0]?.message?.content || "No response from AI";
    
    return content;
    
  } catch (error) {
    console.error("Error generating tutorial:", error);
  
    let errorMessage = "Unknown error occurred.";
  
  if (error instanceof OpenAI.RateLimitError) {
      errorMessage = "Rate limit exceeded. Please try again later.";
    } else if (error instanceof Error) {
      errorMessage = error.message; 
    }
  
    throw new Error(`OpenAI SDK Error: ${errorMessage}`);
  }
}  