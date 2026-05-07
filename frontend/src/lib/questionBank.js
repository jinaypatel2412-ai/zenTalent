export function getQuestionsForJob(jobTitle, type) {
  // Job title ne lowercase ma convert kari lyo jethi match karvuma aasaani rahe
  const title = jobTitle.toLowerCase();

  // Aptitude test badha roles mate common hoy che
  if (type === "aptitude") {
    return [
      {
        question: "If a server cluster handles 500 requests per second and you scale it by 150%, what is the new throughput limit?",
        expectedKeywords: ["1250", "1250 requests"]
      },
      {
        question: "Find the next number in the series: 2, 6, 12, 20, 30, ...",
        expectedKeywords: ["42", "forty two"]
      }
      // Ahiya bija aptitude questions add kari shako cho
    ];
  }

  // Technical questions job na naam pramane
  if (type === "technical") {

    if (title.includes("frontend") || title.includes("ui")) {
      return [
        { question: "Explain the difference between Virtual DOM and Real DOM in React.", expectedKeywords: ["virtual", "memory", "faster", "diffing"] },
        { question: "How do you handle state management in a large React application?", expectedKeywords: ["redux", "context api", "zustand", "props"] }
      ];
    }

    else if (title.includes("data") || title.includes("machine learning")) {
      return [
        { question: "What is the difference between supervised and unsupervised learning?", expectedKeywords: ["labels", "labeled data", "clustering", "classification"] },
        { question: "Explain how a Random Forest algorithm works.", expectedKeywords: ["decision trees", "ensemble", "voting"] }
      ];
    }

    else {
      // Default: Full Stack / Backend / Biji koi pan job mate
      return [
        { question: "Describe the architecture of a RESTful API.", expectedKeywords: ["endpoints", "http methods", "stateless", "json"] },
        { question: "How would you optimize a slow database query in PostgreSQL?", expectedKeywords: ["indexing", "explain analyze", "joins", "caching"] }
      ];
    }
  }

  return [];
}


