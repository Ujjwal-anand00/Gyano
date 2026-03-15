import { useEffect, useState } from "react"
import api from "../services/api"
import DashboardLayout from "../layouts/DashboardLayout"

function Leaderboard(){

  const [students,setStudents] = useState<any[]>([])

  useEffect(()=>{

    api.get("/api/leaderboard")
    .then(res=>{
      setStudents(res.data)
    })

  },[])

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-8">
        Student Leaderboard
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6">

        <table className="w-full">

          <thead>

            <tr className="border-b text-left">

              <th className="py-3">Rank</th>
              <th>Student</th>
              <th>Completed Lessons</th>
              <th>Progress</th>

            </tr>

          </thead>

          <tbody>

            {students.map((student,index)=>{

              return(

                <tr key={index} className="border-b">

                  <td className="py-3 font-semibold">
                    {index+1}
                  </td>

                  <td>
                    {student.name}
                  </td>

                  <td>
                    {student.completedLessons}
                  </td>

                  <td>

                    <div className="flex items-center gap-3">

                      <div className="w-full bg-gray-200 rounded h-3">

                        <div
                          className="bg-blue-600 h-3 rounded"
                          style={{width:`${student.progress}%`}}
                        />

                      </div>

                      <span className="text-sm">
                        {student.progress}%
                      </span>

                    </div>

                  </td>

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  )

}

export default Leaderboard
