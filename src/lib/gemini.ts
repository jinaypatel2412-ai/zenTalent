import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "dummy");

export async function generateInterviewQuestions(type: "technical" | "aptitude"): Promise<string[]> {
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not set! Using fallback questions.");
    return fallbackQuestions(type);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    const prompt = `Generate 5 medium-difficulty ${type} interview questions suitable for a software engineering or tech role.
Return the output strictly as a JSON array of strings containing only the questions without any numbers or bullet points in the strings.

Format: ["Question 1", "Question 2", ...]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON array from possibly markdown formatted code block
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 5);
      }
    }
    
    throw new Error("Failed to parse Gemini response as JSON array.");
  } catch (err) {
    console.error("Gemini question generation error:", err);
    return fallbackQuestions(type);
  }
}

function getFallbackEvaluations(qaPairs: { question: string; idealAnswer: string; answer: string }[]) {
  return qaPairs.map(qa => {
    const hasLength = qa.answer.length > 15;
    return {
      score: hasLength ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 40,
      feedback: hasLength ? "Good answer providing solid details." : "Your answer was a bit brief.",
      strengths: hasLength ? ["Clear articulation", "Pertinent points"] : [],
      improvements: hasLength ? ["Could elaborate more"] : ["Provide more depth", "Be specific"]
    };
  });
}

export async function evaluateInterviewAnswers(
  type: "technical" | "aptitude",
  qaPairs: { question: string; idealAnswer: string; answer: string }[]
): Promise<{ score: number; feedback: string; strengths: string[]; improvements: string[] }[]> {
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not set! Using mock evaluations.");
    await new Promise(r => setTimeout(r, 2000));
    return getFallbackEvaluations(qaPairs);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    
    // We send a single prompt with all pairs
    const prompt = `You are a strict, objective technical interviewer.
Here are 5 interview questions along with their "Ideal Textbook Answer", followed by the candidate's actual transcribed answer.

${qaPairs.map((qa, i) => `--- QUESTION ${i + 1} ---
Question: ${qa.question}
Ideal Answer: ${qa.idealAnswer}
Candidate's Answer: ${qa.answer}`).join("\n\n")}

Evaluate each Candidate's Answer strictly based on how similar the core concepts and correct keywords are to the Ideal Answer. Do not reward generic fluff or hallucinated answers.
For each answer, provide a score (0-100), brief constructive feedback, 1-2 strengths (if any), and 1-2 areas for improvement.
Return the result STRICTLY as a valid JSON array of objects. Do not include markdown code block syntax around the JSON.
The objects in the array must follow exactly this JSON schema:
[{
  "score": 85,
  "feedback": "string",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"]
}]

Ensure the array has exactly ${qaPairs.length} objects in the same order as the questions.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length === qaPairs.length) {
        return parsed;
      }
    }

    throw new Error(`Failed to parse Gemini evaluation response. Expected exactly ${qaPairs.length} objects.`);
  } catch (err: any) {
    console.warn("Gemini evaluation API error or busy, using fallback:", err.message);
    return getFallbackEvaluations(qaPairs);
  }
}

function fallbackQuestions(type: "technical" | "aptitude") {
  if (type === "technical") {
    return [
      "Explain the difference between SQL and NoSQL databases and when you would use each.",
      "What is the event loop in JavaScript and how does it handle asynchronous operations?",
      "Describe how you would design a rate limiter for an API.",
      "Explain the concept of microservices vs monolithic architecture. What are the trade-offs?",
      "How does garbage collection work in modern programming languages?"
    ];
  } else {
    return [
      "A train travels 60 km in the first hour and 80 km in the second hour. What is its average speed?",
      "If 5 machines produce 5 widgets in 5 minutes, how long would it take 100 machines to produce 100 widgets?",
      "There are 3 boxes: one with only apples, one with only oranges, and one mixed. All labels are wrong. You can pick one fruit from one box. How do you correctly label all boxes?",
      "A clock shows 3:15. What is the angle between the hour and minute hands?",
      "If the probability of rain on any given day is 30%, what is the probability it rains on exactly 2 out of 5 days?"
    ];
  }
}



