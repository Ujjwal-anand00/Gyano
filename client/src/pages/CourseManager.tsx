import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { Pencil, Trash2, BookOpen, Save } from "lucide-react";

function CourseManager() {

  const [courses, setCourses] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const res = await api.get("/api/courses");
    setCourses(res.data);
  };

  const deleteCourse = async (id: number) => {
    await api.delete(`/api/courses/${id}`);
    loadCourses();
  };

  const startEdit = (course: any) => {
    setEditing(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setThumbnail(course.thumbnail);
  };

  const updateCourse = async () => {

    await api.put(`/api/courses/${editing}`, {
      title,
      description,
      thumbnail
    });

    setEditing(null);
    loadCourses();
  };

  return (

    <DashboardLayout>

      <div className="max-w-6xl mx-auto">

        {/* PAGE HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Courses
          </h1>

          <p className="text-gray-500 mt-1">
            Edit or remove courses from your platform.
          </p>
        </div>


        {/* EMPTY STATE */}

        {courses.length === 0 && (
          <div className="bg-white p-10 rounded-xl shadow text-center">

            <BookOpen size={40} className="mx-auto text-gray-300 mb-4" />

            <p className="text-gray-500">
              No courses available yet.
            </p>

          </div>
        )}


        {/* COURSE LIST */}

        <div className="space-y-5">

          {courses.map((course) => (

            <div
              key={course.id}
              className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-5"
            >

              {editing === course.id ? (

                <div className="grid gap-3">

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Course title"
                    className="border rounded-lg px-3 py-2"
                  />

                  <input
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="Thumbnail URL"
                    className="border rounded-lg px-3 py-2"
                  />

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Course description"
                    className="border rounded-lg px-3 py-2"
                  />

                  <button
                    onClick={updateCourse}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-fit"
                  >
                    <Save size={16}/>
                    Save Changes
                  </button>

                </div>

              ) : (

                <div className="flex items-center justify-between">

                  {/* LEFT SIDE */}

                  <div className="flex items-center gap-4">

                    <img
                      src={course.thumbnail}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div>

                      <h3 className="text-lg font-semibold text-gray-800">
                        {course.title}
                      </h3>

                      <p className="text-gray-500 text-sm line-clamp-2">
                        {course.description}
                      </p>

                    </div>

                  </div>


                  {/* ACTION BUTTONS */}

                  <div className="flex gap-3">

                    <button
                      onClick={() => startEdit(course)}
                      className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    >
                      <Pencil size={16}/>
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      <Trash2 size={16}/>
                      Delete
                    </button>

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </DashboardLayout>

  );

}

export default CourseManager;

