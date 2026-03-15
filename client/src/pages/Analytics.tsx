import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import api from "../services/api"

function Analytics() {

  const [data, setData] = useState<any>(null)

  useEffect(() => {

    const token = localStorage.getItem("token")

    api.get("/api/analytics/student", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setData(res.data)
    })

  }, [])

  if(!data){
    return (
      <DashboardLayout>
        <p className="text-center mt-10">Loading analytics...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-8">
        Learning Analytics
      </h1>

      {/* STATS */}

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-gray-500">Enrolled Courses</h2>
          <p className="text-3xl font-bold">{data.enrolledCourses}</p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-gray-500">Total Lessons</h2>
          <p className="text-3xl font-bold">{data.totalLessons}</p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-gray-500">Completed Lessons</h2>
          <p className="text-3xl font-bold">{data.completedLessons}</p>
        </div>

      </div>


      {/* COURSE PROGRESS */}

      <div className="bg-white shadow rounded p-6">

        <h2 className="text-xl font-semibold mb-6">
          Course Progress
        </h2>

        {data.coursesProgress.map((course:any) => {

          const percent = course.totalLessons === 0
            ? 0
            : Math.round((course.completedLessons / course.totalLessons) * 100)

          return (
            <div key={course.id} className="mb-6">

              <p className="font-semibold mb-2">
                {course.title} ({percent}%)
              </p>

              <div className="w-full bg-gray-200 rounded h-3">

                <div
                  className="bg-green-500 h-3 rounded"
                  style={{width: `${percent}%`}}
                />

              </div>

            </div>
          )
        })}

      </div>

    </DashboardLayout>
  )
}

export default Analytics
