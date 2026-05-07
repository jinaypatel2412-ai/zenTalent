export function getCodingProblemsForJob(jobTitle) {
  const title = jobTitle.toLowerCase();

  // Frontend Developer mate Coding Questions
  if (title.includes("frontend") || title.includes("ui")) {
    return [
      {
        title: "Format Phone Number",
        difficulty: "Easy",
        description: "Write a function that takes a string of 10 digits and returns it in the format (XXX) XXX-XXXX.",
        examples: [
          { input: "'1234567890'", output: "'(123) 456-7890'" }
        ],
        testCases: [
          { input: "'1234567890'", expected: "'(123) 456-7890'" },
          { input: "'9876543210'", expected: "'(987) 654-3210'" }
        ],
        starterCode: {
          javascript: "function formatPhoneNumber(numbers) {\n  // Your code here\n}",
          python: "def format_phone_number(numbers):\n    # Your code here"
        }
      }
    ];
  }

  // Data Scientist mate Coding Questions
  else if (title.includes("data") || title.includes("machine learning")) {
    return [
      {
        title: "Calculate Mean and Median",
        difficulty: "Medium",
        description: "Given an array of numbers, calculate both the mean and median values.",
        examples: [
          { input: "[1, 2, 3, 4, 5]", output: "{ mean: 3, median: 3 }" }
        ],
        testCases: [
          { input: "[1, 2, 3, 4, 5]", expected: "{ mean: 3, median: 3 }" },
          { input: "[10, 20, 30, 40]", expected: "{ mean: 25, median: 25 }" }
        ],
        starterCode: {
          javascript: "function calculateStats(arr) {\n  // Your code here\n}",
          python: "def calculate_stats(arr):\n    # Your code here"
        }
      }
    ];
  }

  // Default: Full Stack Developer / Backend mate
  else {
    return [
      {
        title: "Merge Distributed Logs",
        difficulty: "Hard",
        description: "You have `k` log files, where each file contains a list of log entries sorted by timestamp. Merge all `k` lists into a single sorted list.",
        examples: [
          { input: "[[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }
        ],
        testCases: [
          { input: "[[1,4,5],[1,3,4],[2,6]]", expected: "[1,1,2,3,4,4,5,6]" },
          { input: "[]", expected: "[]" }
        ],
        starterCode: {
          javascript: "function mergeKLogs(lists) {\n  // Your code here\n}",
          python: "def merge_k_logs(lists):\n    # Your code here"
        }
      }
    ];
  }
}


