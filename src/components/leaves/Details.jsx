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
          `https://ems-backend-hazel.vercel.app/api/leave/detail/${id}`,
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
          alert(error.response.data.error || "Failed to load leave details.");
        }
      }
    };
    fetchLeave();
  }, [id]);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `https://ems-backend-hazel.vercel.app/api/leave/${id}`,
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
        alert(error.response.data.error || "Status update failed.");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {leave ? (
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-extrabold mb-8 text-center text-gray-800">
            Leave Request Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Profile Image Section */}
            <div className="flex justify-center">
              <img
                src={
                  leave?.employeeId?.userId?.profileImage ||
                  "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="rounded-full border-4 border-teal-500 w-40 h-40 md:w-60 md:h-60 object-cover shadow-md"
              />
            </div>

            {/* Information Grid */}
            <div className="space-y-3">
              <div className="flex border-b pb-2">
                <span className="font-bold w-32 text-gray-600">Name:</span>
                <span className="font-semibold text-gray-800">
                  {leave.employeeId?.userId?.name || "N/A"}
                </span>
              </div>

              <div className="flex border-b pb-2">
                <span className="font-bold w-32 text-gray-600">ID:</span>
                <span className="font-semibold text-gray-800">
                  {leave.employeeId?.employeeId || "N/A"}
                </span>
              </div>

              <div className="flex border-b pb-2">
                <span className="font-bold w-32 text-gray-600">
                  Leave Type:
                </span>
                <span className="font-semibold text-gray-800">
                  {leave.leaveType}
                </span>
              </div>

              <div className="flex border-b pb-2">
                <span className="font-bold w-32 text-gray-600">Gender:</span>
                <span className="font-semibold text-gray-800">
                  {leave.employeeId?.gender || "N/A"}
                </span>
              </div>

              <div className="flex border-b pb-2">
                <span className="font-bold w-32 text-gray-600">
                  Department:
                </span>
                <span className="font-semibold text-gray-800">
                  {leave.employeeId?.department?.dep_name || "N/A"}
                </span>
              </div>

              <div className="flex border-b pb-2">
                <span className="font-bold w-32 text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-800">
                  {new Date(leave.startDate).toLocaleDateString()} -{" "}
                  {new Date(leave.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex border-b pb-2">
                <span className="font-bold w-32 text-gray-600">Reason:</span>
                <span className="font-semibold text-gray-800">
                  {leave.reason}
                </span>
              </div>

              <div className="flex items-center pt-3">
                <span className="font-bold w-32 text-gray-600">
                  {leave.status === "Pending" ? "Action:" : "Status:"}
                </span>
                {leave.status === "Pending" ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => changeStatus(leave._id, "Approved")}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-lg transition-all active:scale-95 shadow"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => changeStatus(leave._id, "Rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg transition-all active:scale-95 shadow"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold uppercase border ${
                      leave.status === "Approved"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
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
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading details...</p>
        </div>
      )}
    </div>
  );
};

export default Details;
