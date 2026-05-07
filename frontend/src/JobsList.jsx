import React, { useState, useEffect } from 'react';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FastAPI backend mathi data fetch kari rahya chiye
    fetch('http://127.0.0.1:8000/jobs/')
      .then(response => response.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading Zentalent Jobs...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
          Open Positions
        </h1>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-[#141414] border border-gray-800 rounded-2xl p-6 backdrop-blur-lg hover:border-indigo-500 transition-colors duration-300"
            >
              <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>
              <p className="text-gray-400 mb-4 text-sm line-clamp-3">
                {job.description}
              </p>

              <div className="mb-6">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Requirements:</span>
                <p className="text-sm text-gray-300 mt-1">{job.requirements}</p>
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-colors">
                Apply with AI Parse
              </button>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10 border border-dashed border-gray-700 rounded-2xl">
              Haju sudhi koi jobs post nathi kari. Swagger UI mathi ek job create karo!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsList;


