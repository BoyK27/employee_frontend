import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserGraduate } from "react-icons/fa";

const StudentLeaveDetails = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(
          `https://ems-backend-hazel.vercel.app/api/student-leave/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          setLeave(response.data.leave);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error || "Failed to fetch details.");
        }
      }
    };
    fetchLeave();
  }, [id]);

  const changeStatus = async (leaveId, status) => {
    try {
      const response = await axios.put(
        `https://ems-backend-hazel.vercel.app/api/student-leave/${leaveId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        navigate("/admin-dashboard/student-leaves");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error || "Failed to update status.");
      }
    }
  };

  // Safely extract student profile details across possible populated Mongoose shapes
  const student = leave?.studentId?.userId || leave?.studentId || {};
  const departmentName =
    leave?.studentId?.department?.dep_name ||
    leave?.studentId?.department ||
    "N/A";

  return (
    <div className="p-4 md:p-10">
      {leave ? (
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Student Absence Request Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Profile Avatar / Image */}
            <div className="flex justify-center">
              {student.profileImage ? (
                <img
                  src={student.profileImage}
                  alt="Student Profile"
                  className="rounded-full border-4 border-teal-500 w-48 h-48 md:w-64 md:h-64 object-cover shadow-md"
                />
              ) : (
                <div className="rounded-full border-4 border-teal-500 w-48 h-48 md:w-64 md:h-64 bg-teal-50 flex items-center justify-center shadow-md">
                  <FaUserGraduate className="text-6xl text-teal-600" />
                </div>
              )}
            </div>

            {/* Information Grid */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-36">Student Name:</p>
                <p className="font-medium text-gray-900">
                  {student.name || "N/A"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-36">Matricule / ID:</p>
                <p className="font-medium text-gray-900">
                  {leave.studentId?.matricule ||
                    leave.studentId?.studentId ||
                    "N/A"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-36">Department:</p>
                <p className="font-medium text-gray-900">{departmentName}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-36">Reason Category:</p>
                <p className="font-medium text-gray-900">{leave.leaveType}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-36">Duration:</p>
                <p className="font-medium text-gray-900">
                  {new Date(leave.startDate).toLocaleDateString()} -{" "}
                  {new Date(leave.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-36">
                  Details / Reason:
                </p>
                <p className="font-medium text-gray-900">{leave.reason}</p>
              </div>

              {/* Action / Status */}
              <div className="flex flex-col sm:flex-row sm:space-x-3 pt-4">
                <p className="text-gray-500 font-bold w-36 mb-2 sm:mb-0">
                  {leave.status === "Pending" ? "Action:" : "Status:"}
                </p>
                {leave.status === "Pending" ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => changeStatus(leave._id, "Approved")}
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => changeStatus(leave._id, "Rejected")}
                      className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                      leave.status === "Approved"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {leave.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading details...</p>
        </div>
      )}
    </div>
  );
};

export default StudentLeaveDetails;
