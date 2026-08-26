import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import StudentSidebar from "../components/StudentDashboard/StudentSidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/dashboard/Navbar";
import {
  FaGraduationCap,
  FaCalendarCheck,
  FaClipboardList,
  FaUserCog,
  FaArrowRight,
} from "react-icons/fa";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check if student is at the exact root dashboard path
  const isRootDashboard =
    location.pathname === "/student-dashboard" ||
    location.pathname === "/student-dashboard/";

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Student Sidebar */}
      <StudentSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        {/* Top Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Dynamic Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {isRootDashboard ? (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-semibold bg-slate-700/60 text-teal-300 px-3 py-1 rounded-full uppercase tracking-wider">
                    Student Portal
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold mt-3">
                    Welcome back, {user?.name || "Student"}!
                  </h1>
                  <p className="text-slate-300 text-sm mt-1">
                    Track your academic progress, view published report cards,
                    and manage leave applications.
                  </p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-right min-w-[160px]">
                  <span className="text-xs text-slate-400 block">Status</span>
                  <span className="text-sm font-bold text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Active Student
                  </span>
                </div>
              </div>

              {/* Quick Actions & Navigation Cards */}
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Quick Dashboard Shortcuts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Academic Report Card */}
                  <div
                    onClick={() =>
                      navigate(`/student-dashboard/report-card/${user?._id}`)
                    }
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition cursor-pointer group space-y-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center text-xl group-hover:scale-110 transition">
                      <FaGraduationCap />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm group-hover:text-teal-700 transition">
                        Report Card
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        View grades & semester rankings
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-teal-700 font-semibold gap-1 pt-1">
                      View Results <FaArrowRight className="text-[10px]" />
                    </div>
                  </div>

                  {/* Leave Applications */}
                  <div
                    onClick={() => navigate("/student-dashboard/leaves")}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition cursor-pointer group space-y-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xl group-hover:scale-110 transition">
                      <FaClipboardList />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition">
                        Leave Requests
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Apply for leave & check approval status
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-blue-700 font-semibold gap-1 pt-1">
                      Manage Leaves <FaArrowRight className="text-[10px]" />
                    </div>
                  </div>

                  {/* Attendance Records */}
                  <div
                    onClick={() => navigate("/student-dashboard/attendance")}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-500 transition cursor-pointer group space-y-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center text-xl group-hover:scale-110 transition">
                      <FaCalendarCheck />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm group-hover:text-purple-700 transition">
                        Attendance
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Review your daily presence logs
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-purple-700 font-semibold gap-1 pt-1">
                      View Attendance <FaArrowRight className="text-[10px]" />
                    </div>
                  </div>

                  {/* Profile & Settings */}
                  <div
                    onClick={() => navigate("/student-dashboard/setting")}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-500 transition cursor-pointer group space-y-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xl group-hover:scale-110 transition">
                      <FaUserCog />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm group-hover:text-slate-800 transition">
                        Account Settings
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Update password & personal profile
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-slate-700 font-semibold gap-1 pt-1">
                      Settings <FaArrowRight className="text-[10px]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice / Information Box */}
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
                <div className="p-2 bg-slate-200 text-slate-700 rounded-lg text-lg hidden sm:block">
                  📢
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800 text-sm">
                    Student Notice
                  </p>
                  <p>
                    Report cards are compiled and published per semester by the
                    administration. If your report card is not visible, check
                    back once your administration publishes the semester
                    results.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Render child routes (Leaves, Report Card, Attendance, etc.) */
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
