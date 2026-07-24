import React from "react";
import axios from "axios";

export const columns = [
  { name: "S.No", selector: (row) => row.sno, width: "80px" },
  { name: "Student ID", selector: (row) => row.studentId, sortable: true },
  { name: "Name", selector: (row) => row.name, sortable: true },
  { name: "Department", selector: (row) => row.department, sortable: true },
  { name: "Action", selector: (row) => row.action, center: true },
];

export const StudentAttendanceHelper = ({
  status,
  studentId,
  statusChange,
}) => {
  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.post(
        "https://ems-backend-hazel.vercel.app/api/student-attendance/update",
        {
          studentId,
          status: newStatus,
        },
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
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      <button
        onClick={() => handleStatusChange("Present")}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
          status === "Present"
            ? "bg-green-600 text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-green-100"
        }`}
      >
        Present
      </button>
      <button
        onClick={() => handleStatusChange("Absent")}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
          status === "Absent"
            ? "bg-red-600 text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-red-100"
        }`}
      >
        Absent
      </button>
      <button
        onClick={() => handleStatusChange("Sick")}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
          status === "Sick"
            ? "bg-yellow-500 text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-yellow-100"
        }`}
      >
        Sick
      </button>
    </div>
  );
};
