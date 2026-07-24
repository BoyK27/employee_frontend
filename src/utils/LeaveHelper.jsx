// src/utils/LeaveHelper.js

import { useNavigate } from "react-router-dom";

/* =========================================================
   1. EMPLOYEE LEAVE HELPER
   ========================================================= */

// Columns configuration for Employee Leaves Table
export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Emp ID",
    selector: (row) => row.employeeId,
    width: "120px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    width: "140px",
  },
  {
    name: "Leave Type",
    selector: (row) => row.leaveType,
    width: "140px",
  },
  {
    name: "Department",
    selector: (row) => row.department,
    width: "140px",
  },
  {
    name: "Days",
    selector: (row) => row.days,
    width: "80px",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    width: "120px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
  },
];

// View Button for Employee Leaves
export const LeaveButtons = ({ Id }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/admin-dashboard/leaves/${Id}`);
  };

  return (
    <button
      onClick={handleView}
      className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600 transition-colors"
    >
      View
    </button>
  );
};

/* =========================================================
   2. STUDENT LEAVE HELPER
   ========================================================= */

// Columns configuration for Student Leaves Table
export const studentColumns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Student ID",
    selector: (row) => row.studentId,
    width: "120px",
  },
  {
    name: "Student Name",
    selector: (row) => row.name,
    width: "150px",
  },
  {
    name: "Reason / Type",
    selector: (row) => row.leaveType,
    width: "140px",
  },
  {
    name: "Department / Class",
    selector: (row) => row.department,
    width: "160px",
  },
  {
    name: "Days",
    selector: (row) => row.days,
    width: "80px",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    width: "120px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
  },
];

// View Button for Student Leaves
export const StudentLeaveButtons = ({ Id }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/admin-dashboard/student-leaves/${Id}`);
  };

  return (
    <button
      onClick={handleView}
      className="px-4 py-1 bg-indigo-600 rounded text-white hover:bg-indigo-700 transition-colors"
    >
      View
    </button>
  );
};
