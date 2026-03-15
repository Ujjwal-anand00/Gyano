import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  BookOpen,
  Layers,
  UploadCloud,
  Image,
  Video,
  Loader2,
} from "lucide-react";

function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("course");

  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);

  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState("");

  const [courseId, setCourseId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const loadCourses = async () => {
    const res = await api.get("/api/courses");
    setCourses(res.data);
  };

  const loadLessons = async () => {
    const res = await api.get("/api/lessons");
    setLessons(res.data);
  };

  useEffect(() => {
    loadCourses();
    loadLessons();
  }, []);

  /* CREATE COURSE */

  const createCourse = async () => {
    const token = localStorage.getItem("token");

    await api.post(
      "/api/courses",
      {
        title: courseTitle,
        description,
        thumbnail: courseThumbnail,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    alert("Course Created");

    setCourseTitle("");
    setDescription("");
    setCourseThumbnail("");

    loadCourses();
  };

  /* CREATE LESSON */

  const createLesson = async () => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", lessonTitle);
      formData.append("course_id", courseId);
      formData.append("subject", subject);
      formData.append("content", content);

      if (videoFile) {
        formData.append("video", videoFile);
      }

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      await api.post("/api/lessons/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          setUploadProgress(percent);
        },
      });

      alert("Lesson Uploaded");

      setUploadProgress(0);
      setUploading(false);

      loadLessons();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setUploading(false);
    }
  };
  const tabStyle = (tab: string) =>
    `flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition ${
      activeTab === tab
        ? "bg-blue-600 text-white shadow"
        : "bg-gray-100 hover:bg-gray-200"
    }`;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Teacher Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Create and manage courses, lessons, and quizzes.
          </p>
        </div>

        {/* TABS */}

        <div className="flex gap-4 mb-8">
          <button
            className={tabStyle("course")}
            onClick={() => setActiveTab("course")}
          >
            <BookOpen size={16} />
            Create Course
          </button>

          <button
            className={tabStyle("lesson")}
            onClick={() => setActiveTab("lesson")}
          >
            <Layers size={16} />
            Create Lesson
          </button>
        </div>

        {/* FORM CARD */}

        <div className="bg-white shadow-lg rounded-xl p-8">
          {/* CREATE COURSE */}

          {activeTab === "course" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Create New Course</h2>

              <div className="grid gap-5">
                <div>
                  <label className="text-sm text-gray-600">Course Title</label>

                  <input
                    value={courseTitle}
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="React for Beginners"
                    onChange={(e) => setCourseTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Thumbnail URL</label>

                  <input
                    value={courseThumbnail}
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://image-url.com"
                    onChange={(e) => setCourseThumbnail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Course Description
                  </label>

                  <textarea
                    value={description}
                    rows={4}
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Describe your course..."
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                  onClick={createCourse}
                >
                  Create Course
                </button>
              </div>
            </div>
          )}

          {/* CREATE LESSON */}

          {activeTab === "lesson" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Create Lesson</h2>

              <div className="grid gap-6">
                {/* COURSE SELECT */}

                <div>
                  <label className="text-sm text-gray-600">Select Course</label>

                  <select
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setCourseId(e.target.value)}
                  >
                    <option>Select Course</option>

                    {courses.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* LESSON TITLE */}

                <div>
                  <label className="text-sm text-gray-600">Lesson Title</label>

                  <input
                    value={lessonTitle}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500"
                    placeholder="Introduction to React"
                    onChange={(e) => setLessonTitle(e.target.value)}
                  />
                </div>

                {/* SUBJECT */}

                <div>
                  <label className="text-sm text-gray-600">Subject</label>

                  <input
                    value={subject}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500"
                    placeholder="React Basics"
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* VIDEO UPLOAD */}

                  <div className="border-2 border-dashed rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition text-center">
                    <Video className="mx-auto text-blue-600 mb-3" size={32} />

                    <p className="font-medium text-gray-700">
                      Upload Lesson Video
                    </p>

                    <p className="text-sm text-gray-400 mb-4">
                      MP4, MOV up to 500MB
                    </p>

                    <label className="cursor-pointer flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg w-fit mx-auto hover:bg-blue-700 transition">
                      <UploadCloud size={16} />
                      Choose Video
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) =>
                          setVideoFile(e.target.files?.[0] || null)
                        }
                      />
                    </label>

                    {videoFile && (
                      <p className="text-green-600 text-sm mt-3">
                        {videoFile.name}
                      </p>
                    )}
                  </div>
                  {uploading && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-2">
                        Uploading video... {uploadProgress}%
                      </p>

                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-blue-600 h-3 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* THUMBNAIL UPLOAD */}

                  <div className="border-2 border-dashed rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition text-center">
                    <Image className="mx-auto text-purple-600 mb-3" size={32} />

                    <p className="font-medium text-gray-700">
                      Upload Lesson Thumbnail
                    </p>

                    <p className="text-sm text-gray-400 mb-4">
                      JPG, PNG recommended
                    </p>

                    <label className="cursor-pointer flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg w-fit mx-auto hover:bg-purple-700 transition">
                      <UploadCloud size={16} />
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setThumbnailFile(e.target.files?.[0] || null)
                        }
                      />
                    </label>

                    {thumbnailFile && (
                      <p className="text-green-600 text-sm mt-3">
                        {thumbnailFile.name}
                      </p>
                    )}
                  </div>
                  {uploading && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-2">
                        Uploading video... {uploadProgress}%
                      </p>

                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-blue-600 h-3 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* CONTENT */}

                <div>
                  <label className="text-sm text-gray-600">
                    Lesson Content
                  </label>

                  <textarea
                    value={content}
                    rows={4}
                    className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500"
                    placeholder="Explain lesson details..."
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* BUTTON */}

                <button
                  disabled={uploading}
                  onClick={createLesson}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition shadow 
  ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud size={18} />
                      Upload Lesson
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TeacherDashboard;
