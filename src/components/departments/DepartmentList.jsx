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
      const response = await axios.get("http://localhost:5000/api/department", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

  // Professional Styling for the Data Table
  const customStyles = {
    rows: {
      style: {
        minHeight: "55px", // slightly taller for easier touch on mobile
      },
    },
    headCells: {
      style: {
        backgroundColor: "#f3f4f6",
        fontWeight: "bold",
        color: "#1f2937",
      },
    },
  };

  return (
    <div className="p-3 md:p-6">
      {depLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">
              Manage Departments
            </h3>
          </div>

          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Search Field */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search Department..."
                  className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                  onChange={filterDepartments}
                />
              </div>

              {/* Add Button */}
              <Link
                to="/admin-dashboard/add-department"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all shadow-sm active:scale-95 text-sm"
              >
                + Add New Department
              </Link>
            </div>

            {/* Table Wrapper */}
            <div className="mt-6 border rounded-lg overflow-hidden shadow-inner">
              <DataTable
                columns={columns}
                data={filteredDepartments}
                pagination
                responsive
                highlightOnHover
                customStyles={customStyles}
                noDataComponent={
                  <div className="p-10 text-gray-400">
                    No departments found.
                  </div>
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
