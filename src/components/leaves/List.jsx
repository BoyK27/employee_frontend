import React from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const List = () => {
  const [leaves, setLeaves] = React.useState(null);
  const [filteredLeaves, setFilteredLeaves] = React.useState(null);
  let sno = 1;
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
        setFilteredLeaves(response.data.leaves);
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

  const filterByInput = (e) => {
    const query = e.target.value.toLowerCase();
    const data = leaves.filter((leave) =>
      (leave.leaveType || "").toLowerCase().includes(query),
    );
    setFilteredLeaves(data);
  };

  if (!filteredLeaves) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading leaves...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-extrabold text-gray-800">
            My Leave History
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <input
            type="text"
            placeholder="Search By Leave Type..."
            className="w-full sm:w-72 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            onChange={filterByInput}
          />

          {user.role === "employee" && (
            <Link
              to="/employee-dashboard/add-leave"
              className="w-full sm:w-auto text-center px-4 py-2 bg-teal-600 hover:bg-teal-700 font-bold rounded-lg text-white text-sm transition-all shadow active:scale-95"
            >
              + Take New Leave
            </Link>
          )}
        </div>

        {/* --- MOBILE VIEW (Cards) --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredLeaves.map((leave) => (
            <div
              key={leave._id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-800 text-base">
                  {leave.leaveType}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
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

              <div className="text-xs text-gray-500 space-y-1 mb-3">
                <p>
                  <span className="font-semibold">From:</span>{" "}
                  {new Date(leave.startDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">To:</span>{" "}
                  {new Date(leave.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-700">
                <p className="font-semibold text-gray-500 uppercase mb-0.5">
                  Reason
                </p>
                <p>{leave.reason}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- DESKTOP VIEW (Table) --- */}
        <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">SNO</th>
                <th className="px-6 py-3">Leave Type</th>
                <th className="px-6 py-3">From</th>
                <th className="px-6 py-3">To</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr
                  key={leave._id}
                  className="bg-white border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">{sno++}</td>
                  <td className="px-6 py-4 font-semibold">{leave.leaveType}</td>
                  <td className="px-6 py-4">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{leave.reason}</td>
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
      </div>
    </div>
  );
};

export default List;
