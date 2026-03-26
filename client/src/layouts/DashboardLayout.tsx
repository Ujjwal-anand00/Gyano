import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useState } from "react";

function DashboardLayout({ children }: any) {
  const [open, setOpen] = useState(true); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile sidebar

  return (
    <div className="flex">
      
      {/* SIDEBAR */}
      <Sidebar
        open={open}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        
        {/* TOPBAR */}
        <Topbar setOpen={setOpen} setMobileOpen={setMobileOpen} />

        {/* CONTENT */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>

      </div>
    </div>
  );
}

export default DashboardLayout;