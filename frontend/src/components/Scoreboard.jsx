import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Award, ArrowRight, BarChart3 } from "lucide-react";

export function Scoreboard({ applicationId, onClose }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchFinalResult = async () => {
            const { data } = await supabase
                .from("job_applications")
                .select("*, job_postings(title, company)")
                .eq("id", applicationId)
                .single();
            setData(data);
        };
        fetchFinalResult();
    }, [applicationId]);

    if (!data) return <div className="p-10 text-center text-zinc-500 font-medium">Loading Scoreboard...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 mb-4">
                    <Award size={32} className="text-zinc-900" />
                </div>
                <h1 className="text-3xl font-bold text-zinc-900">Interview Completed</h1>
                <p className="text-zinc-500">Your performance summary for {data.job_postings?.title || "the role"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Technical", score: data.technical_score },
                    { label: "Aptitude", score: data.aptitude_score },
                    { label: "Coding", score: data.coding_score }
                ].map((item) => (
                    <div key={item.label} className="p-6 bg-white border border-zinc-200 rounded-2xl text-center shadow-sm">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.label}</p>
                        {/* Ahiya || 0 umerelu che jethi blank na aave */}
                        <p className="text-3xl font-bold text-zinc-900">{item.score || 0}%</p>
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900 text-white rounded-3xl p-8 flex items-center justify-between shadow-md">
                <div>
                    <p className="text-zinc-400 text-sm font-medium">Overall Performance Score</p>
                    {/* Ahiya pan || 0 umerelu che */}
                    <h2 className="text-4xl font-bold mt-1">{data.overall_score || 0}%</h2>
                </div>
                <div className="hidden sm:block">
                    <BarChart3 size={48} className="opacity-20" />
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all font-semibold shadow-sm"
                >
                    Go to Dashboard <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}


