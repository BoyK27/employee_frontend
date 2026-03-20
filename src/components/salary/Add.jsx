import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [salary, setSalary] = React.useState({
    employeeId: "", // Use empty string instead of null for select inputs
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: "",
  });
  const [departments, setDepartments] = React.useState(null);
  const [employees, setEmployees] = React.useState([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    const getDepartmentsData = async () => {
      const deps = await fetchDepartments();
      setDepartments(deps);
    };
    getDepartmentsData();
  }, []);

  const handleDepartment = async (e) => {
    const depId = e.target.value;
    if (depId) {
      const emps = await getEmployees(depId);
      setEmployees(emps);
    } else {
      setEmployees([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure numeric fields are stored as numbers, not strings
    setSalary((preData) => ({
      ...preData,
      [name]:
        name === "basicSalary" || name === "allowances" || name === "deductions"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://ems-backend-hazel.vercel.app/api/salary/add",
        salary,
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
    <>
      {departments ? (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-extrabold mb-8 text-center text-gray-800">
            Add Employee Salary
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  onChange={handleDepartment}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
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

              {/* Employee */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Employee
                </label>
                <select
                  name="employeeId"
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.employeeId} - {emp.userId?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Basic Salary
                </label>
                <input
                  type="number" // Fixed typo from 'numbers'
                  name="basicSalary"
                  onChange={handleChange}
                  placeholder="Enter Amount"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              {/* Allowances */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Allowances
                </label>
                <input
                  type="number"
                  name="allowances"
                  onChange={handleChange}
                  placeholder="Enter Allowances"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              {/* Deductions */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Deductions
                </label>
                <input
                  type="number"
                  name="deductions"
                  onChange={handleChange}
                  placeholder="Enter Deductions"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>

              {/* Pay Date */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Pay Date
                </label>
                <input
                  type="date"
                  name="payDate"
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition-all"
            >
              Confirm Salary Entry
            </button>
          </form>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen text-teal-600 font-bold italic">
          Loading Department Data...
        </div>
      )}
    </>
  );
};

export default Add;
