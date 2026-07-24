import React from "react";
import {
  FaGraduationCap,
  FaUserGraduate,
  FaIdCard,
  FaBookOpen,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const StudentSummaryCard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      {/* Main Welcome & Profile Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          {/* Welcome Text & Avatar */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl text-white backdrop-blur-sm border border-white/30">
              <FaUserGraduate />
            </div>
            <div>
              <p className="text-teal-100 text-sm font-medium uppercase tracking-wider">
                Welcome Back
              </p>
              <h2 className="text-2xl font-bold">{user?.name || "Student"}</h2>
              <p className="text-xs text-teal-200 mt-0.5">
                {user?.email || "student@institution.edu"}
              </p>
            </div>
          </div>

          {/* Quick Academic Badges */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1.5 border border-white/20">
              <FaIdCard className="text-teal-200" />
              <span>
                Matricule: {user?.matricule || user?.studentId || "N/A"}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1.5 border border-white/20">
              <FaGraduationCap className="text-teal-200" />
              <span>{user?.department || "Software Engineering"}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1.5 border border-white/20">
              <FaBookOpen className="text-teal-200" />
              <span>Level: {user?.level || "300"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSummaryCard;
