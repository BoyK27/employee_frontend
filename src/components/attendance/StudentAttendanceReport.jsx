import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentAttendanceReport = () => {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    sick: 0,
    leave: 0,
    percentage: 0,
  });
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStudentReport = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (dateFilter) {
        query.append("date", dateFilter);
      }

      const response = await axios.get(
        `https://ems-backend-hazel.vercel.app/api/student-attendance/report?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        // FIX: Fetch response.data.report matching your controller's return key
        const records = response.data.report || [];
        setAttendance(records);

        // Summary calculations
        const total = records.length;
        const presentCount = records.filter(
          (r) => r.status?.toLowerCase() === "present",
        ).length;
        const absentCount = records.filter(
          (r) => r.status?.toLowerCase() === "absent",
        ).length;
        const sickCount = records.filter(
          (r) => r.status?.toLowerCase() === "sick",
        ).length;
        const leaveCount = records.filter(
          (r) => r.status?.toLowerCase() === "leave",
        ).length;

        const pct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

        setSummary({
          total,
          present: presentCount,
          absent: absentCount,
          sick: sickCount,
          leave: leaveCount,
          percentage: pct,
        });
      }
    } catch (error) {
      console.error("Error fetching attendance report:", error);
      alert(error.response?.data?.error || "Failed to load attendance report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentReport();
  }, [dateFilter]);

  const getStatusBadge = (status = "") => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-700 border-green-200";
      case "absent":
        return "bg-red-100 text-red-700 border-red-200";
      case "sick":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "leave":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-10 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">
          Attendance History & Report
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Track course presence and personal attendance history
        </p>

        {/* Attendance Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase">
              Total Sessions
            </p>
            <p className="text-2xl font-black text-gray-800 mt-1">
              {summary.total}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
            <p className="text-xs font-bold text-green-600 uppercase">
              Present
            </p>
            <p className="text-2xl font-black text-green-700 mt-1">
              {summary.present}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
            <p className="text-xs font-bold text-red-600 uppercase">Absent</p>
            <p className="text-2xl font-black text-red-700 mt-1">
              {summary.absent}
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
            <p className="text-xs font-bold text-amber-600 uppercase">
              Sick / Leave
            </p>
            <p className="text-2xl font-black text-amber-700 mt-1">
              {summary.sick + summary.leave}
            </p>
          </div>
          <div className="col-span-2 md:col-span-1 bg-teal-50 p-4 rounded-xl border border-teal-100 text-center">
            <p className="text-xs font-bold text-teal-600 uppercase">
              Presence Rate
            </p>
            <p className="text-2xl font-black text-teal-700 mt-1">
              {summary.percentage}%
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              className="w-full md:w-64 p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all cursor-pointer text-sm"
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-xs font-bold text-teal-600 hover:underline self-start md:self-end"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Attendance Records Table */}
        {!loading && attendance.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-4 py-4 font-bold uppercase text-[11px] tracking-widest text-center w-16">
                    S No
                  </th>
                  <th className="px-4 py-4 font-bold uppercase text-[11px] tracking-widest min-w-[140px]">
                    Date
                  </th>
                  <th className="px-4 py-4 font-bold uppercase text-[11px] tracking-widest min-w-[180px]">
                    Student Name
                  </th>
                  <th className="px-4 py-4 font-bold uppercase text-[11px] tracking-widest min-w-[140px]">
                    Class / Form
                  </th>
                  <th className="px-4 py-4 font-bold uppercase text-[11px] tracking-widest text-center w-32">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {attendance.map((record, index) => {
                  const student = record.studentId || {};
                  const user = student.userId || {};
                  const formattedDate = record.date
                    ? new Date(record.date).toISOString().split("T")[0]
                    : "N/A";

                  return (
                    <tr
                      key={record._id || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-gray-500 text-center font-medium">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-700">
                        {formattedDate}
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-800">
                        {user.name || record.name || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {student.form
                          ? `${student.form} ${student.stream || ""}`.trim()
                          : record.department || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                            record.status,
                          )}`}
                        >
                          {record.status || "Not Marked"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No attendance records found.
            </div>
          )
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-16 space-x-3">
            <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-teal-600 font-bold text-sm">
              Fetching attendance records...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceReport;
