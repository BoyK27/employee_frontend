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
        // --- DATA TRANSFORMATION START ---
        // We map the nested response from the backend into flat variables
        // so 'employeeId' is no longer undefined.
        const transformedData = response.data.leaves.map((leave, index) => ({
          _id: leave._id,
          sno: index + 1,
          // Access the nested employeeId string from the populated object
          employeeId: leave.employeeId?.employeeId || "N/A",
          name: leave.employeeId?.userId?.name || "Unknown",
          leaveType: leave.leaveType,
          department: leave.employeeId?.department?.dep_name || "N/A",
          startDate: leave.startDate,
          endDate: leave.endDate,
          reason: leave.reason,
          status: leave.status,
          // Calculate days automatically
          days:
            Math.ceil(
              (new Date(leave.endDate) - new Date(leave.startDate)) /
                (1000 * 60 * 60 * 24),
            ) || 1,
        }));
        setLeaves(transformedData);
        // --- DATA TRANSFORMATION END ---
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
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-extrabold text-gray-800">
          Manage Leaves
        </h3>
        <p className="text-gray-500 text-sm">
          Review and track time-off requests
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Leaves..."
          className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
        />

        {user.role === "employee" && (
          <Link
            to="/employee-dashboard/add-leave"
            className="w-full md:w-auto text-center px-6 py-2 bg-teal-600 rounded-xl text-white hover:bg-teal-700 transition-all shadow-md font-bold"
          >
            + Take New Leave
          </Link>
        )}
      </div>

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block overflow-x-auto shadow-sm rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-4">SNO</th>
              <th className="px-6 py-4">Emp ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Leave Type</th>
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr
                key={leave._id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4">{leave.sno}</td>
                {/* Now these fields will display correctly because of transformedData */}
                <td className="px-6 py-4 font-bold text-gray-700">
                  {leave.employeeId}
                </td>
                <td className="px-6 py-4">{leave.name}</td>
                <td className="px-6 py-4">{leave.leaveType}</td>
                <td className="px-6 py-4">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW --- */}
      <div className="md:hidden space-y-4">
        {leaves.map((leave) => (
          <div
            key={leave._id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-gray-400">
                ID: {leave.employeeId}
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
            <div className="mb-2">
              <p className="text-lg font-bold text-gray-800">{leave.name}</p>
              <p className="text-teal-600 text-xs font-bold uppercase">
                {leave.leaveType}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-600">
              <p>From: {new Date(leave.startDate).toLocaleDateString()}</p>
              <p>To: {new Date(leave.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {leaves.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl mt-4 border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">No leave records found.</p>
        </div>
      )}
    </div>
  );
};

export default List;
