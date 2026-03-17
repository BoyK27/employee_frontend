import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columns, AttendanceHelper } from "../../utils/AttendanceHelper";
import DataTable from "react-data-table-component";
import axios from "axios";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredAttendance, setFilteredAttendance] = useState([]);

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
        const data = response.data.attendance.map((att) => ({
          employeeId: att.employeeId.employeeId,
          sno: sno++,
          department: att.employeeId.department.dep_name,
          name: att.employeeId.userId.name,
          action: (
            <AttendanceHelper
              status={att.status}
              employeeId={att.employeeId.employeeId}
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

  useEffect(() => {
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">
          Manage Attendance
        </h3>
        <p className="text-sm md:text-base font-semibold text-teal-700 mt-1">
          Marking for: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Employee..."
          className="w-full md:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          onChange={handleFilter}
        />

        <Link
          to="/admin-dashboard/attendance-report"
          className="w-full md:w-auto text-center px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white font-medium transition-colors"
        >
          View Attendance Report
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredAttendance}
          pagination
          responsive
          highlightOnHover
          customStyles={{
            table: {
              style: {
                minHeight: "400px",
              },
            },
            rows: {
              style: {
                fontSize: "14px",
              },
            },
            headCells: {
              style: {
                backgroundColor: "#f3f4f6",
                fontWeight: "bold",
                fontSize: "14px",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Attendance;
