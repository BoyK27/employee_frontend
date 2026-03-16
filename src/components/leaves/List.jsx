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
        `http://localhost:5000/api/leave/${id}/${user.role}`,
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
    return <div className="p-6 text-center">Loading...</div>;
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
          placeholder="Search By Dep Name"
          className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {user.role === "employee" && (
          <Link
            to="/employee-dashboard/add-leave"
            className="w-full md:w-auto text-center px-6 py-2 bg-teal-600 rounded-md text-white hover:bg-teal-700 transition-colors"
          >
            Take New Leave
          </Link>
        )}
      </div>

      {/* Table for Desktop/Tablet */}
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
            {leaves.map((leave, index) => (
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
                  {leave.reason}
                </td>
                <td
                  className={`px-6 py-4 font-semibold ${
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Card Layout for Mobile */}
      <div className="md:hidden space-y-4">
        {leaves.map((leave, index) => (
          <div
            key={leave._id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-gray-400">
                #{index + 1}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
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
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-500 font-medium">Type:</p>
              <p className="text-gray-900">{leave.leaveType}</p>

              <p className="text-gray-500 font-medium">From:</p>
              <p>{new Date(leave.startDate).toLocaleDateString()}</p>

              <p className="text-gray-500 font-medium">To:</p>
              <p>{new Date(leave.endDate).toLocaleDateString()}</p>
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-gray-500 font-medium text-xs uppercase mb-1">
                Reason:
              </p>
              <p className="text-sm text-gray-700 italic">"{leave.reason}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
