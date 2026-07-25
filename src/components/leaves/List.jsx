import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const List = () => {
  const [leaves, setLeaves] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const { user } = useAuth();

  const fetchLeaves = async () => {
    try {
      const activeId = id || user?._id;
      const response = await axios.get(
        `https://ems-backend-hazel.vercel.app/api/student-leave/${activeId}/${user?.role}`,
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
        console.error(error.response.data.error || error.message);
      }
    }
  };

  useEffect(() => {
    if (user?.role) {
      fetchLeaves();
    }
  }, [id, user?.role]);

  // Status Badge Helper
  const getStatusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  // Filter leaves based on search input
  const filteredLeaves = leaves?.filter(
    (leave) =>
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!leaves) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        <p className="text-gray-500 animate-pulse">
          Loading absence history...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-extrabold text-gray-800">
          Absence Request History
        </h3>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search by Reason or Type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 outline-none text-sm"
          />
        </div>

        {user?.role === "student" && (
          <Link
            to="/student-dashboard/add-leave"
            className="w-full md:w-auto text-center px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-white font-bold transition-all shadow-lg active:scale-95"
          >
            + New Absence Request
          </Link>
        )}
      </div>

      {/* --- MOBILE VIEW (Cards) --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredLeaves?.map((leave, index) => (
          <div
            key={leave._id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {leave.leaveType}
                </span>
                <h4 className="text-xs font-semibold text-gray-400 mt-2">
                  #{index + 1}
                </h4>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(leave.status)}`}
              >
                {leave.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-3 rounded-xl">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  From
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(leave.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  To
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(leave.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                Reason Details
              </p>
              <p className="text-sm text-gray-600 italic line-clamp-3">
                "{leave.reason}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- DESKTOP VIEW (Table) --- */}
      <div className="hidden md:block overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">To</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeaves?.map((leave, index) => (
              <tr
                key={leave._id}
                className="hover:bg-gray-50 transition-colors bg-white"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-semibold text-teal-700">
                  {leave.leaveType}
                </td>
                <td className="px-6 py-4">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 max-w-xs truncate">{leave.reason}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(leave.status)}`}
                  >
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLeaves?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl mt-4 border border-gray-100 shadow-sm">
          <p className="text-gray-400">No absence records found.</p>
        </div>
      )}
    </div>
  );
};

export default List;
