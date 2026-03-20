import { fetchDepartments } from "../../utils/EmployeeHelper";
import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Edit = () => {
  const [employee, setEmployee] = React.useState({
    name: "",
    maritalStatus: "",
    designation: "",
    salary: 0,
    departments: "", // Preserved typo
  });
  const [departments, setDepartments] = React.useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  React.useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `https://ems-backend-hazel.vercel.app/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          const employee = response.data.employee;
          setEmployee((prev) => ({
            ...prev,
            name: employee.userId.name,
            maritalStatus: employee.maritalStatus,
            designation: employee.designation,
            salary: employee.salary,
            department: employee.department,
          }));
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };
    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployee((preData) => ({ ...preData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://ems-backend-hazel.vercel.app/api/employee/${id}`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert("Something Went wrong. Please try again");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-0 md:p-4">
      {departments && employee ? (
        <div className="w-full max-w-2xl bg-white shadow-none md:shadow-lg md:rounded-lg overflow-hidden">
          {/* Mobile-Friendly Header */}
          <div className="bg-teal-600 p-6 text-white text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold">
              Edit Employee Details
            </h2>
            <p className="text-teal-100 text-sm">
              Update the information below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/*Name*/}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={employee.name}
                  onChange={handleChange}
                  placeholder="Insert Name"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                />
              </div>

              {/*Marital Status*/}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Marital Status
                </label>
                <select
                  name="maritalStatus"
                  onChange={handleChange}
                  value={employee.maritalStatus}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="maried">Maried</option>
                  <option value="single">Single</option>
                </select>
              </div>

              {/*Designation*/}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  onChange={handleChange}
                  value={employee.designation}
                  placeholder="Designation"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                />
              </div>

              {/*Salary*/}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  onChange={handleChange}
                  value={employee.salary}
                  placeholder="salary"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                />
              </div>

              {/*Department*/}
              <div className="col-span-1 md:col-span-2 flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Department
                </label>
                <select
                  name="department"
                  onChange={handleChange}
                  value={employee.department}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep._id} value={dep._id}>
                      {dep.dep_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button - Full width on mobile */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-transform active:scale-95"
              >
                Confirm Edited Employee
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading details...</p>
        </div>
      )}
    </div>
  );
};

export default Edit;
