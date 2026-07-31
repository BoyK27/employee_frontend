import React, { useState, useEffect } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ems-backend-hazel.vercel.app";

const AddStudent = () => {
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]); // 🚀 Dynamic Class State
  const [formData, setFormData] = useState({
    role: "student",
    classId: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Departments & Classes in parallel
        const [deps, classRes] = await Promise.all([
          fetchDepartments(),
          axios.get(`${API_BASE_URL}/api/class`, { headers }),
        ]);

        setDepartments(deps || []);
        if (classRes.data.success) {
          setClasses(classRes.data.classes || []);
        }
      } catch (error) {
        console.error("Error loading form dropdowns:", error);
      }
    };
    fetchInitialData();
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
        `${API_BASE_URL}/api/student/add`,
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        navigate("/admin-dashboard/students");
      }
    } catch (error) {
      console.error("Add Student Error:", error);
      const errorMsg =
        error.response?.data?.error ||
        "Something went wrong registering student";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 md:mt-10 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 tracking-tight">
        Register New Student
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <FormInput
            label="Full Name"
            name="name"
            type="text"
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="student@school.edu"
            required
          />
          <FormInput
            label="Matricule / Student ID"
            name="studentId"
            type="text"
            onChange={handleChange}
            placeholder="e.g. STU2026-001"
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

          {/* DYNAMIC CLASS SELECTION */}
          <FormSelect
            label="Assigned Class"
            name="classId"
            onChange={handleChange}
            required
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className}
              </option>
            ))}
          </FormSelect>

          {/* STREAM / BRANCH SELECTION */}
          <FormSelect
            label="Class Arm / Stream"
            name="stream"
            onChange={handleChange}
          >
            <option value="">Select Stream / Arm (Optional)</option>
            <option value="Branch A">Branch A</option>
            <option value="Branch B">Branch B</option>
            <option value="Branch C">Branch C</option>
            <option value="Arts">Arts</option>
            <option value="Science">Science</option>
          </FormSelect>

          <FormSelect
            label="Department / Faculty"
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

          {/* PASSWORD FIELD */}
          <div className="relative">
            <FormInput
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
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

          <FormSelect
            label="Role"
            name="role"
            value={formData.role || "student"}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
          </FormSelect>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-1 ml-1">
              Upload Student Photo
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
          {loading ? "Processing..." : "Register Student"}
        </button>
      </form>
    </div>
  );
};

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

export default AddStudent;
