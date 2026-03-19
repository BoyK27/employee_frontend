import React from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const List = () => {
  const [leaves, setLeaves] = React.useState(null);
  const { id } = useParams();
  const { user } = useAuth();

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        `https://ems-backend-hazel.vercel.app/api/leave/${id}/${user.role}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        setLeaves(response.data.leaves);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        console.log(error.message);
      }
    }
  };

  React.useEffect(() => {
    fetchLeaves();
  }, []);

  if (!leaves) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">
          Manage Leaves
        </h3>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Leaves..."
          className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {user.role === "employee" && (
          <Link
            to="/employee-dashboard/add-leave"
            className="w-full md:w-auto text-center px-6 py-2 bg-teal-600 rounded-md text-white hover:bg-teal-700 transition-colors shadow-md"
          >
            + Take New Leave
          </Link>
        )}
      </div>

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block overflow-x-auto shadow-sm rounded-lg border">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-4">SNO</th>
              <th className="px-6 py-4">Leave Type</th>
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">To</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, index) => {
              // CRITICAL FIX: Skip the row if leave data is null/corrupted
              if (!leave) return null;

              return (
                <tr
                  key={leave._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {leave.leaveType}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 truncate max-w-[150px]">
                    {leave.reason || "No reason provided"}
                  </td>
                  <td
                    className={`px-6 py-4 font-bold ${
                      leave.status === "Approved"
                        ? "text-green-600"
                        : leave.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {leave.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW --- */}
      <div className="md:hidden space-y-4">
        {leaves.map((leave, index) => {
          // CRITICAL FIX: Skip the card if leave data is null
          if (!leave) return null;

          return (
            <div
              key={leave._id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-gray-400">
                  RECORD #{index + 1}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    leave.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : leave.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {leave.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <p className="text-gray-500 font-semibold">Type:</p>
                <p className="text-gray-900 font-medium">{leave.leaveType}</p>

                <p className="text-gray-500 font-semibold">From:</p>
                <p className="text-gray-700">
                  {new Date(leave.startDate).toLocaleDateString()}
                </p>

                <p className="text-gray-500 font-semibold">To:</p>
                <p className="text-gray-700">
                  {new Date(leave.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-gray-400 font-bold text-[10px] uppercase mb-1">
                  Reason for leave
                </p>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "{leave.reason}"
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {leaves.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          No leave records found.
        </div>
      )}
    </div>
  );
};

export default List;
