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
    // Matches 'employeeId' from our transformedData map
    selector: (row) => row.employeeId,
    width: "120px",
    sortable: true,
  },
  {
    name: "Name",
    // Matches 'name' from our transformedData map
    selector: (row) => row.name,
    width: "150px",
    sortable: true,
  },
  {
    name: "Leave Type",
    selector: (row) => row.leaveType,
    width: "140px",
  },
  {
    name: "Department",
    // Matches 'department' from our transformedData map
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
    // Optional: Add custom styling for the status directly in the column
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
  },
];

export const LeaveButtons = ({ Id }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/admin-dashboard/leaves/${Id}`);
  };

  return (
    <button
      onClick={handleView}
      className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-all shadow-sm"
    >
      View
    </button>
  );
};
