// src/utils/LeaveHelper.js

import { useNavigate } from "react-router-dom";

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
    width: "120px",
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

// This is the corrected, final version of the button component.
export const LeaveButtons = ({ Id }) => {
  const navigate = useNavigate();

  const handleView = () => {
    // Use the 'Id' prop that is passed to the component.
    navigate(`/admin-dashboard/leaves/${Id}`);
  };

  return (
    <button
      onClick={handleView}
      className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600"
    >
      View
    </button>
  );
};
