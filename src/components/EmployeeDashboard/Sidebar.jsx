import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile Overlay: visible only when sidebar is open on small screens */}
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
        <div className="bg-teal-600 h-12 flex items-center justify-center">
          <h3 className="text-2xl text-center font-sans-serif">Employee MS</h3>
        </div>

        <div className="px-2 mt-4 space-y-2">
          <NavLink
            to="/employee-dashboard"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : ""}flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            end
            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to={`/employee-dashboard/profile/${user._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : ""}flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
          >
            <FaUsers />
            <span>My Profile</span>
          </NavLink>

          <NavLink
            to={`/employee-dashboard/leaves/${user._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : ""}flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
          >
            <FaBuilding />
            <span>Leaves</span>
          </NavLink>

          <NavLink
            to={`/employee-dashboard/salary/${user._id}`}
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : ""}flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
          >
            <FaCalendarAlt />
            <span>Salary</span>
          </NavLink>

          <NavLink
            to="/employee-dashboard/setting"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500 " : ""}flex items-center space-x-4 py-2.5 px-4 rounded`
            }
            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
          >
            <FaCogs />
            <span>Setting</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
