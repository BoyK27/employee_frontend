import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaGraduationCap,
  FaUser,
  FaBook,
  FaClock,
  FaFileAlt,
  FaCalendarCheck,
  FaPlaneDeparture,
  FaCogs,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const StudentSidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  // Helper function to handle auto-closing sidebar on mobile view
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 w-64 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        {/* Portal Header */}
        <div className="bg-teal-600 h-14 flex items-center justify-center space-x-2">
          <FaGraduationCap className="text-2xl" />
          <h3 className="text-xl font-bold tracking-wide">Student Portal</h3>
        </div>

        {/* Navigation Links */}
        <div className="px-2 mt-4 space-y-2">
          {/* Profile */}
          <NavLink
            to={`/student-dashboard/profile/${user?._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : "hover:bg-gray-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors`
            }
            onClick={handleNavClick}
          >
            <FaUser className="text-lg" />
            <span>My Profile</span>
          </NavLink>

          {/* Commented Out: My Courses */}
          {/* 
          <NavLink
            to={`/student-dashboard/courses/${user?._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : "hover:bg-gray-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors`
            }
            onClick={handleNavClick}
          >
            <FaBook className="text-lg" />
            <span>My Courses</span>
          </NavLink> 
          */}

          {/* Commented Out: Timetable */}
          {/* 
          <NavLink
            to={`/student-dashboard/timetable/${user?._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : "hover:bg-gray-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors`
            }
            onClick={handleNavClick}
          >
            <FaClock className="text-lg" />
            <span>Timetable</span>
          </NavLink> 
          */}

          {/* Commented Out: Grades & Results */}
          {/* 
          <NavLink
            to={`/student-dashboard/results/${user?._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : "hover:bg-gray-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors`
            }
            onClick={handleNavClick}
          >
            <FaFileAlt className="text-lg" />
            <span>Grades & Results</span>
          </NavLink> 
          */}

          {/* Leave Request */}
          <NavLink
            to={`/student-dashboard/leaves/${user?._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : "hover:bg-gray-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors`
            }
            onClick={handleNavClick}
          >
            <FaPlaneDeparture className="text-lg" />
            <span>Leave Request</span>
          </NavLink>

          {/* Attendance Report */}
          <NavLink
            to={`/student-dashboard/attendance/${user?._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : "hover:bg-gray-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors`
            }
            onClick={handleNavClick}
          >
            <FaCalendarCheck className="text-lg" />
            <span>Attendance Report</span>
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/student-dashboard/setting"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : "hover:bg-gray-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors`
            }
            onClick={handleNavClick}
          >
            <FaCogs className="text-lg" />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;
