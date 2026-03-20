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
  };
  return (
    <div>
      {status == null ? (
        <div className="flex space-x-8">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={() => markEmployee("present", employeeId)}
          >
            Present
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={() => markEmployee("absent", employeeId)}
          >
            Absent
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
            onClick={() => markEmployee("sick", employeeId)}
          >
            Sick
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-md"
            onClick={() => markEmployee("leave", employeeId)}
          >
            Leave
          </button>
        </div>
      ) : (
        <p className="bg-gray-100 w-20 text-center py2 rounded">{status}</p>
      )}
    </div>
  );
};

return (
  <div>
    {/* Use !status to catch null, undefined, or empty strings */}
    {!status || status === "Not Marked" ? (
      <div className="flex space-x-2">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
          onClick={() => markEmployee("present", employeeId)}
        >
          Present
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
          onClick={() => markEmployee("absent", employeeId)}
        >
          Absent
        </button>
        {/* Add other buttons if needed */}
      </div>
    ) : (
      <span className="capitalize font-semibold text-teal-600 border border-teal-200 px-3 py-1 rounded-full bg-teal-50">
        {status}
      </span>
    )}
  </div>
);

export { AttendanceHelper };
