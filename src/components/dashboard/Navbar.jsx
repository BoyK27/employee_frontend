import React from "react";
import { useAuth } from "../../context/authContext";
import { FaBars } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center text-white justify-between h-12 bg-teal-600 px-5 shadow-md">
      <div className="flex items-center space-x-4">
        <button
          className="text-white text-xl md:hidden focus:outline-none hover:text-gray-200"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>

        {/* User Greeting */}
        <p className="font-medium hidden sm:block">Welcome, {user.name}</p>
        <p className="font-medium sm:hidden">Welcome</p>
      </div>

      {/* Logout Button */}
      <button
        className="px-4 py-1 bg-teal-700 hover:bg-teal-800 rounded transition-colors duration-200 text-sm"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
