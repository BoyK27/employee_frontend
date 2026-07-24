import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import StudentSidebar from "../components/StudentDashboard/StudentSidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/dashboard/Navbar";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Student Sidebar - Manages open/close state for mobile drawer */}
      <StudentSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        {/* Top Navbar with hamburger toggle for small screens */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Dynamic Nested Routes (Student Overview, Leaves, Attendance, Settings) */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
