import React from "react";
import SummaryCard from "./SummaryCard";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaGraduationCap, // Added for Student Card
  FaHourglassHalf,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";

const AdminSummary = () => {
  const [summary, setSummary] = React.useState(null);

  React.useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await axios.get(
          "https://ems-backend-hazel.vercel.app/api/dashboard/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setSummary(summary.data);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
        }
        console.log(error.message);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h3 className="text-2xl font-bold text-gray-800">Dashboard Overview</h3>

      {/* Top Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <SummaryCard
          icon={<FaUsers />}
          text="Number of Employees"
          number={summary.totalEmployees}
          color="bg-teal-600"
        />

        {/* Student Card */}
        <SummaryCard
          icon={<FaGraduationCap />}
          text="Total Students"
          number={summary.totalStudents || 0}
          color="bg-indigo-600"
        />

        <SummaryCard
          icon={<FaBuilding />}
          text="Total Departments"
          number={summary.totalDepartments}
          color="bg-yellow-600"
        />

        <SummaryCard
          icon={<FaBuilding />}
          text="Total Salaries"
          number={`${summary.totalSalaries || 0} XAF`}
          color="bg-blue-600"
        />
      </div>

      {/* Leave Details Section */}
      <div className="mt-12">
        <h4 className="text-2xl font-bold text-gray-800">Leave Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <SummaryCard
            icon={<FaFileAlt />}
            text="Leaves Applied"
            number={summary.leaveSummary?.appliedFor || 0}
            color="bg-teal-600"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            text="Leaves Approved"
            number={summary.leaveSummary?.approved || 0}
            color="bg-green-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text="Leaves Pending"
            number={summary.leaveSummary?.pending || 0}
            color="bg-yellow-600"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Leaves Rejected"
            number={summary.leaveSummary?.rejected || 0}
            color="bg-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
