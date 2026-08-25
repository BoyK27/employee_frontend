import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  Building,
  User,
  FileText,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ems-backend-hazel.vercel.app";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Helper for Authorization Headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // 1. Fetch Leave Details on Mount
  useEffect(() => {
    const controller = new AbortController();

    const fetchLeave = async () => {
      if (!id || id === "undefined" || id === "null") {
        setError("Invalid leave request ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/leave/detail/${encodeURIComponent(id)}`,
          {
            headers: getAuthHeaders(),
            signal: controller.signal,
          },
        );

        if (!response.data?.success || !response.data.leave) {
          throw new Error(
            response.data?.error || "Leave details were not found.",
          );
        }

        setLeave(response.data.leave);
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          setError(
            requestError.response?.data?.error ||
              requestError.message ||
              "Failed to load leave details.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchLeave();
    return () => controller.abort();
  }, [id]);

  // 2. Handle Status Change (Approve / Reject)
  const changeStatus = async (leaveId, status) => {
    setUpdating(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/leave/${leaveId}`,
        { status },
        { headers: getAuthHeaders() },
      );

      if (response.data?.success) {
        navigate("/admin-dashboard/leaves");
      } else {
        alert(response.data?.error || "Status update failed.");
      }
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.message ||
          "Failed to update leave status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  // Loading View
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-3" />
        <p className="text-gray-500 font-semibold">Loading leave details...</p>
      </div>
    );
  }

  // Error View
  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto mt-12 bg-white rounded-2xl shadow-md border border-red-100 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          Unable to Load Details
        </h3>
        <p className="text-sm text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => navigate("/admin-dashboard/leaves")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow"
        >
          <ArrowLeft size={18} />
          Back to Leaves
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Back Button Header */}
        <button
          onClick={() => navigate("/admin-dashboard/leaves")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Leave Requests
        </button>

        {leave && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-extrabold mb-8 text-center text-gray-800 border-b pb-4">
              Leave Request Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center justify-center">
                <img
                  src={
                    leave.employeeId?.userId?.profileImage ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="rounded-full border-4 border-teal-500 w-40 h-40 md:w-52 md:h-52 object-cover shadow-md"
                />
                <span className="mt-4 text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200">
                  {leave.employeeId?.designation || "Employee"}
                </span>
              </div>

              {/* Information Grid */}
              <div className="space-y-3.5">
                <div className="flex border-b pb-2">
                  <span className="font-bold w-32 text-gray-500 flex items-center gap-2">
                    <User size={16} /> Name:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {leave.employeeId?.userId?.name || "N/A"}
                  </span>
                </div>

                <div className="flex border-b pb-2">
                  <span className="font-bold w-32 text-gray-500 flex items-center gap-2">
                    <FileText size={16} /> ID:
                  </span>
                  <span className="font-mono font-semibold text-gray-800">
                    {leave.employeeId?.employeeId || "N/A"}
                  </span>
                </div>

                <div className="flex border-b pb-2">
                  <span className="font-bold w-32 text-gray-500">
                    Leave Type:
                  </span>
                  <span className="font-semibold text-teal-700">
                    {leave.leaveType}
                  </span>
                </div>

                <div className="flex border-b pb-2">
                  <span className="font-bold w-32 text-gray-500">Gender:</span>
                  <span className="font-semibold text-gray-800 capitalize">
                    {leave.employeeId?.gender || "N/A"}
                  </span>
                </div>

                <div className="flex border-b pb-2">
                  <span className="font-bold w-32 text-gray-500 flex items-center gap-2">
                    <Building size={16} /> Department:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {leave.employeeId?.department?.dep_name || "N/A"}
                  </span>
                </div>

                <div className="flex border-b pb-2">
                  <span className="font-bold w-32 text-gray-500 flex items-center gap-2">
                    <Calendar size={16} /> Duration:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {new Date(leave.startDate).toLocaleDateString()} -{" "}
                    {new Date(leave.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex border-b pb-2">
                  <span className="font-bold w-32 text-gray-500">Reason:</span>
                  <span className="font-medium text-gray-700">
                    {leave.reason || "No reason specified."}
                  </span>
                </div>

                {/* Status / Actions */}
                <div className="flex items-center pt-3">
                  <span className="font-bold w-32 text-gray-500">
                    {leave.status === "Pending" ? "Action:" : "Status:"}
                  </span>

                  {leave.status === "Pending" ? (
                    <div className="flex space-x-3">
                      <button
                        disabled={updating}
                        onClick={() => changeStatus(leave._id, "Approved")}
                        className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg transition-all active:scale-95 shadow cursor-pointer"
                      >
                        {updating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                        Approve
                      </button>
                      <button
                        disabled={updating}
                        onClick={() => changeStatus(leave._id, "Rejected")}
                        className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg transition-all active:scale-95 shadow cursor-pointer"
                      >
                        {updating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle size={18} />
                        )}
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold uppercase border ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {leave.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
