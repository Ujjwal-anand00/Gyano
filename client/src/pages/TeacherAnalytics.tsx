import { useEffect, useState } from "react"
import api from "../services/api"
import DashboardLayout from "../layouts/DashboardLayout"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

function TeacherAnalytics(){

  const [data,setData] = useState<any>(null)

  useEffect(()=>{

    api.get("/api/teacher-analytics")
    .then(res=>{
      setData(res.data)
    })

  },[])

  if(!data){
    return(
      <DashboardLayout>
        <p className="text-center mt-10">
          Loading analytics...
        </p>
      </DashboardLayout>
    )
  }

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-10">
        Instructor Analytics
      </h1>


      {/* STATS CARDS */}

      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <div className="bg-white shadow-lg rounded-xl p-6">
          <p className="text-gray-500">Courses</p>
          <h2 className="text-3xl font-bold">{data.totalCourses}</h2>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <p className="text-gray-500">Lessons</p>
          <h2 className="text-3xl font-bold">{data.totalLessons}</h2>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <p className="text-gray-500">Students</p>
          <h2 className="text-3xl font-bold">{data.totalStudents}</h2>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <p className="text-gray-500">Completed Lessons</p>
          <h2 className="text-3xl font-bold">{data.completedLessons}</h2>
        </div>

      </div>


      {/* CHARTS */}

      <div className="grid md:grid-cols-2 gap-8 mb-10">

        {/* STUDENTS PER COURSE */}

        <div className="bg-white shadow-lg rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-6">
            Students per Course
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={data.coursePerformance}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="title"/>

              <YAxis />

              <Tooltip />

              <Bar dataKey="students" fill="#2563eb"/>

            </BarChart>

          </ResponsiveContainer>

        </div>



        {/* LESSONS PER COURSE */}

        <div className="bg-white shadow-lg rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-6">
            Lessons per Course
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={data.coursePerformance}>

              <CartesianGrid strokeDasharray="3 3"/>

              <XAxis dataKey="title"/>

              <YAxis />

              <Tooltip />

              <Bar dataKey="lessons" fill="#16a34a"/>

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>



      {/* COURSE PERFORMANCE TABLE */}

      <div className="bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-6">
          Course Performance
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b text-left">

              <th className="py-3">Course</th>
              <th>Students</th>
              <th>Lessons</th>

            </tr>

          </thead>

          <tbody>

            {data.coursePerformance.map((course:any,index:number)=>(
              <tr key={index} className="border-b">

                <td className="py-3">
                  {course.title}
                </td>

                <td>
                  {course.students}
                </td>

                <td>
                  {course.lessons}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  )

}

export default TeacherAnalytics
