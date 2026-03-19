import { fetchDepartments } from "../../utils/EmployeeHelper";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Optional: If you use Lucide icons
import { Eye, EyeOff } from "lucide-react";

const Add = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for eye icon
  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const deps = await fetchDepartments();
      setDepartments(deps);
    };
    getDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "https://ems-backend-hazel.vercel.app/api/employee/add",
        formDataObj,
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
      console.error(error);
      const errorMsg = error.response?.data?.error || "Something went wrong";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-10 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 tracking-tight">
        Add New Employee
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <FormInput
            label="Full Name"
            name="name"
            type="text"
            onChange={handleChange}
            placeholder="Insert Name"
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Insert E-mail"
            required
          />
          <FormInput
            label="Employee ID"
            name="employeeId"
            type="text"
            onChange={handleChange}
            placeholder="ID Number"
            required
          />
          <FormInput
            label="Date of Birth"
            name="dob"
            type="date"
            onChange={handleChange}
            required
          />

          <FormSelect
            label="Gender"
            name="gender"
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </FormSelect>

          <FormSelect
            label="Marital Status"
            name="maritalStatus"
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="married">Married</option>
            <option value="single">Single</option>
          </FormSelect>

          <FormInput
            label="Designation"
            name="designation"
            type="text"
            onChange={handleChange}
            placeholder="e.g. Developer"
            required
          />

          <FormSelect
            label="Department"
            name="department"
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.dep_name}
              </option>
            ))}
          </FormSelect>

          <FormInput
            label="Salary"
            name="salary"
            type="number"
            onChange={handleChange}
            placeholder="0.00"
            required
          />

          {/* PASSWORD FIELD WITH EYE ICON */}
          <div className="relative">
            <FormInput
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"} // Dynamic type
              onChange={handleChange}
              placeholder="*******"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-teal-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <FormSelect label="Role" name="role" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </FormSelect>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Upload Profile Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-lg bg-gray-50 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-10 py-3 rounded-xl font-bold text-white shadow-md transition-all active:scale-95 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          {loading ? "Processing..." : "Register Employee"}
        </button>
      </form>
    </div>
  );
};

// Reusable components
const FormInput = ({ label, ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-gray-600 mb-1 ml-1">
      {label}
    </label>
    <input
      {...props}
      className="mt-1 p-2.5 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 focus:bg-white transition-all"
    />
  </div>
);

const FormSelect = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-600 mb-1 ml-1">
      {label}
    </label>
    <select
      {...props}
      className="mt-1 p-2.5 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 focus:bg-white transition-all"
    >
      {children}
    </select>
  </div>
);

export default Add;
