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
              <div className="flex items-center justify-center py-1">
                <img
                  width={40}
                  height={40}
                  className="rounded-full object-cover border-2 border-teal-100 shadow-sm"
                  src={emp.userId.profileImage}
                  alt={emp.userId.name}
                />
              </div>
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
      <div className="flex flex-col justify-center items-center h-[70vh] space-y-4">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-teal-600"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Fetching records...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0 md:p-6">
      {/* Header Card */}
      <div className="bg-white border-b md:border md:rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Employee Directory
          </h3>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Manage and view all registered staff members
          </p>
        </div>

        {/* Action Bar inside the card for a cohesive look */}
        <div className="px-6 pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by Name..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all shadow-sm"
              onChange={handleFilter}
            />
          </div>

          <Link
            to="/admin-dashboard/add-employee"
            className="w-full md:w-auto flex items-center justify-center px-8 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-white font-bold transition-all shadow-lg shadow-teal-100 active:scale-95"
          >
            <span className="mr-2 text-xl">+</span> Add New Employee
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white shadow-none md:shadow-lg md:rounded-xl overflow-hidden border-t md:border">
        <DataTable
          columns={columns}
          data={filteredEmployee}
          pagination
          responsive
          highlightOnHover
          customStyles={customTableStyles}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
        />
      </div>
    </div>
  );
};

// UI-First Table Styling
const customTableStyles = {
  header: {
    style: {
      display: "none", // We use our own header
    },
  },
  headRow: {
    style: {
      backgroundColor: "#f8fafc",
      borderTopWidth: "1px",
      borderColor: "#e2e8f0",
    },
  },
  headCells: {
    style: {
      color: "#64748b",
      fontSize: "0.75rem",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      paddingLeft: "24px",
      paddingRight: "24px",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      color: "#1e293b",
      fontWeight: "500",
      minHeight: "72px", // Larger rows for better touch interaction
      "&:not(:last-child)": {
        borderBottomStyle: "solid",
        borderBottomWidth: "1px",
        borderBottomColor: "#f1f5f9",
      },
    },
  },
  cells: {
    style: {
      paddingLeft: "24px",
      paddingRight: "24px",
    },
  },
  pagination: {
    style: {
      borderTopWidth: "1px",
      borderColor: "#f1f5f9",
      color: "#64748b",
      fontWeight: "600",
    },
  },
};

export default List;
