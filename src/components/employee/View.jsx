import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ems-backend-hazel.vercel.app";

const View = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        } else {
          console.error("Error fetching employee details:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="mt-20 flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading details...</p>
      </div>
    );
  }

  return (
    <>
      {employee ? (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Employee Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center">
              <img
                src={employee.userId?.profileImage || "/default-avatar.png"}
                alt={employee.userId?.name || "Employee"}
                className="rounded-full border-2 border-teal-500 w-64 h-64 object-cover shadow-sm"
              />
            </div>
            <div className="space-y-4">
              <div className="flex space-x-3 border-b pb-2">
                <p className="text-base font-bold text-gray-600">Name:</p>
                <p className="font-semibold text-gray-800">
                  {employee.userId?.name || "N/A"}
                </p>
              </div>

              <div className="flex space-x-3 border-b pb-2">
                <p className="text-base font-bold text-gray-600">
                  Employee ID:
                </p>
                <p className="font-semibold text-gray-800">
                  {employee.employeeId || employee.employeeID || "N/A"}
                </p>
              </div>

              <div className="flex space-x-3 border-b pb-2">
                <p className="text-base font-bold text-gray-600">
                  Date of Birth:
                </p>
                <p className="font-semibold text-gray-800">
                  {employee.dob ? new Date(employee.dob).toDateString() : "N/A"}
                </p>
              </div>

              <div className="flex space-x-3 border-b pb-2">
                <p className="text-base font-bold text-gray-600">Gender:</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {employee.gender || "N/A"}
                </p>
              </div>

              <div className="flex space-x-3 border-b pb-2">
                <p className="text-base font-bold text-gray-600">Department:</p>
                <p className="font-semibold text-gray-800">
                  {employee.department?.dep_name || "N/A"}
                </p>
              </div>

              <div className="flex space-x-3 border-b pb-2">
                <p className="text-base font-bold text-gray-600">
                  Marital Status:
                </p>
                <p className="font-semibold text-gray-800 capitalize">
                  {employee.maritalStatus || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-500">
          No employee details found.
        </div>
      )}
    </>
  );
};

export default View;
