import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download } from "lucide-react"; // Added Download icon
import axios from "axios";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(null);
  const [problemCount, setProblemCount] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const [width, height] = useWindowSize();

  const audioRef = useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message);
      setResult(response.data.output);
      setScore(response.data.score);
      setProblemCount(response.data.problem_count);

      if (response.data.problem_count === 0) {
        setShowConfetti(true);

        if (audioRef.current) {
          audioRef.current.play();
        }

        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("File upload failed. Please try again.");
    }

    setLoading(false);
  };

  const getBadge = (score) => {
    if (score >= 8) return { label: "Excellent", color: "bg-green-500" };
    if (score >= 5) return { label: "Good", color: "bg-yellow-400" };
    return { label: "Needs Improvement", color: "bg-red-500" };
  };

  // 📄 Download Report Function
  const handleDownloadReport = () => {
    if (!result) return;

    let reportContent = `🏆 Code Health Score: ${score.toFixed(2)}/10\n`;
    reportContent += `🛠️ Problems Found: ${problemCount}\n\n`;

    reportContent += `Analysis Report:\n`;
    result.forEach((item) => {
      reportContent += `- Line ${item.line}: ${item.message}\n`;
    });

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "analysis_report.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 relative overflow-hidden">
      {/* 🎶 Hidden audio player */}
      <audio ref={audioRef} src="/success.mp3" preload="auto" />

      {/* 🎊 Confetti */}
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={400} recycle={false} />}
      
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 z-10">
        <CardContent className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Automated Code Review</h1>
          <p className="text-gray-600 text-center">
            Upload your Python script to analyze its quality with Pylint.
          </p>

          {/* Upload area */}
          <label className="flex items-center gap-2 border border-dashed p-3 rounded-lg cursor-pointer">
            <Upload className="w-5 h-5 text-gray-500" />
            <input type="file" accept=".py" className="hidden" onChange={handleFileChange} />
            {file ? file.name : "Choose a Python file"}
          </label>

          {/* Upload button */}
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading ? "Uploading..." : "Analyze Code"}
          </Button>

          {/* Message after upload */}
          {message && (
            <div className="mt-4 p-4 bg-gray-200 rounded-md w-full text-center">
              <p>{message}</p>
            </div>
          )}

          {/* Health Score, Badge, Progress Bar */}
          {score !== null && (
            <>
              <div className="flex items-center gap-2 text-xl font-bold text-green-600 mt-4">
                🏆 Code Health Score: {score.toFixed(2)} / 10
                <span className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${getBadge(score).color}`}>
                  {getBadge(score).label}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Code Health</span>
                  <span className="text-sm font-medium text-gray-700">{(score * 10).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full"
                    style={{
                      width: `${score * 10}%`,
                      backgroundColor: score >= 8 ? "#16a34a" : score >= 5 ? "#facc15" : "#ef4444",
                      transition: "width 0.5s ease-in-out",
                    }}
                  ></div>
                </div>
              </div>

              {/* Problem Count or No Issues Success Message */}
              {problemCount !== null && (
                <>
                  {problemCount === 0 ? (
                    <div className="text-md font-semibold text-green-600 bg-green-100 rounded-md px-4 py-2 mt-4">
                      🎉 No issues found! Great job! ✅
                    </div>
                  ) : (
                    <div className="text-md font-medium text-gray-700 mt-2">
                      🛠️ {problemCount} {problemCount === 1 ? "Issue" : "Issues"} Found
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Analysis Report */}
          {result && problemCount !== 0 && (
            <div className="w-full p-4 bg-gray-50 border rounded-md mt-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" /> Analysis Report
              </h2>
              <ul className="text-sm text-gray-700 mt-2 list-disc pl-5">
                {result.map((item, index) => (
                  <li key={index}>
                    <div>
                      📍 <strong>Line {item.line}</strong>: {item.message}
                      {item.tip && (
                        <a
                          href={item.tip}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-500 underline text-xs"
                        >
                          Learn more
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Download Report Button */}
              <div className="flex justify-center mt-6">
                <Button onClick={handleDownloadReport} className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download Report
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
