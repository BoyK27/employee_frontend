import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaGraduationCap,
  FaMoneyBillWave,
  FaRegCalendar,
  FaTachometerAlt,
  FaUsers,
  FaTimes,
  FaClipboardList,
  FaBook,
  FaBookmark,
  FaCalendarCheck,
} from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const closeMobileSidebar = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar Container */}
      <div
        className={`bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 z-50 w-64 transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="bg-teal-600 h-12 flex items-center justify-between px-4 sticky top-0 z-10">
          <h3 className="text-2xl font-sans-serif flex-1 text-center font-bold">
            EMS Portal
          </h3>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white text-xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-2 my-4 space-y-1">
          {/* Main Dashboard */}
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            end
            onClick={closeMobileSidebar}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          {/* Core Modules */}
          <NavLink
            to="/admin-dashboard/departments"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <FaBuilding />
            <span>Departments</span>
          </NavLink>

          {/* --- ACADEMIC MANAGEMENT --- */}
          <div className="pt-3 pb-1 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Academic Management
          </div>

          <NavLink
            to="/admin-dashboard/classes"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <FaBook />
            <span>Classes</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/subjects"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <FaBookmark />
            <span>Subjects</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/exam-sessions"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <FaCalendarCheck />
            <span>Exam Sessions</span>
          </NavLink>

          {/* --- EMPLOYEE SECTION --- */}
          <div className="pt-3 pb-1 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Employee Management
          </div>

          <NavLink
            to="/admin-dashboard/employees"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <FaUsers />
            <span>Employees</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/leaves"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <FaCalendarAlt />
            <span>Employee Leaves</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/salary/add"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <FaMoneyBillWave />
            <span>Salary</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/attendance"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <FaRegCalendar />
            <span>Attendance</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/attendance-report"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <AiOutlineFileText />
            <span>Attendance Report</span>
          </NavLink>

          {/* --- STUDENT SECTION --- */}
          <div className="pt-3 pb-1 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Student Management
          </div>

          <NavLink
            to="/admin-dashboard/students"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <FaGraduationCap />
            <span>Students</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/student-leaves"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <FaCalendarAlt />
            <span>Student Leaves</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/student-attendance"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <FaClipboardList />
            <span>Student Attendance</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/student-attendance-report"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={closeMobileSidebar}
          >
            <AiOutlineFileText />
            <span>Student Report</span>
          </NavLink>

          {/* System Settings */}
          <div className="pt-3">
            <NavLink
              to="/admin-dashboard/settings"
              className={({ isActive }) =>
                `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
              }
              onClick={closeMobileSidebar}
            >
              <FaCogs />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
