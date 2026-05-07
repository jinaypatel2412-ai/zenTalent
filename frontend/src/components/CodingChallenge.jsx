import { useState } from "react";
import { Code2, Play, Send, Loader2, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getCodingProblemsForJob } from "@/lib/codingBank";

export function CodingChallenge({ jobTitle, onComplete }) {
  const CODING_PROBLEMS = getCodingProblemsForJob(jobTitle);

  const [currentProblem, setCurrentProblem] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [codes, setCodes] = useState(CODING_PROBLEMS.map(p => p.starterCode["javascript"]));
  const [evaluations, setEvaluations] = useState(new Array(CODING_PROBLEMS.length).fill(null));
  const [isEvaluating, setIsEvaluating] = useState(false);

  const problem = CODING_PROBLEMS[currentProblem];
  const difficultyColors = { Easy: "text-emerald-600 bg-emerald-500/10", Medium: "text-amber-600 bg-amber-500/10", Hard: "text-destructive bg-destructive/10" };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    if (codes[currentProblem] !== problem.starterCode[language]) {
      if (!confirm(`Changing language to ${newLang} will reset your code for this problem. Continue?`)) {
        return;
      }
    }
    setLanguage(newLang);
    const newCodes = codes.map((c, i) => {
      if (c === CODING_PROBLEMS[i].starterCode[language] || i === currentProblem) {
        return CODING_PROBLEMS[i].starterCode[newLang];
      }
      return c;
    });
    setCodes(newCodes);
  };

  const evaluateCode = async () => {
    setIsEvaluating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isComplete = codes[currentProblem].length > 40;
      const testResults = problem.testCases.map((tc) => ({
        passed: isComplete ? Math.random() > 0.2 : false
      }));
      const passedCount = testResults.filter(r => r.passed).length;

      const data = {
        score: Math.round((passedCount / problem.testCases.length) * 100),
        feedback: passedCount === problem.testCases.length ? "Excellent! All test cases passed." : "Some test cases failed. Try to handle edge cases better.",
        testResults
      };

      const newEvals = [...evaluations];
      newEvals[currentProblem] = data;
      setEvaluations(newEvals);
      toast.success(`Score: ${data.score}/100`);
    } catch (e) {
      toast.error(e.message || "Evaluation failed");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFinish = () => {
    // Navu logic: Jo koi evalution baki hoy to submit atkayi dese ane message aapse
    const allEvaluated = evaluations.every(e => e !== null);
    if (!allEvaluated) {
      toast.error("Please 'Run & Evaluate' all problems before submitting!");
      return;
    }

    const scores = evaluations.map(e => e?.score || 0);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    onComplete({ scores, feedbacks: evaluations, avgScore });
  };

  const currentEval = evaluations[currentProblem];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold">Adaptive Coding Challenge</h2>
        <p className="text-sm opacity-80 mt-1">Problem {currentProblem + 1} of {CODING_PROBLEMS.length} • Difficulty adapts to performance</p>
        <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${((currentProblem + 1) / CODING_PROBLEMS.length) * 100}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Problem description */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Code2 size={18} className="text-primary" />
            <h3 className="font-semibold text-foreground">{problem.title}</h3>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${difficultyColors[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{problem.description}</p>

          <div className="space-y-3">
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3 text-xs space-y-1">
                <p className="font-semibold text-foreground">Example {i + 1}:</p>
                <p className="text-muted-foreground"><strong>Input:</strong> {ex.input}</p>
                <p className="text-muted-foreground"><strong>Output:</strong> {ex.output}</p>
                {ex.explanation && <p className="text-muted-foreground"><strong>Explanation:</strong> {ex.explanation}</p>}
              </div>
            ))}
          </div>

          {/* Test cases preview */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Test Cases ({problem.testCases.length})</p>
            {problem.testCases.map((tc, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                {currentEval?.testResults?.[i] ? (
                  currentEval.testResults[i].passed
                    ? <CheckCircle2 size={12} className="text-emerald-500" />
                    : <XCircle size={12} className="text-destructive" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-border" />
                )}
                <span>Input: {tc.input} → Expected: {tc.expected}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code editor */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b border-border">
              <div className="flex gap-1.5 items-center">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
              </div>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-background text-foreground text-xs font-medium border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <textarea
              value={codes[currentProblem]}
              onChange={e => {
                const newCodes = [...codes];
                newCodes[currentProblem] = e.target.value;
                setCodes(newCodes);
              }}
              className="w-full h-64 p-4 bg-zinc-950 text-emerald-400 font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={evaluateCode} disabled={isEvaluating}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {isEvaluating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              {isEvaluating ? "Running Tests..." : "Run & Evaluate"}
            </button>
          </div>

          {/* Evaluation result */}
          {currentEval && (
            <div className="bg-card border border-primary/20 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-primary" />
                <span className="font-semibold text-sm text-foreground">AI Evaluation</span>
                <span className={`ml-auto text-xl font-bold ${currentEval.score >= 70 ? "text-emerald-600" : currentEval.score >= 40 ? "text-amber-600" : "text-destructive"}`}>
                  {currentEval.score}/100
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{currentEval.feedback}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentProblem(prev => Math.max(0, prev - 1))} disabled={currentProblem === 0}
          className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-2">
          <ChevronLeft size={16} /> Previous
        </button>

        {currentProblem === CODING_PROBLEMS.length - 1 ? (
          <button onClick={handleFinish}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
            <Send size={16} /> Submit All
          </button>
        ) : (
          <button onClick={() => setCurrentProblem(prev => prev + 1)}
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2">
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}


