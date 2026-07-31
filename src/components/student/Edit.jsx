import React, { useState, useEffect } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ems-backend-hazel.vercel.app";

const EditStudent = () => {
  const [student, setStudent] = useState({
    name: "",
    studentId: "",
    classId: "",
    stream: "",
    department: "",
  });
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [deps, classRes] = await Promise.all([
          fetchDepartments(),
          axios.get(`${API_BASE_URL}/api/class`, { headers }),
        ]);

        setDepartments(deps || []);
        if (classRes.data.success) {
          setClasses(classRes.data.classes || []);
        }
      } catch (error) {
        console.error("Error fetching dropdowns:", error);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/student/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          const studentData = response.data.student;
          setStudent({
            name: studentData.userId?.name || studentData.name || "",
            studentId: studentData.studentId || studentData.matricule || "",
            classId:
              studentData.classId?._id ||
              studentData.classId ||
              studentData.class ||
              "",
            stream: studentData.stream || "",
            department:
              studentData.department?._id || studentData.department || "",
          });
        }
      } catch (error) {
        alert(error.response?.data?.error || "Error fetching student details.");
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/student/${id}`,
        student,
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
      alert(
        error.response?.data?.error ||
          "Something went wrong updating student details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-0 md:p-4">
      {departments && student ? (
        <div className="w-full max-w-2xl bg-white shadow-none md:shadow-lg md:rounded-lg overflow-hidden mt-0 md:mt-6">
          <div className="bg-teal-600 p-6 text-white text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold">
              Edit Student Details
            </h2>
            <p className="text-teal-100 text-sm">
              Update student class, stream, and department assignment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={student.name}
                  onChange={handleChange}
                  placeholder="Insert Name"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Student ID */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Matricule / Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={student.studentId}
                  onChange={handleChange}
                  placeholder="e.g. STU2026-001"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Dynamic Class Selector */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Assigned Class
                </label>
                <select
                  name="classId"
                  onChange={handleChange}
                  value={student.classId}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.className}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stream / Arm */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Class Arm / Stream
                </label>
                <select
                  name="stream"
                  onChange={handleChange}
                  value={student.stream}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                >
                  <option value="">Select Stream / Arm</option>
                  <option value="Branch A">Branch A</option>
                  <option value="Branch B">Branch B</option>
                  <option value="Branch C">Branch C</option>
                  <option value="Arts">Arts</option>
                  <option value="Science">Science</option>
                </select>
              </div>

              {/* Department */}
              <div className="col-span-1 md:col-span-2 flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Department / Faculty
                </label>
                <select
                  name="department"
                  onChange={handleChange}
                  value={student.department}
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

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-bold py-4 px-4 rounded-xl shadow-md transition-transform active:scale-95 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {loading ? "Saving Updates..." : "Confirm Student Updates"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading student details...
          </p>
        </div>
      )}
    </div>
  );
};

export default EditStudent;
