import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

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
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("File upload failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <Card className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
        <CardContent className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Automated Code Review</h1>
          <p className="text-gray-600 text-center">
            Upload your Python script to analyze its quality with Pylint.
          </p>
          <label className="flex items-center gap-2 border border-dashed p-3 rounded-lg cursor-pointer">
            <Upload className="w-5 h-5 text-gray-500" />
            <input type="file" accept=".py" className="hidden" onChange={handleFileChange} />
            {file ? file.name : "Choose a Python file"}
          </label>
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading ? "Uploading..." : "Analyze Code"}
          </Button>
          
          {message && (
            <div className="mt-4 p-4 bg-gray-200 rounded-md">
              <p>{message}</p>
            </div>
          )}

          {result && (
            <div className="w-full p-4 bg-gray-50 border rounded-md mt-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" /> Analysis Report
              </h2>
              <ul className="text-sm text-gray-700 mt-2 list-disc pl-5">
                {result.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
