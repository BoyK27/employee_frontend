import React from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import axios from "axios";

const DepartmentList = () => {
  const [departments, setDepartments] = React.useState([]);
  const [depLoading, setDepLoading] = React.useState(false);
  const [filteredDepartments, setFilteredDepartments] = React.useState([]);

  const fetchDepartments = async () => {
    setDepLoading(true);
    try {
      const response = await axios.get(
        "https://ems-backend-hazel.vercel.app/api/department",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        let sno = 1;
        const data = response.data.departments.map((dep) => ({
          _id: dep._id,
          sno: sno++,
          dep_name: dep.dep_name,
          action: (
            <DepartmentButtons
              DepId={dep._id}
              onDepartmentDelete={fetchDepartments} // Directly trigger refetch
            />
          ),
        }));
        setDepartments(data);
        setFilteredDepartments(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setDepLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDepartments();
  }, []);

  const filterDepartments = (e) => {
    const records = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFilteredDepartments(records);
  };

  // Professional Styling for the Data Table (Desktop)
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#f9fafb",
        fontWeight: "700",
        color: "#374151",
        fontSize: "14px",
      },
    },
    rows: {
      style: {
        minHeight: "60px",
        fontSize: "14px",
        color: "#4b5563",
      },
    },
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {depLoading ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-gray-500 font-medium">Loading Departments...</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
              Manage Departments
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Organize and monitor company branches
            </p>
          </div>

          {/* Search and Action Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search Department..."
                className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                onChange={filterDepartments}
              />
            </div>

            <Link
              to="/admin-dashboard/add-department"
              className="w-full md:w-auto text-center px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-100 active:scale-95"
            >
              + Add New Department
            </Link>
          </div>

          {/* --- MOBILE VIEW (Cards) --- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredDepartments.map((dep) => (
              <div
                key={dep._id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Department Name
                    </span>
                    <h4 className="text-lg font-bold text-gray-800 mt-1">
                      {dep.dep_name}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-md">
                    #{dep.sno}
                  </span>
                </div>

                {/* Buttons Only - No Labels */}
                <div className="border-t pt-4 flex justify-around">
                  {dep.action}
                </div>
              </div>
            ))}
            {filteredDepartments.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400">No departments found.</p>
              </div>
            )}
          </div>

          {/* --- DESKTOP VIEW (Table) --- */}
          <div className="hidden md:block bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
            <DataTable
              columns={columns}
              data={filteredDepartments}
              pagination
              responsive
              highlightOnHover
              customStyles={customStyles}
              noDataComponent={
                <div className="p-10 text-gray-400">No departments found.</div>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
