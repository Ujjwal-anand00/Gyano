import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { Trash2, BookOpen, Pencil } from "lucide-react";

function LessonManager() {
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [lessons, setLessons] = useState<any[]>([]);

  const loadLessons = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/lessons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setLessons(res.data);
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const deleteLesson = async (id: number) => {
    const token = localStorage.getItem("token");

    await api.delete(`/api/lessons/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadLessons();
  };

  const startEdit = (lesson: any) => {
    setEditingLesson(lesson);

    setTitle(lesson.title);
    setSubject(lesson.subject);
    setVideoUrl(lesson.video_url);
    setThumbnail(lesson.thumbnail);
  };

  const updateLesson = async () => {
    const token = localStorage.getItem("token");

    await api.put(
      `/api/lessons/${editingLesson.id}`,
      {
        title,
        subject,
        video_url: videoUrl,
        thumbnail,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setEditingLesson(null);
    loadLessons();
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* PAGE TITLE */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Lessons</h1>
          <p className="text-gray-500 mt-1">
            View and manage all course lessons.
          </p>
        </div>

        {/* EMPTY STATE */}

        {lessons.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No lessons available yet.</p>
          </div>
        )}

        {/* LESSON LIST */}

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white shadow-md rounded-xl p-5 flex items-center justify-between hover:shadow-lg transition"
            >
              {/* LEFT SIDE */}

              <div className="flex items-center gap-4">
                <img
                  src={lesson.thumbnail}
                  className="w-16 h-16 object-cover rounded-lg"
                />

                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {lesson.title}
                  </h3>

                  <p className="text-gray-500 text-sm">{lesson.subject}</p>
                </div>
              </div>

              {/* DELETE BUTTON */}

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(lesson)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() => deleteLesson(lesson.id)}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {editingLesson && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
              <h2 className="text-xl font-bold">Edit Lesson</h2>

              <input
                className="w-full border p-2 rounded"
                placeholder="Lesson Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Thumbnail URL"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={updateLesson}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default LessonManager;
