import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://ems-backend-hazel.vercel.app/api/student-attendance/date?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        let records = response.data.attendance || [];

        if (records.length === 0) {
          const studentRes = await axios.get(
            "https://ems-backend-hazel.vercel.app/api/student",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );
          if (studentRes.data.success) {
            records = (studentRes.data.students || []).map((std) => ({
              studentId: std,
              status: "Not Marked",
            }));
          }
        }

        let sno = 1;
        const formattedData = records
          .filter((att) => att.studentId)
          .map((att) => ({
            _id: att._id || null,
            sno: sno++,
            rawStudentId: att.studentId._id,
            studentId: att.studentId.studentId || "N/A",
            name: att.studentId.userId?.name || "N/A",
            department: att.studentId.department?.dep_name || "N/A",
            form: att.studentId.form || "",
            stream: att.studentId.stream || "",
            status: att.status || "Not Marked",
          }));

        setAttendance(formattedData);
        setFilteredAttendance(formattedData);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const handleStatusChange = async (studentObjId, newStatus) => {
    setUpdatingId(studentObjId);
    try {
      const response = await axios.post(
        "https://ems-backend-hazel.vercel.app/api/student-attendance/update",
        {
          studentId: studentObjId,
          status: newStatus,
          date: selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        const updated = attendance.map((item) =>
          item.rawStudentId === studentObjId
            ? { ...item, status: newStatus }
            : item,
        );
        setAttendance(updated);
        setFilteredAttendance(updated);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error updating attendance status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFilter = (e) => {
    const term = e.target.value.toLowerCase();
    const records = attendance.filter(
      (std) =>
        std.name.toLowerCase().includes(term) ||
        std.studentId.toLowerCase().includes(term),
    );
    setFilteredAttendance(records);
  };

  const columns = [
    { name: "S.No", selector: (row) => row.sno, width: "70px" },
    { name: "Student ID", selector: (row) => row.studentId, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    {
      name: "Class",
      selector: (row) => `${row.form} ${row.stream}`.trim() || "N/A",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      name: "Mark Action",
      center: true,
      cell: (row) => (
        <ActionButtons
          currentStatus={row.status}
          studentObjId={row.rawStudentId}
          onStatusChange={handleStatusChange}
          isUpdating={updatingId === row.rawStudentId}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Loading student attendance...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
          Manage Student Attendance
        </h3>
        <div className="mt-2 inline-flex items-center gap-2 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">
          <span className="text-teal-700 font-semibold text-sm">Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-teal-800 font-bold text-sm outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search student name or ID..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
            onChange={handleFilter}
          />
        </div>

        <Link
          to="/admin-dashboard/student-attendance-report"
          className="w-full md:w-auto text-center px-6 py-3 bg-gray-800 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
        >
          View Full Report
        </Link>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredAttendance.map((att) => (
          <div
            key={att.rawStudentId}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-gray-800 text-lg leading-tight">
                  {att.name}
                </h4>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mt-0.5">
                  ID: {att.studentId}
                </p>
              </div>
              <StatusBadge status={att.status} />
            </div>

            <div className="bg-gray-50 p-3 rounded-xl mb-4 flex justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  Department
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {att.department}
                </p>
              </div>
              {att.form && (
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Class
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {att.form} {att.stream}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <ActionButtons
                currentStatus={att.status}
                studentObjId={att.rawStudentId}
                onStatusChange={handleStatusChange}
                isUpdating={updatingId === att.rawStudentId}
              />
            </div>
          </div>
        ))}

        {filteredAttendance.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400">No students found.</p>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <DataTable
          columns={columns}
          data={filteredAttendance}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Present: "bg-green-100 text-green-700 border-green-200",
    Absent: "bg-red-100 text-red-700 border-red-200",
    Sick: "bg-amber-100 text-amber-700 border-amber-200",
    Leave: "bg-blue-100 text-blue-700 border-blue-200",
    "Not Marked": "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-bold rounded-full border ${
        styles[status] || styles["Not Marked"]
      }`}
    >
      {status}
    </span>
  );
};

const ActionButtons = ({
  currentStatus,
  studentObjId,
  onStatusChange,
  isUpdating,
}) => {
  const statuses = [
    { label: "Present", color: "bg-green-600 hover:bg-green-700" },
    { label: "Absent", color: "bg-red-600 hover:bg-red-700" },
    { label: "Sick", color: "bg-amber-500 hover:bg-amber-600" },
    { label: "Leave", color: "bg-blue-600 hover:bg-blue-700" },
  ];

  if (isUpdating) {
    return (
      <span className="text-xs text-teal-600 font-bold animate-pulse">
        Saving...
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {statuses.map((btn) => {
        const isActive = currentStatus === btn.label;
        return (
          <button
            key={btn.label}
            onClick={() => onStatusChange(studentObjId, btn.label)}
            className={`px-2.5 py-1 text-xs font-bold text-white rounded-lg transition-all active:scale-95 ${
              btn.color
            } ${
              isActive
                ? "ring-2 ring-offset-1 ring-gray-800 scale-105"
                : "opacity-80 hover:opacity-100"
            }`}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
};

export default StudentAttendance;
