import axios from "axios";
import React from "react";

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
    center: "true",
  },
];

const AttendanceHelper = ({ status, employeeId, statusChange }) => {
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
      alert("Error updating attendance");
    }
  };

  // This return block must be INSIDE the AttendanceHelper function
  return (
    <div>
      {!status || status === "Not Marked" ? (
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markEmployee("present", employeeId)}
          >
            Present
          </button>
          <button
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markEmployee("absent", employeeId)}
          >
            Absent
          </button>
          <button
            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markEmployee("sick", employeeId)}
          >
            Sick
          </button>
          <button
            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm transition-colors"
            onClick={() => markEmployee("leave", employeeId)}
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

export { AttendanceHelper };
