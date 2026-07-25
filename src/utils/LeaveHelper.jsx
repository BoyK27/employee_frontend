import React from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   1. EMPLOYEE LEAVE HELPER
   ========================================================= */

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

export const LeaveButtons = ({ Id, _id }) => {
  const navigate = useNavigate();
  // Support both uppercase 'Id' and lowercase '_id' props
  const leaveId = Id || _id;

  const handleView = () => {
    if (!leaveId) {
      console.error("LeaveButtons: Missing leave ID!");
      return;
    }
    navigate(`/admin-dashboard/leaves/${leaveId}`);
  };

  return (
    <button
      onClick={handleView}
      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
    >
      View
    </button>
  );
};

/* =========================================================
   2. STUDENT LEAVE HELPER
   ========================================================= */

export const studentColumns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Matricule",
    selector: (row) => row.matricule,
    width: "130px",
  },
  {
    name: "Student Name",
    selector: (row) => row.name,
    width: "160px",
  },
  {
    name: "Category",
    selector: (row) => row.leaveType,
    width: "140px",
  },
  {
    name: "Department",
    selector: (row) => row.department,
    width: "150px",
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

export const StudentLeaveButtons = ({ Id, _id }) => {
  const navigate = useNavigate();
  const leaveId = Id || _id;

  const handleView = () => {
    if (!leaveId) {
      console.error("StudentLeaveButtons: Missing leave ID!");
      return;
    }
    navigate(`/admin-dashboard/student-leaves/${leaveId}`);
  };

  return (
    <button
      onClick={handleView}
      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
    >
      View
    </button>
  );
};
