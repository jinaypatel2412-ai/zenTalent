import { useState } from "react";
import { Mic, Square, ArrowRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function VoiceInterview({ type, questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const currentQuestion = questions[currentIndex];

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.info("Recording stopped");
    } else {
      setIsRecording(true);
      toast.success("Recording started. Speak now...");
      setTimeout(() => {
        // Tame ahiya tamaro real api no response muki shako cho future ma
        if (!transcript) setTranscript(""); 
      }, 2000);
    }
  };

  const handleNext = async () => {
    if (!transcript.trim()) {
      toast.error("Please provide an answer before moving to the next question.");
      return;
    }

    setEvaluating(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    let matchCount = 0;
    const lowerTranscript = transcript.toLowerCase();
    const expected = currentQuestion?.expectedKeywords || [];

    // Strict evaluation logic
    expected.forEach(kw => {
      if (lowerTranscript.includes(kw.toLowerCase())) {
        matchCount++;
      }
    });

    let finalScore = 0;
    if (expected.length > 0) {
      finalScore = Math.round((matchCount / expected.length) * 100);
    }

    // Dynamic strict feedback
    let strengths = [];
    let improvements = [];

    if (finalScore === 100) {
      strengths = ["Perfect answer", "Covered all key concepts accurately"];
      improvements = ["None, excellent work"];
    } else if (finalScore >= 50) {
      strengths = ["Covered some relevant points"];
      improvements = ["Missed several crucial keywords", "Needs more detailed explanation"];
    } else if (finalScore > 0) {
      strengths = ["Attempted to answer"];
      improvements = ["Answer is largely incorrect", "Missed almost all expected points"];
    } else {
      strengths = ["None"];
      improvements = ["Completely incorrect", "Did not mention any relevant concepts"];
    }

    const newAnswer = {
      question: currentQuestion?.question || "Question",
      answer: transcript,
      score: finalScore,
      strengths,
      improvements
    };

    const newAnswersList = [...answers, newAnswer];
    setAnswers(newAnswersList);
    setTranscript("");
    setEvaluating(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleCompleteInterview = () => {
    const totalScore = answers.reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = answers.length > 0 ? Math.round(totalScore / answers.length) : 0;

    onComplete({ avgScore });
  };

  if (!questions || questions.length === 0) {
    return <div className="p-8 text-center text-zinc-500">Loading questions...</div>;
  }

  if (isFinished) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900 outfit tracking-tight">Interview Results</h2>

        <div className="space-y-6">
          {answers.map((item, idx) => (
            <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Question {idx + 1}</p>
                  <h3 className="text-base font-semibold text-zinc-900">{item.question}</h3>
                </div>
                <div className={`text-xl font-bold ${item.score >= 70 ? 'text-zinc-900' : item.score >= 40 ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {item.score}/100
                </div>
              </div>

              <div className="bg-zinc-50 rounded-xl p-4 mb-4 border border-zinc-100">
                <p className="text-sm text-zinc-600 italic">"{item.answer}"</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-zinc-800">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold">Strengths</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-zinc-600 space-y-1">
                    {item.strengths.map((str, i) => <li key={i}>{str}</li>)}
                  </ul>
                </div>
                <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-zinc-600">
                    <AlertCircle size={16} />
                    <span className="text-xs font-bold">Areas for Improvement</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-zinc-500 space-y-1">
                    {item.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleCompleteInterview}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
          >
            {type === "technical" ? (
              "Next: Aptitude Test"
            ) : type === "aptitude" ? (
              "Next: Coding Challenge"
            ) : (
              "Complete Interview"
            )}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-md">
        <h2 className="text-xl font-bold capitalize">{type} Interview</h2>
        <p className="text-sm opacity-80 mt-1">Question {currentIndex + 1} of {questions.length} - Speak your answer</p>
        <div className="mt-4 h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Question {currentIndex + 1}</p>
        <h3 className="text-lg font-semibold text-zinc-900">{currentQuestion?.question}</h3>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <button
            onClick={toggleRecording}
            className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-all shadow-sm ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200'}`}
          >
            {isRecording ? <Square size={24} /> : <Mic size={24} />}
          </button>
          <div className="pt-2">
            <p className="text-sm font-semibold text-zinc-900">Click to start speaking</p>
            <p className="text-xs text-zinc-500">Your speech will be converted to text</p>
          </div>
        </div>

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-32 p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0 || evaluating}
          className="px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={evaluating}
          className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-70 shadow-sm"
        >
          {evaluating ? <Loader2 size={16} className="animate-spin" /> : null}
          {evaluating ? "Evaluating..." : currentIndex === questions.length - 1 ? "Finish Section" : "Next Question"}
          {!evaluating && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}


