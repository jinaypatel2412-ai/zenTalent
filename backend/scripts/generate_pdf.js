import PDFDocument from 'pdfkit';
import fs from 'fs';

// Question Bank Data
const questionBank = {
  "Senior Full Stack Engineer": {
    technical: [
      {
        question: "Explain the difference between monolith and microservice architectures.",
        idealAnswer: "A monolith has all functional components tightly coupled in a single codebase and deployment. Microservices break the application into independent, loosely coupled services communicating via APIs. Monoliths are easier to start but harder to scale, while microservices scale better but add operational complexity."
      },
      {
        question: "How do you handle state management across a complex React application?",
        idealAnswer: "I use Context API for simple global state (like themes or user auth) and libraries like Redux or Zustand for complex, frequently updating state. It's important to keep local state close to the component that needs it to minimize unnecessary re-renders."
      },
      {
        question: "Explain the concept of database indexing and how it affects performance.",
        idealAnswer: "An index is a data structure that improves data retrieval speed on a database table much like an index in a book. While it drastically speeds up SELECT queries, it can slow down INSERTs and UPDATEs because the index must also be updated."
      },
      {
        question: "What are JWTs, and how should they be securely stored on the client side?",
        idealAnswer: "JSON Web Tokens are stateless authentication tokens. To prevent Cross-Site Scripting (XSS), they should ideally be stored in an httpOnly, secure cookie rather than localStorage, minimizing the risk of malicious scripts stealing the token."
      },
      {
        question: "How do you ensure an application is horizontally scalable?",
        idealAnswer: "By making the application stateless so any instance can handle any request, utilizing a load balancer to distribute traffic, offloading session data to an external store like Redis, and using containerization (like Docker) for easy replication."
      }
    ],
    aptitude: [
      {
        question: "If a server cluster handles 500 requests per second and you scale it by 150%, what is the new throughput limits?",
        idealAnswer: "Scaling by 150% means adding 1.5 times the original capacity. So an additional 750 requests, bringing the total to 1250 requests per second."
      },
      {
        question: "You have 8 identically looking servers; one is consistently failing its health check. You can only ping them in groups. What is the minimum number of pings needed to find the failing server?",
        idealAnswer: "Two pings. You divide them into three groups (3, 3, 2). Ping the first 3. If it fails, ping 1 of the 3. If it passes, the failing one is the 3rd. You repeat the grouping to find the faulty one logarithmically."
      },
      {
        question: "A deployment pipeline takes 20 minutes. If 5 pipelines run concurrently on separate runners, how long does the entirety take?",
        idealAnswer: "It takes exactly 20 minutes, because they are running concurrently at the exact same time without sharing resources."
      },
      {
        question: "How would you explain an API to someone who has never touched a computer?",
        idealAnswer: "An API is like a waiter in a restaurant. You are the user sitting at the table, the kitchen is the database. You give your order to the waiter, the waiter takes it to the kitchen, and brings your food back to you. They act as the messenger."
      },
      {
        question: "Describe your approach to resolving a disagreement with another developer over a technical decision.",
        idealAnswer: "I would focus on objective metrics and project goals rather than subjective preferences. I'd propose we benchmark or prototype both solutions, look at the data, involve the team if necessary, and compromise in favor of what delivers the best business value."
      }
    ]
  },
  "Frontend Developer": {
    technical: [
      {
        question: "What is the Virtual DOM and why does React use it?",
        idealAnswer: "The Virtual DOM is a lightweight memory representation of the actual HTML DOM. React uses it to calculate the most efficient way to update the real DOM. Instead of re-rendering everything, it performs a 'diffing' process to only update the exact nodes that changed."
      },
      {
        question: "Explain the CSS Box Model.",
        idealAnswer: "The CSS box model dictates how elements are sized. It consists of the content at the center, surrounded by padding (internal space), a border, and then the margin (external space). Setting box-sizing to border-box makes the width include padding and borders."
      },
      {
        question: "What is the difference between let, const, and var in JavaScript?",
        idealAnswer: "var is function-scoped and can be hoisted. let and const are block-scoped. let allows reassignment, while const indicates the variable reference cannot be reassigned, though the contents of a const object or array can still be mutated."
      },
      {
        question: "How do you optimize a web page's loading speed?",
        idealAnswer: "Key techniques include minifying JS and CSS, compressing and lazy-loading images, utilizing browser caching, enabling text compression like GZIP, minimizing HTTP requests, and executing heavy JS scripts asynchronously."
      },
      {
        question: "What is Event Bubbling in the DOM?",
        idealAnswer: "Event bubbling is when an event is triggered on an inner element and then sequentially triggers on its parent elements all the way up to the document root. It's the basis for event delegation, where one listener on a parent manages events for all children."
      }
    ],
    aptitude: [
      {
        question: "If 3 developers build 3 pages in 3 hours, how long does it take 6 developers to build 6 pages?",
        idealAnswer: "3 hours. The fundamental rate is 1 developer builds 1 page in 3 hours."
      },
      {
        question: "A UI design requires a specific box to be vertically and horizontally centered. Name two ways to do this in CSS.",
        idealAnswer: "1. Using absolute positioning with top: 50%, left: 50%, and transform: translate(-50%, -50%). 2. Using Flexbox on the parent container with justify-content: center and align-items: center."
      },
      {
        question: "You notice a critical bug in production right before you are leaving for vacation. What do you do?",
        idealAnswer: "I immediately escalate it, log the issue, and provide all reproduction steps to the team. Depending on severity, I would stay to help apply a quick hotfix or rollback to the previous stable release to ensure the system is safe before logging off."
      },
      {
        question: "How do you ensure a website is accessible to users with disabilities?",
        idealAnswer: "By using semantic HTML tags, ensuring sufficient color contrast, providing descriptive alt text for all images, making sure the UI is completely navigable via keyboard, and utilizing ARIA attributes when custom components are built."
      },
      {
        question: "If a circle's radius is doubled, what happens to its area?",
        idealAnswer: "The area increases by a factor of 4, since the formula for area is pi times radius squared."
      }
    ]
  },
  "Backend Systems Engineer": {
    technical: [
      {
        question: "What is the difference between REST and GraphQL?",
        idealAnswer: "REST exposes multiple endpoints for different resources and often suffers from over-fetching or under-fetching data. GraphQL exposes a single endpoint and allows the client to explicitly query only the exact fields of data it needs, reducing data transfer."
      },
      {
        question: "How do you prevent SQL Injection attacks?",
        idealAnswer: "By strictly using parameterized queries or prepared statements, which separate the SQL code structure from the user-provided data. And utilizing an ORM library that automatically escapes user inputs."
      },
      {
        question: "Explain the CAP theorem.",
        idealAnswer: "The CAP theorem states that a distributed data store can only simultaneously provide two out of three guarantees: Consistency (all nodes see same data), Availability (every request receives a response), and Partition tolerance (system operates despite network drops)."
      },
      {
        question: "What is the purpose of a message broker like RabbitMQ or Kafka?",
        idealAnswer: "A message broker facilitates asynchronous communication between distributed microservices. It allows services to publish events into queues and decouple themselves from the consumers, which helps handle traffic spikes and ensures message persistence."
      },
      {
        question: "Describe different types of caching strategies.",
        idealAnswer: "Caching strategies include Write-through (data is written into cache and DB simultaneously), Write-behind (written to cache, then asynchronously to DB), and Cache-aside (app checks cache first, if miss, pulls from DB and updates cache)."
      }
    ],
    aptitude: [
      {
        question: "A database query takes 10 seconds. You add an index and it drops by 90%. How long does it take now?",
        idealAnswer: "1 second. 90 percent of 10 is 9, so it drops by 9 seconds."
      },
      {
        question: "If you have a 5-litre jug and a 3-litre jug, how do you measure exactly 4 litres of water?",
        idealAnswer: "Fill the 5L jug. Pour into 3L jug, leaving 2L in the 5L jug. Empty the 3L jug. Pour the 2L into the 3L jug. Fill the 5L jug. Pour into the 3L jug until it's full (which takes 1L). There are now exactly 4L remaining in the 5L jug."
      },
      {
        question: "How do you handle a scenario where an API dependency goes down completely?",
        idealAnswer: "Implement a circuit breaker pattern to prevent compounding failures, provide clear error logs, return graceful degradation responses (like cached stale data) to the user, and setup alerts for the devops team to investigate the dependent service."
      },
      {
        question: "What is the next number in the sequence: 2, 4, 8, 16...?",
        idealAnswer: "32. The sequence is doubling the previous number each time."
      },
      {
        question: "Why do we use hashing for passwords instead of encryption?",
        idealAnswer: "Because encryption is a two-way function (it can be decrypted), whereas hashing is a one-way function. If a database is breached, the attacker cannot reverse the hashes back into the plain text passwords, ensuring user security."
      }
    ]
  }
};

const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream('Question_Bank.pdf'));

doc.fontSize(24).text('Interview Hub - Master Question Bank', { align: 'center' });
doc.moveDown(2);

for (const [jobTitle, tests] of Object.entries(questionBank)) {
  doc.fontSize(18).fillColor('blue').text(`Role: ${jobTitle}`, { underline: true });
  doc.moveDown(1);
  
  for (const [testType, questions] of Object.entries(tests)) {
    doc.fontSize(14).fillColor('black').text(`Category: ${testType.toUpperCase()}`, { underline: false });
    doc.moveDown(0.5);
    
    questions.forEach((q, index) => {
      doc.fontSize(12).fillColor('black').text(`Q${index + 1}: ${q.question}`, { continued: false });
      doc.fontSize(11).fillColor('gray').text(`Ideal Answer: ${q.idealAnswer}`);
      doc.moveDown(0.8);
    });
    
    doc.moveDown(1);
  }
}

doc.end();
console.log("PDF Created.");



