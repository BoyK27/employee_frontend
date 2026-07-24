import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewStudent = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

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
          setStudent(response.data.student);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        } else {
          alert("Error retrieving student details.");
        }
      }
    };
    fetchStudent();
  }, [id]);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {student ? (
        <div className="max-w-3xl mx-auto mt-6 md:mt-10 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 tracking-tight">
            Student Profile Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Profile Image Column */}
            <div className="flex justify-center">
              <img
                src={
                  student.userId?.profileImage ||
                  student.profileImage ||
                  "/default-avatar.png"
                }
                alt={student.userId?.name || "Student"}
                className="rounded-full border-4 border-teal-500 w-56 h-56 md:w-64 md:h-64 object-cover shadow-md"
              />
            </div>

            {/* Profile Information Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
                <p className="text-sm font-bold text-gray-500 uppercase w-36">
                  Full Name:
                </p>
                <p className="font-semibold text-gray-800 text-lg">
                  {student.userId?.name || student.name || "N/A"}
                </p>
              </div>

              <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
                <p className="text-sm font-bold text-gray-500 uppercase w-36">
                  Matricule:
                </p>
                <p className="font-bold text-teal-600 text-base">
                  {student.matricule || student.studentId || "N/A"}
                </p>
              </div>

              <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
                <p className="text-sm font-bold text-gray-500 uppercase w-36">
                  Date of Birth:
                </p>
                <p className="font-medium text-gray-700">
                  {student.dob ? new Date(student.dob).toDateString() : "N/A"}
                </p>
              </div>

              <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
                <p className="text-sm font-bold text-gray-500 uppercase w-36">
                  Gender:
                </p>
                <p className="font-medium text-gray-700 capitalize">
                  {student.gender || "N/A"}
                </p>
              </div>

              <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
                <p className="text-sm font-bold text-gray-500 uppercase w-36">
                  Academic Level:
                </p>
                <p className="font-medium text-gray-700">
                  Level {student.level || "N/A"}
                </p>
              </div>

              <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
                <p className="text-sm font-bold text-gray-500 uppercase w-36">
                  Program:
                </p>
                <p className="font-medium text-gray-700">
                  {student.program || "N/A"}
                </p>
              </div>

              <div className="flex items-center space-x-3 border-b border-gray-100 pb-2">
                <p className="text-sm font-bold text-gray-500 uppercase w-36">
                  Department:
                </p>
                <p className="font-medium text-gray-700">
                  {student.department?.dep_name || student.department || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-gray-500 font-medium">Loading student record...</p>
        </div>
      )}
    </div>
  );
};

export default ViewStudent;
