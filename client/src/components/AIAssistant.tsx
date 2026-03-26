import React, { useState } from "react";

type LessonType = {
  content?: string;
  title?: string;
};

type Props = {
  lesson: LessonType;
};

const AIAssistant: React.FC<Props> = ({ lesson }) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAskAI = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer("");

      const res = await fetch("https://gyano.onrender.com/api/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          lessonContent: `
  Title: ${lesson.title}
  Content: ${lesson.content}
  `,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAnswer(data.answer);
      } else {
        setAnswer("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setAnswer("Error connecting to AI");
    } finally {
      setLoading(false);
    }
  };
  const handleSaveNote = async () => {
    if (!answer) return;

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await fetch("https://gyano.onrender.com/api/ai-notes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          lesson_id: lesson.id,
          content: answer,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Notes saved!");
      } else {
        alert("Failed to save");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving note");
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl mt-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-3">🤖 AI Assistant</h2>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setQuestion("Summarize this lesson")}
          className="px-3 py-1 bg-purple-600 rounded text-sm"
        >
          Summary
        </button>

        <button
          onClick={() => setQuestion("Explain this in simple terms")}
          className="px-3 py-1 bg-green-600 rounded text-sm"
        >
          Simple Explain
        </button>
      </div>

      {/* Input */}
      <textarea
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        rows={3}
        placeholder="Ask anything about this lesson..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Button */}
      <button
        onClick={handleAskAI}
        className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {/* Answer */}
      {answer && (
        <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
          <p className="text-sm whitespace-pre-line">{answer}</p>
        </div>
      )}
      {answer && (
        <button
          onClick={handleSaveNote}
          className="mt-3 bg-yellow-500 px-4 py-2 rounded"
        >
          Save Notes
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
