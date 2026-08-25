import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { Loader2, AlertCircle, Plus, Search } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://ems-backend-hazel.vercel.app";

const List = () => {
  const [leaves, setLeaves] = useState(null);
  const [filteredLeaves, setFilteredLeaves] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const { user } = useAuth();

  // Helper for Authorization & Anti-Cache Headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    };
  };

  useEffect(() => {
    // If the URL parameter or user authentication state is missing/invalid, stop loading
    if (!id || id === "undefined" || id === "null" || !user) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchLeaves = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/leave/${encodeURIComponent(id)}/${user.role}`,
          {
            headers: getAuthHeaders(),
            signal: controller.signal,
          },
        );

        if (response.data?.success) {
          const records = response.data.leaves || [];
          setLeaves(records);
          setFilteredLeaves(records);
        } else {
          setLeaves([]);
          setFilteredLeaves([]);
        }
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          console.error("Fetch leave error:", err);
          setError(
            err.response?.data?.error ||
              err.message ||
              "Failed to fetch leave history.",
          );
          setLeaves([]);
          setFilteredLeaves([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchLeaves();
    return () => controller.abort();
  }, [id, user]);

  const filterByInput = (e) => {
    const query = e.target.value.toLowerCase();
    if (!leaves) return;
    const data = leaves.filter((leave) =>
      (leave.leaveType || "").toLowerCase().includes(query),
    );
    setFilteredLeaves(data);
  };

  // Loading View
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-3" />
        <p className="text-gray-500 font-semibold">Loading leave history...</p>
      </div>
    );
  }

  // Error View
  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto mt-12 bg-white rounded-2xl shadow-md border border-red-100 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          Unable to Load Records
        </h3>
        <p className="text-sm text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow"
        >
          Retry
        </button>
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
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search By Leave Type..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              onChange={filterByInput}
            />
          </div>

          {user?.role === "employee" && (
            <Link
              to="/employee-dashboard/add-leave"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 font-bold rounded-lg text-white text-sm transition-all shadow active:scale-95"
            >
              <Plus size={16} /> Take New Leave
            </Link>
          )}
        </div>

        {!filteredLeaves || filteredLeaves.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500 font-medium shadow-sm border border-gray-100">
            No leave records found.
          </div>
        ) : (
          <>
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
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : leave.status === "Rejected"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
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

                  <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-700 border border-gray-100">
                    <p className="font-semibold text-gray-500 uppercase mb-0.5">
                      Reason
                    </p>
                    <p>{leave.reason || "No reason specified."}</p>
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
                  {filteredLeaves.map((leave, index) => (
                    <tr
                      key={leave._id}
                      className="bg-white border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {leave.leaveType}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(leave.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {leave.reason || "No reason specified."}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            leave.status === "Approved"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : leave.status === "Rejected"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
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
          </>
        )}
      </div>
    </div>
  );
};

export default List;
