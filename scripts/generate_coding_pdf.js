import PDFDocument from 'pdfkit';
import fs from 'fs';

// Question Bank Data
const codingBank = {
  "Senior Full Stack Engineer": [
    {
      title: "Design a Rate Limiter",
      difficulty: "Hard",
      description: "Implement a sliding window rate limiter. Given an array of request timestamps in seconds, an integer `windowSize`, and a `limit`, return a boolean array of the same length indicating whether each request was accepted or dropped. A request is dropped if the number of accepted requests in the preceding `windowSize` interval (inclusive of the current second) exceeds the `limit`.",
      starterCode: {
        javascript: "function rateLimiter(requests, windowSize, limit) {\n  // Your code here\n  \n}",
        python: "def rate_limiter(requests, window_size, limit):\n    # Your code here\n    pass",
        java: "class Solution {\n    public boolean[] rateLimiter(int[] requests, int windowSize, int limit) {\n        // Your code here\n        return new boolean[0];\n    }\n}",
        cpp: "class Solution {\npublic:\n    vector<bool> rateLimiter(vector<int>& requests, int windowSize, int limit) {\n        // Your code here\n        return {};\n    }\n};"
      }
    },
    {
      title: "Merge Distributed Logs",
      difficulty: "Hard",
      description: "You have `k` log files, where each file contains a list of log entries sorted by timestamp. Merge all `k` lists into a single sorted list. Implement this optimally.",
      starterCode: {
        javascript: "function mergeKLogs(lists) {\n  // Your code here\n  \n}",
        python: "def merge_k_logs(lists):\n    # Your code here\n    pass",
        java: "class Solution {\n    public int[] mergeKLogs(List<List<Integer>> lists) {\n        // Your code here\n        return new int[0];\n    }\n}",
        cpp: "class Solution {\npublic:\n    vector<int> mergeKLogs(vector<vector<int>>& lists) {\n        // Your code here\n        return {};\n    }\n};"
      }
    }
  ],
  "Frontend Developer": [
    {
      title: "Nested Object Observer",
      difficulty: "Hard",
      description: "Implement a function `createObserver(obj, callback)` that takes a deeply nested object and returns a Proxy. The callback should be triggered with the path array, old value, and new value whenever any deeply nested property is modified.",
      starterCode: {
        javascript: "function createObserver(obj, callback) {\n  // Your code here\n  \n}",
        python: "# Python equivalent: Implement a tracking dict wrapper\ndef create_observer(obj, callback):\n    # Your code here\n    pass",
        java: "class Solution {\n    // Implement deep tracking for a Map\n    public Map createObserver(Map obj, Consumer callback) {\n        return null;\n    }\n}",
        cpp: "class Solution {\npublic:\n    // Conceptual tracking\n    void createObserver() {\n        \n    }\n};"
      }
    },
    {
      title: "Concurrent UI Requests",
      difficulty: "Hard",
      description: "Write an asynchronous function `batchRequests(endpoints, maxConcurrency)` that takes an array of URL endpoints and fetches them concurrently, but ensuring that no more than `maxConcurrency` endpoints are being fetched at the exact same moment. Return an array of results in the original order.",
      starterCode: {
        javascript: "async function batchRequests(endpoints, maxConcurrency) {\n  // Your code here\n  \n}",
        python: "async def batch_requests(endpoints, max_concurrency):\n    # Your code here\n    pass",
        java: "class Solution {\n    public List<String> batchRequests(List<String> endpoints, int maxConcurrency) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}",
        cpp: "class Solution {\npublic:\n    vector<string> batchRequests(vector<string> endpoints, int maxConcurrency) {\n        // Your code here\n        return {};\n    }\n};"
      }
    }
  ],
  "Backend Systems Engineer": [
    {
      title: "Distributed Task Scheduler",
      difficulty: "Hard",
      description: "Given a list of tasks represented by string identifiers and an integer `n` denoting a cooldown period between identical tasks, return the minimum unit of time required to execute all tasks.",
      starterCode: {
        javascript: "function taskScheduler(tasks, n) {\n  // Your code here\n  \n}",
        python: "def task_scheduler(tasks, n):\n    # Your code here\n    pass",
        java: "class Solution {\n    public int taskScheduler(char[] tasks, int n) {\n        // Your code here\n        return 0;\n    }\n}",
        cpp: "class Solution {\npublic:\n    int taskScheduler(vector<char>& tasks, int n) {\n        // Your code here\n        return 0;\n    }\n};"
      }
    },
    {
      title: "Consistent Hashing Ring",
      difficulty: "Hard",
      description: "Design a Consistent Hashing class `ConsistentHash(nodes, replicas)`. Implement `addNode(nodeId)`, `removeNode(nodeId)`, and `getNode(key)` which returns the node mapped to the given string key using the MD5 or simple string hashing logic.",
      starterCode: {
        javascript: "class ConsistentHash {\n  constructor(nodes, replicas) {\n    // Initialize\n  }\n  addNode(nodeId) {\n    // Your code here\n  }\n  getNode(key) {\n    // Your code here\n  }\n}",
        python: "class ConsistentHash:\n    def __init__(self, nodes, replicas):\n        pass\n    def add_node(self, node_id):\n        pass\n    def get_node(self, key):\n        pass",
        java: "class ConsistentHash {\n    public ConsistentHash(List<String> nodes, int replicas) {}\n    public void addNode(String nodeId) {}\n    public String getNode(String key) { return \"\"; }\n}",
        cpp: "class ConsistentHash {\npublic:\n    ConsistentHash(vector<string> nodes, int replicas) {}\n    void addNode(string nodeId) {}\n    string getNode(string key) { return \"\"; }\n};"
      }
    }
  ]
};

const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream('Coding_Challenge_Bank.pdf'));

doc.fontSize(24).text('Interview Hub - Coding Challenge Bank', { align: 'center' });
doc.moveDown(2);

for (const [jobTitle, problems] of Object.entries(codingBank)) {
  doc.fontSize(18).fillColor('blue').text(`Role: ${jobTitle}`, { underline: true });
  doc.moveDown(1);
  
  problems.forEach((p, index) => {
    doc.fontSize(14).fillColor('black').text(`Problem ${index + 1}: ${p.title} (${p.difficulty})`, { underline: false });
    doc.moveDown(0.5);
    
    doc.fontSize(11).fillColor('gray').text(p.description);
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('black').text('Starter Templates:');
    doc.moveDown(0.2);
    for (const [lang, code] of Object.entries(p.starterCode)) {
      doc.fontSize(10).fillColor('gray').text(`[${lang.toUpperCase()}]`);
      doc.fontSize(9).fillColor('gray').text(code.split('\\n').join('\n'));
      doc.moveDown(0.5);
    }
    
    doc.moveDown(1);
  });
}

doc.end();
console.log("PDF Created.");



