import Sidebar from "../components/layout/Sidebar"
import Navbar from "../components/layout/Navbar"

function DashboardLayout({children}:any){

  return(

    <div className="flex">

      {/* SIDEBAR */}

      <Sidebar/>

      {/* MAIN AREA */}

      <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">

        {/* TOP NAVBAR */}

        <Navbar/>

        {/* PAGE CONTENT */}

        <div className="p-8">

          {children}

        </div>

      </div>

    </div>

  )

}

export default DashboardLayout
