import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Details = () => {
  const { id } = useParams();
  const [leave, setLeave] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/leave/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          setLeave(response.data.leave);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };
    fetchLeave();
  }, [id]);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/leave/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        navigate("/admin-dashboard/leaves");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="p-4 md:p-10">
      {leave ? (
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Leave Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Image Section */}
            <div className="flex justify-center">
              <img
                src={`http://localhost:5000/${leave.employeeId.userId.profileImage}`}
                alt="Profile"
                className="rounded-full border-4 border-teal-500 w-48 h-48 md:w-72 md:h-72 object-cover shadow-md"
              />
            </div>

            {/* Information Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-32">Name:</p>
                <p className="font-medium text-gray-900">
                  {leave.employeeId.userId.name}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-32">Employee ID:</p>
                <p className="font-medium text-gray-900">
                  {leave.employeeId.employeeId}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-32">Leave Type:</p>
                <p className="font-medium text-gray-900">{leave.leaveType}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-32">Department:</p>
                <p className="font-medium text-gray-900">
                  {leave.employeeId.department.dep_name}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-32">Duration:</p>
                <p className="font-medium text-gray-900">
                  {new Date(leave.startDate).toLocaleDateString()} -{" "}
                  {new Date(leave.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 border-b border-gray-100 pb-2">
                <p className="text-gray-500 font-bold w-32">Reason:</p>
                <p className="font-medium text-gray-900">{leave.reason}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 pt-4">
                <p className="text-gray-500 font-bold w-32 mb-2 sm:mb-0">
                  {leave.status === "Pending" ? "Action:" : "Status:"}
                </p>
                {leave.status === "Pending" ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => changeStatus(leave._id, "Approved")}
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => changeStatus(leave._id, "Rejected")}
                      className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      leave.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {leave.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      )}
    </div>
  );
};

export default Details;
