import axios from "axios";
import React from "react";

/* =========================================================
   1. EMPLOYEE ATTENDANCE HELPER & COLUMNS
   ========================================================= */

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Employee ID",
    selector: (row) => row.employeeId,
    sortable: true,
    width: "120px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "170px",
  },
  {
    name: "Department",
    selector: (row) => row.department,
    width: "150px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
  },
];

export const AttendanceHelper = ({ status, employeeId, statusChange }) => {
  const markEmployee = async (status, employeeId) => {
    try {
      const response = await axios.put(
        `https://ems-backend-hazel.vercel.app/api/attendance/update/${employeeId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        statusChange();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error updating attendance");
    }
  };

  return (
    <div>
      {!status || status === "Not Marked" ? (
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markEmployee("Present", employeeId)}
          >
            Present
          </button>
          <button
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markEmployee("Absent", employeeId)}
          >
            Absent
          </button>
          <button
            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markEmployee("Sick", employeeId)}
          >
            Sick
          </button>
          <button
            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markEmployee("Leave", employeeId)}
          >
            Leave
          </button>
        </div>
      ) : (
        <span className="capitalize font-semibold text-teal-600 border border-teal-200 px-3 py-1 rounded-full bg-teal-50">
          {status}
        </span>
      )}
    </div>
  );
};

/* =========================================================
   2. STUDENT ATTENDANCE HELPER & COLUMNS
   ========================================================= */

export const studentColumns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Student ID",
    selector: (row) => row.studentId,
    sortable: true,
    width: "130px",
  },
  {
    name: "Student Name",
    selector: (row) => row.name,
    sortable: true,
    width: "170px",
  },
  {
    name: "Department / Class",
    selector: (row) => row.department,
    width: "170px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
  },
];

export const StudentAttendanceHelper = ({
  status,
  studentId,
  statusChange,
}) => {
  const markStudent = async (status, studentId) => {
    try {
      const response = await axios.put(
        `https://ems-backend-hazel.vercel.app/api/attendance/student/update/${studentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        statusChange();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error updating student attendance");
    }
  };

  return (
    <div>
      {!status || status === "Not Marked" ? (
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markStudent("Present", studentId)}
          >
            Present
          </button>
          <button
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markStudent("Absent", studentId)}
          >
            Absent
          </button>
          <button
            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markStudent("Sick", studentId)}
          >
            Sick
          </button>
          <button
            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markStudent("Leave", studentId)}
          >
            Leave
          </button>
        </div>
      ) : (
        <span className="capitalize font-semibold text-indigo-600 border border-indigo-200 px-3 py-1 rounded-full bg-indigo-50">
          {status}
        </span>
      )}
    </div>
  );
};
