import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaMoneyBillWave,
  FaRegCalendar,
  FaTachometerAlt,
  FaUsers,
  FaTimes, // Added for the close button
} from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";

// Destructure the props from AdminDashboard
const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay: Darkens the background when menu is open */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar Container */}
      <div
        className={`bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 z-50 w-64 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="bg-teal-600 h-12 flex items-center justify-between px-4">
          <h3 className="text-2xl font-sans-serif flex-1 text-center">
            Employee MS
          </h3>

          {/* Mobile Close Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white text-xl"
          >
            <FaTimes />
          </button>
        </div>

        <div className="px-2 mt-4 space-y-1">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            end
            onClick={() => window.innerWidth < 768 && toggleSidebar()} // Auto-close on link click (mobile)
          >
            <FaTachometerAlt />
            <span>DashBoard</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/employees"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            <FaUsers />
            <span>Employee</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/departments"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            <FaBuilding />
            <span>Departments</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/leaves"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            <FaCalendarAlt />
            <span>Leaves</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/salary/add"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            <FaMoneyBillWave />
            <span>Salary</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/attendance"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            <FaRegCalendar />
            <span>Attendance</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/attendance-report"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            <AiOutlineFileText />
            <span>Attendance Report</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/settings"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : "hover:bg-gray-700 "} flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            <FaCogs />
            <span>Setting</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
