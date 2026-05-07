import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Send, Loader2, CheckCircle2, ChevronLeft, ChevronRight, Volume2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { evaluateInterviewAnswers } from "@/lib/gemini";

import { InterviewQuestion } from "@/lib/questionBank";

interface VoiceInterviewProps {
  type: "technical" | "aptitude";
  questions: InterviewQuestion[];
  onComplete: (results: { scores: number[]; feedbacks: any[]; avgScore: number }) => void;
}

export function VoiceInterview({ type, questions, onComplete }: VoiceInterviewProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(""));
  const [evaluations, setEvaluations] = useState<any[]>(new Array(questions.length).fill(null));
  
  const [isEvaluatingAll, setIsEvaluatingAll] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);
      if (event.error !== "no-speech") {
        toast.error(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript(answers[currentQ] || "");
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening, answers, currentQ]);

  const saveAnswer = () => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = transcript;
    setAnswers(newAnswers);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  const handleNext = () => {
    saveAnswer();
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setTranscript(answers[currentQ + 1] || "");
    }
  };

  const submitAllForEvaluation = async () => {
    saveAnswer();
    
    // Validations:
    const emptyCount = answers.filter(a => !a.trim()).length;
    if (emptyCount > questions.length / 2) {
      if (!confirm("You have many unanswered questions. Do you still want to finish and evaluate?")) return;
    }

    setIsEvaluatingAll(true);

    try {
      // Map correctly: handle real-time state of answers including the very last answer just typed
      const finalAnswers = [...answers];
      finalAnswers[currentQ] = transcript;

      const pairs = questions.map((q, i) => ({ question: q.question, idealAnswer: q.idealAnswer, answer: finalAnswers[i] || "No answer provided." }));
      const evals = await evaluateInterviewAnswers(type, pairs);
      
      setEvaluations(evals);
      setShowSummary(true);
      toast.success("Evaluation complete!");
    } catch (e: any) {
      toast.error(e.message || "Failed to evaluate answers");
    } finally {
      setIsEvaluatingAll(false);
    }
  };

  const handleFinishAndReturn = () => {
    const scores = evaluations.map(e => e?.score || 0);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    onComplete({ scores, feedbacks: evaluations, avgScore });
  };

  if (isEvaluatingAll) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-2xl shadow-sm text-center">
        <Loader2 size={48} className="text-primary animate-spin mb-6" />
        <h2 className="text-xl font-bold text-foreground mb-2">Analyzing Your Responses...</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Gemini AI is strictly reviewing your answers, evaluating their correctness, and generating constructive feedback. This may take a moment.
        </p>
      </div>
    );
  }

  if (showSummary) {
    const avgScore = Math.round(evaluations.reduce((acc, curr) => acc + (curr?.score || 0), 0) / evaluations.length);
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-primary-foreground flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Evaluation Summary</h2>
            <p className="text-sm opacity-80 mt-1">Overall Performance Score</p>
          </div>
          <div className="text-4xl font-extrabold">{avgScore}%</div>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {evaluations.map((evalData, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">Question {i + 1}</span>
                  <p className="text-sm font-medium text-foreground">{questions[i]?.question}</p>
                </div>
                <div className={`text-xl font-bold shrink-0 ${evalData?.score >= 70 ? "text-emerald-600" : evalData?.score >= 40 ? "text-amber-600" : "text-destructive"}`}>
                  {evalData?.score}/100
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground italic">&quot;{answers[i] || "No answer provided."}&quot;</p>
              </div>

              {evalData ? (
                <>
                  <p className="text-sm text-muted-foreground">{evalData.feedback}</p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-2">
                    {evalData.strengths?.length > 0 && (
                      <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
                        <p className="text-xs font-semibold text-emerald-600 mb-1.5 flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> Strengths
                        </p>
                        <ul className="list-disc pl-4 space-y-1">
                          {evalData.strengths.map((s: string, idx: number) => (
                            <li key={idx} className="text-xs text-muted-foreground">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {evalData.improvements?.length > 0 && (
                      <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
                        <p className="text-xs font-semibold text-amber-600 mb-1.5">Areas for Improvement</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {evalData.improvements.map((s: string, idx: number) => (
                            <li key={idx} className="text-xs text-muted-foreground">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-destructive">Failed to generate evaluation for this question.</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button onClick={handleFinishAndReturn}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
            Return to Dashboard <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-primary-foreground">
        <h2 className="text-xl font-bold">{type === "technical" ? "🎯 Technical" : "🧠 Aptitude"} Interview</h2>
        <p className="text-sm opacity-80 mt-1">Question {currentQ + 1} of {questions.length} • Speak your answer</p>
        <div className="mt-4 h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
          <div className="h-full bg-primary-foreground rounded-full transition-all duration-500" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Question {currentQ + 1}</span>
        <h3 className="text-lg font-semibold text-foreground mt-2 leading-relaxed">{questions[currentQ]?.question}</h3>
      </div>

      {/* Voice input */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? "bg-destructive text-destructive-foreground animate-pulse shadow-lg shadow-destructive/30"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            }`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isListening ? "🔴 Listening... Speak now" : "Click to start speaking"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isListening ? "Click again to stop" : "Your speech will be converted to text"}
            </p>
          </div>
          {isListening && (
            <div className="ml-auto flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 bg-primary rounded-full animate-pulse" style={{ height: `${12 + Math.random() * 20}px`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}
        </div>

        {/* Transcript */}
        <div className="min-h-[120px] p-4 rounded-xl border border-border bg-background">
          {transcript ? (
            <p className="text-sm text-foreground leading-relaxed">{transcript}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Your transcribed answer will appear here...</p>
          )}
        </div>

        {/* Also allow typing */}
        <textarea
          value={transcript}
          onChange={e => setTranscript(e.target.value)}
          placeholder="Or type your answer here if speech isn't working..."
          className="w-full h-24 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => { saveAnswer(); setCurrentQ(prev => Math.max(0, prev - 1)); setTranscript(answers[Math.max(0, currentQ - 1)] || ""); }}
          disabled={currentQ === 0}
          className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-2">
          <ChevronLeft size={16} /> Previous
        </button>

        {currentQ === questions.length - 1 ? (
          <button onClick={submitAllForEvaluation}
            className="px-6 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors shadow-sm flex items-center gap-2">
            Finish & Evaluate <ArrowRight size={16} />
          </button>
        ) : (
          <button onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
            Next Question <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}



