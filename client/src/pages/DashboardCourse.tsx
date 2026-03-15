import { useEffect,useState } from "react"
import api from "../services/api"
import DashboardLayout from "../layouts/DashboardLayout"

function DashboardCourses(){

 const [courses,setCourses] = useState<any[]>([])

 useEffect(()=>{

  api.get("/api/courses")
   .then(res=>{
    setCourses(res.data)
   })

 },[])


 const enroll = async(id:number)=>{

  const token = localStorage.getItem("token")

  await api.post(
   "/api/enrollment/enroll",
   { course_id:id },
   {
    headers:{
     Authorization:`Bearer ${token}`
    }
   }
  )

  alert("Enrolled successfully")

 }


 return(

  <DashboardLayout>

   <h1 className="text-3xl font-bold mb-6">
    Browse Courses
   </h1>

   <div className="grid grid-cols-3 gap-6">

    {courses.map((course:any)=>(

     <div key={course.id} className="border p-4 rounded-lg">

      <img
       src={course.thumbnail}
       className="rounded mb-3"
      />

      <h3 className="font-semibold">
       {course.title}
      </h3>

      <button
       onClick={()=>enroll(course.id)}
       className="bg-blue-600 text-white px-3 py-1 rounded mt-3"
      >
       Enroll
      </button>

     </div>

    ))}

   </div>

  </DashboardLayout>

 )

}

export default DashboardCourses