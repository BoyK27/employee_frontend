import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columns, StudentButtons } from "../../utils/StudentHelper";
import DataTable from "react-data-table-component";
import axios from "axios";

const List = () => {
  const [students, setStudents] = useState([]);
  const [stdLoading, setStdLoading] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      setStdLoading(true);
      try {
        const response = await axios.get(
          "https://ems-backend-hazel.vercel.app/api/student",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          let sno = 1;
          const data = response.data.students.map((std) => ({
            _id: std._id,
            sno: sno++,
            studentId: std.studentId,
            dep_name: std.department?.dep_name || "N/A",
            name: std.userId?.name || "N/A",
            dob: std.dob ? new Date(std.dob).toLocaleDateString() : "N/A",
            profileImage: (
              <img
                width={35}
                height={35}
                className="rounded-full object-cover border"
                src={std.userId?.profileImage || "/avatar.png"}
                alt={std.userId?.name}
              />
            ),
            // rawImage preserved for mobile card styling
            rawImage: std.userId?.profileImage || "/avatar.png",
            action: <StudentButtons Id={std._id} />,
          }));
          setStudents(data);
          setFilteredStudents(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setStdLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleFilter = (e) => {
    const records = students.filter(
      (std) =>
        std.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        std.studentId.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFilteredStudents(records);
  };

  if (stdLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Manage Students</h3>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name or ID..."
          className="w-full md:w-72 px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/students/add"
          className="w-full md:w-auto text-center px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-white font-bold transition-all shadow-md active:scale-95"
        >
          + Add New Student
        </Link>
      </div>

      {/* --- MOBILE VIEW (Cards) --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredStudents.map((std) => (
          <div
            key={std._id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={std.rawImage}
                className="w-14 h-14 rounded-full border-2 border-teal-500 p-0.5 object-cover"
                alt={std.name}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800 text-lg leading-tight">
                    {std.name}
                  </h4>
                  <span className="text-xs font-bold text-gray-300">
                    #{std.sno}
                  </span>
                </div>
                <p className="text-xs font-bold text-teal-600 uppercase mt-0.5">
                  ID: {std.studentId}
                </p>
                <p className="text-gray-500 text-sm">{std.dep_name}</p>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="border-t pt-4 flex justify-around">
              {std.action}
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400">No student found.</p>
          </div>
        )}
      </div>

      {/* --- DESKTOP VIEW (Table) --- */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden border">
        <DataTable
          columns={columns}
          data={filteredStudents}
          pagination
          highlightOnHover
          customStyles={customTableStyles}
        />
      </div>
    </div>
  );
};

// Professional Table Styling for Desktop
const customTableStyles = {
  headCells: {
    style: {
      backgroundColor: "#f9fafb",
      color: "#374151",
      fontSize: "14px",
      fontWeight: "700",
      padding: "20px",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      color: "#4b5563",
      padding: "10px",
    },
  },
};

export default List;
