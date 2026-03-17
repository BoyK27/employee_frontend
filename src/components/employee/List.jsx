import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columns, EmployeeButtons } from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";
import axios from "axios";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployee] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get(
          "https://ems-backend-hazel.vercel.app/api/employee",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department.dep_name,
            name: emp.userId.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: (
              <img
                width={35}
                height={35}
                className="rounded-full object-cover border"
                src={`http://localhost:5000/${emp.userId.profileImage}`}
                alt={emp.userId.name}
              />
            ),
            action: <EmployeeButtons DepId={emp._id} />,
          }));
          setEmployees(data);
          setFilteredEmployee(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFilteredEmployee(records);
  };

  if (empLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">
          Manage Students / Employees
        </h3>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name..."
          className="w-full md:w-72 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="w-full md:w-auto text-center px-6 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white font-semibold transition-all shadow-md active:scale-95"
        >
          + Add New
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={filteredEmployee}
          pagination
          responsive
          highlightOnHover
          customStyles={customTableStyles}
        />
      </div>
    </div>
  );
};

// Professional Table Styling
const customTableStyles = {
  headCells: {
    style: {
      backgroundColor: "#f9fafb",
      color: "#374151",
      fontSize: "14px",
      fontWeight: "700",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      color: "#4b5563",
    },
  },
};

export default List;
