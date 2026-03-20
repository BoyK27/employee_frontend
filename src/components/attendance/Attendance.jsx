import React from "react";
import { Link } from "react-router-dom";
import { columns, AttendanceHelper } from "../../utils/AttendanceHelper";
import DataTable from "react-data-table-component";
import axios from "axios";

const Attendance = () => {
  const [attendance, setAttendance] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filteredAttendance, setFilteredAttendance] = React.useState([]);

  const statusChange = () => {
    fetchAttendance();
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://ems-backend-hazel.vercel.app/api/attendance",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        let sno = 1;
        const data = response.data.attendance
          .filter((att) => att.employeeId)
          .map((att) => ({
            _id: att._id,
            sno: sno++,
            employeeId: att.employeeId.employeeId,
            name: att.employeeId.userId?.name || "N/A",
            department: att.employeeId.department?.dep_name || "N/A",
            status: att.status, // Keeping status for the card view
            action: (
              <AttendanceHelper
                status={att.status}
                employeeId={att.employeeId._id}
                statusChange={statusChange}
              />
            ),
          }));

        setAttendance(data);
        setFilteredAttendance(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchAttendance();
    }
  }, []);

  const handleFilter = (e) => {
    const records = attendance.filter((emp) =>
      emp.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFilteredAttendance(records);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Loading attendance...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
          Manage Attendance
        </h3>
        <div className="mt-2 inline-block bg-teal-50 px-4 py-1 rounded-full border border-teal-100">
          <p className="text-teal-700 font-semibold text-sm">
            Marking for: {new Date().toISOString().split("T")[0]}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search Employee name..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
            onChange={handleFilter}
          />
        </div>

        <Link
          to="/admin-dashboard/attendance-report"
          className="w-full md:w-auto text-center px-6 py-3 bg-gray-800 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
        >
          View Full Report
        </Link>
      </div>

      {/* --- MOBILE VIEW (Cards) --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredAttendance.map((att) => (
          <div
            key={att._id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-gray-800 text-lg leading-tight">
                  {att.name}
                </h4>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mt-0.5">
                  ID: {att.employeeId}
                </p>
              </div>
              <span className="text-xs font-bold text-gray-300">
                #{att.sno}
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl mb-4">
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Department
              </p>
              <p className="text-sm font-semibold text-gray-700">
                {att.department}
              </p>
            </div>

            {/* Attendance Status Selection */}
            <div className="border-t pt-4 flex justify-center">
              <div className="w-full">{att.action}</div>
            </div>
          </div>
        ))}
        {filteredAttendance.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400">No employees found.</p>
          </div>
        )}
      </div>

      {/* --- DESKTOP VIEW (Table) --- */}
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

export default Attendance;
