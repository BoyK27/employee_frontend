import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const columns = [
  { name: "S.No", selector: (row) => row.sno, width: "70px" },
  { name: "Image", selector: (row) => row.profileImage, width: "90px" },
  { name: "Student ID", selector: (row) => row.studentId, sortable: true },
  { name: "Name", selector: (row) => row.name, sortable: true },
  { name: "Department", selector: (row) => row.dep_name, sortable: true },
  { name: "DOB", selector: (row) => row.dob },
  { name: "Action", selector: (row) => row.action, center: true },
];

export const StudentButtons = ({ Id }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?",
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `https://ems-backend-hazel.vercel.app/api/student/${Id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        window.location.reload();
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate(`/admin-dashboard/students/${Id}`)}
        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold"
      >
        View
      </button>
      <button
        onClick={() => navigate(`/admin-dashboard/students/edit/${Id}`)}
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
      >
        Delete
      </button>
    </div>
  );
};
