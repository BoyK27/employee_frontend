import React, { useState, useEffect } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditStudent = () => {
  const [student, setStudent] = useState({
    name: "",
    matricule: "",
    level: "",
    program: "",
    department: "",
  });
  const [departments, setDepartments] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getDepartments = async () => {
      const deps = await fetchDepartments();
      setDepartments(deps);
    };
    getDepartments();
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `https://ems-backend-hazel.vercel.app/api/student/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          const studentData = response.data.student;
          setStudent({
            name: studentData.userId?.name || studentData.name || "",
            matricule: studentData.matricule || studentData.studentId || "",
            level: studentData.level || "",
            program: studentData.program || "",
            department:
              studentData.department?._id || studentData.department || "",
          });
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        } else {
          alert("Error fetching student details.");
        }
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

    try {
      const response = await axios.put(
        `https://ems-backend-hazel.vercel.app/api/student/${id}`,
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
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-0 md:p-4">
      {departments && student ? (
        <div className="w-full max-w-2xl bg-white shadow-none md:shadow-lg md:rounded-lg overflow-hidden mt-0 md:mt-6">
          {/* Header */}
          <div className="bg-teal-600 p-6 text-white text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold">
              Edit Student Details
            </h2>
            <p className="text-teal-100 text-sm">
              Update academic profile and enrollment information
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

              {/* Matricule / Student ID */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Matricule / Student ID
                </label>
                <input
                  type="text"
                  name="matricule"
                  value={student.matricule}
                  onChange={handleChange}
                  placeholder="e.g. SE2026-001"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Academic Level */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Academic Level
                </label>
                <select
                  name="level"
                  onChange={handleChange}
                  value={student.level}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                >
                  <option value="">Select Level</option>
                  <option value="100">Level 100 (HND 1 / Year 1)</option>
                  <option value="200">Level 200 (HND 2 / Year 2)</option>
                  <option value="300">Level 300 (Degree / Year 3)</option>
                  <option value="400">Level 400 (Master / Year 4)</option>
                </select>
              </div>

              {/* Program / Specialization */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                  Specialization / Program
                </label>
                <input
                  type="text"
                  name="program"
                  onChange={handleChange}
                  value={student.program}
                  placeholder="e.g. Software Engineering"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  required
                />
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
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-transform active:scale-95"
              >
                Confirm Student Updates
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
