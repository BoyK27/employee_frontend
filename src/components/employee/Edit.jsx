import { fetchDepartments } from "../../utils/EmployeeHelper";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ems-backend-hazel.vercel.app";

const Edit = () => {
  const [employee, setEmployee] = useState({
    name: "",
    maritalStatus: "",
    designation: "",
    salary: 0,
    department: "",
  });
  const [departments, setDepartments] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const deps = await fetchDepartments();
        setDepartments(deps || []);

        const classRes = await axios.get(`${API_BASE_URL}/api/class`, {
          headers,
        });
        if (classRes.data.success) setClassesList(classRes.data.classes || []);

        const subjectRes = await axios.get(`${API_BASE_URL}/api/subject`, {
          headers,
        });
        if (subjectRes.data.success)
          setSubjectsList(subjectRes.data.subjects || []);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          const emp = response.data.employee;
          setEmployee({
            name: emp.userId?.name || "",
            maritalStatus: emp.maritalStatus || "",
            designation: emp.designation || "",
            salary: emp.salary || 0,
            department: emp.department?._id || emp.department || "",
          });

          if (emp.classes) {
            setSelectedClasses(
              emp.classes.map((cls) =>
                typeof cls === "object" ? cls._id : cls,
              ),
            );
          }
          if (emp.subjects) {
            setSelectedSubjects(
              emp.subjects.map((sbj) =>
                typeof sbj === "object" ? sbj._id : sbj,
              ),
            );
          }
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.error || "Failed to load employee details";
        alert(errorMsg);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((preData) => ({ ...preData, [name]: value }));
  };

  const handleClassToggle = (classId) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId],
    );
  };

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...employee,
      classes: selectedClasses,
      subjects: selectedSubjects,
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/employee/${id}`,
        payload,
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
      const errorMsg =
        error.response?.data?.error || "Something went wrong updating employee";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-0 md:p-4">
      {departments && employee ? (
        <div className="w-full max-w-2xl bg-white shadow-none md:shadow-lg md:rounded-lg overflow-hidden my-6">
          <div className="bg-teal-600 p-6 text-white text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold">
              Edit Employee Details
            </h2>
            <p className="text-teal-100 text-sm">
              Update assigned classes and subjects below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
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

              {/* Marital Status */}
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
                  <option value="married">Married</option>
                  <option value="single">Single</option>
                </select>
              </div>

              {/* Designation */}
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

              {/* Salary */}
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

              {/* Department */}
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

              {/* ASSIGN CLASSES */}
              <div className="col-span-1 md:col-span-2 border-t pt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                  Assigned Classes
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 border border-gray-300 rounded-lg bg-gray-50">
                  {classesList.map((cls) => (
                    <label
                      key={cls._id}
                      className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(cls._id)}
                        onChange={() => handleClassToggle(cls._id)}
                        className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                      <span>
                        {cls.className} ({cls.code || cls.classCode || ""})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ASSIGN SUBJECTS */}
              <div className="col-span-1 md:col-span-2 border-t pt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                  Assigned Subjects
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 border border-gray-300 rounded-lg bg-gray-50">
                  {subjectsList.map((subj) => (
                    <label
                      key={subj._id}
                      className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subj._id)}
                        onChange={() => handleSubjectToggle(subj._id)}
                        className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                      <span>
                        {subj.subjectName} ({subj.subjectCode})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

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
