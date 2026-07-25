import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RequestLeave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leave, setLeave] = useState({
    userId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    if (user?._id) {
      setLeave((prev) => ({ ...prev, userId: user._id }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://ems-backend-hazel.vercel.app/api/student-leave/add",
        leave,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        navigate(`/student-dashboard/leaves/${user?._id}`);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(
          error.response.data.error ||
            "An error occurred submitting the request",
        );
      } else {
        alert("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Request Absence / Leave
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          {/* Absence Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Absence Category
            </label>
            <select
              name="leaveType"
              value={leave.leaveType}
              onChange={handleChange}
              className="mt-1 p-2.5 block w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="">Select Absence Reason</option>
              <option value="Medical Exemption">Medical Exemption</option>
              <option value="Personal / Family Emergency">
                Personal / Family Emergency
              </option>
              <option value="Academic Representation">
                Academic Representation / Competition
              </option>
              <option value="Official Permission">Official Permission</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                name="startDate"
                value={leave.startDate}
                onChange={handleChange}
                className="mt-1 p-2.5 block w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                name="endDate"
                value={leave.endDate}
                onChange={handleChange}
                className="mt-1 p-2.5 block w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
          </div>

          {/* Reason / Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reason Details
            </label>
            <textarea
              name="reason"
              rows="4"
              value={leave.reason}
              placeholder="Provide a detailed explanation for your absence request..."
              onChange={handleChange}
              className="mt-1 p-2.5 w-full border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              required
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors"
        >
          Submit Leave Request
        </button>
      </form>
    </div>
  );
};

export default RequestLeave;
