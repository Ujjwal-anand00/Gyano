import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useState } from "react";
import { motion } from "framer-motion";

function DashboardLayout({ children }: any) {
  const [open, setOpen] = useState(true); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile sidebar

  return (
    <div className="flex gyano-page-shell">
      
      {/* SIDEBAR */}
      <Sidebar
        open={open}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN AREA */}
      <div
        className={`relative z-10 flex-1 flex flex-col bg-gray-50/90 min-h-screen transition-[margin] duration-300 ${
          open ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        
        {/* TOPBAR */}
        <Topbar setOpen={setOpen} setMobileOpen={setMobileOpen} />

        {/* CONTENT */}
        <motion.div
          className="p-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {children}
        </motion.div>

      </div>
    </div>
  );
}

export default DashboardLayout;
