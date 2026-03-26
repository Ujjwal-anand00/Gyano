import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

function AINotes() {
  const [notes, setNotes] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadNotes = async () => {
    const res = await fetch(`https://gyano.onrender.com/api/ai-notes/${user.id}`);
    const data = await res.json();

    if (data.success) {
      setNotes(data.notes);
    }
  };

  const deleteNote = async (id: number) => {
    await fetch(`https://gyano.onrender.com/api/ai-notes/${id}`, {
      method: "DELETE",
    });

    loadNotes();
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">📄 AI Notes</h1>

      {notes.length === 0 && <p>No notes saved yet</p>}

      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white shadow rounded-xl p-4 mb-4"
        >
          <p className="text-gray-700 whitespace-pre-line">
            {note.content}
          </p>

          <button
            onClick={() => deleteNote(note.id)}
            className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </DashboardLayout>
  );
}

export default AINotes;