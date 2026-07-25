import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const ViewStudentAttendance = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Validate parameter ID; if invalid, fallback to current user's ID
  const effectiveId =
    id && id !== "student-attendance" && id !== "undefined"
      ? id
      : user?._id || user?.id;

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!effectiveId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://ems-backend-hazel.vercel.app/api/student-attendance/${effectiveId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.data.success) {
          // Handle both 'records' and 'attendance' array structures
          const records =
            response.data.records || response.data.attendance || [];
          setAttendance(records);
          setFilteredAttendance(records);
        }
      } catch (error) {
        console.error("Error fetching attendance history:", error);
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error || "Failed to load attendance.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [effectiveId]);

  const filterByStatus = (status) => {
    if (!attendance) return;
    if (status === "All") {
      setFilteredAttendance(attendance);
    } else {
      const filtered = attendance.filter(
        (item) => item.status?.toLowerCase() === status.toLowerCase(),
      );
      setFilteredAttendance(filtered);
    }
  };

  const getStatusBadge = (status = "") => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-700 border-green-200";
      case "absent":
        return "bg-red-100 text-red-700 border-red-200";
      case "sick":
      case "leave":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Compute total counts dynamically with case-insensitive checks
  const stats = {
    total: attendance?.length || 0,
    present:
      attendance?.filter((a) => a.status?.toLowerCase() === "present").length ||
      0,
    absent:
      attendance?.filter((a) => a.status?.toLowerCase() === "absent").length ||
      0,
    leave:
      attendance?.filter((a) =>
        ["leave", "sick"].includes(a.status?.toLowerCase()),
      ).length || 0,
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
            My Attendance Record
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Track your daily attendance history and statuses
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase">
              Total Days
            </p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-xs font-bold text-green-500 uppercase">
              Present
            </p>
            <p className="text-2xl font-extrabold text-green-600 mt-1">
              {stats.present}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-xs font-bold text-red-500 uppercase">Absent</p>
            <p className="text-2xl font-extrabold text-red-600 mt-1">
              {stats.absent}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-xs font-bold text-yellow-500 uppercase">
              Leave / Sick
            </p>
            <p className="text-2xl font-extrabold text-yellow-600 mt-1">
              {stats.leave}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {["All", "Present", "Absent", "Leave", "Sick"].map((status) => (
            <button
              key={status}
              onClick={() => filterByStatus(status)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:border-teal-500 hover:text-teal-600 rounded-lg transition-all active:scale-95"
            >
              {status}
            </button>
          ))}
        </div>

        {/* Table / List View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
            <p className="text-gray-500 text-sm">
              Loading attendance records...
            </p>
          </div>
        ) : filteredAttendance && filteredAttendance.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase">
                    <th className="py-3 px-6">#</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredAttendance.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3.5 px-6 font-medium text-gray-400">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-gray-800">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase ${getStatusBadge(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">
              No attendance records found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudentAttendance;
