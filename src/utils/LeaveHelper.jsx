import React from "react";
import DataTable from "react-data-table-component";
import { columns, LeaveButtons } from "../../utils/LeaveHelper";
import axios from "axios";

const Table = () => {
  const [leaves, setLeaves] = React.useState(null);
  const [filteredLeaves, setFilteredLeaves] = React.useState(null);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        "https://ems-backend-hazel.vercel.app/api/leave",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        let sno = 1;

        const data = response.data.leaves.map((leave) => {
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);
          const timeDiff = endDate.getTime() - startDate.getTime();
          const dayCount = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

          // Safe Extraction for both Employee and Student references
          const isStudent = Boolean(leave.studentId);
          const profile = isStudent ? leave.studentId : leave.employeeId;

          const identifier = isStudent
            ? profile?.matricule || "N/A"
            : profile?.employeeId || "N/A";

          const name = profile?.userId?.name || "Unknown User";
          const department =
            profile?.department?.dep_name ||
            profile?.classId?.className ||
            "N/A";

          return {
            _id: leave._id,
            sno: sno++,
            employeeId: identifier,
            name: name,
            leaveType: leave.leaveType,
            department: department,
            days: dayCount,
            status: leave.status,
            action: <LeaveButtons Id={leave._id} />,
          };
        });

        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  React.useEffect(() => {
    fetchLeaves();
  }, []);

  const filterByInput = (e) => {
    const query = e.target.value.toLowerCase();
    const data = leaves.filter(
      (leave) =>
        leave.employeeId.toLowerCase().includes(query) ||
        leave.name.toLowerCase().includes(query),
    );
    setFilteredLeaves(data);
  };

  const filterByButton = (status) => {
    const data = leaves.filter((leave) =>
      leave.status.toLowerCase().includes(status.toLowerCase()),
    );
    setFilteredLeaves(data);
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {filteredLeaves ? (
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
              Manage Leaves
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Review and process employee & student leave applications
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search By ID or Name..."
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  onChange={filterByInput}
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {["Pending", "Approved", "Rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => filterByButton(status)}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-bold hover:border-teal-500 hover:text-teal-600 rounded-lg transition-all active:scale-95"
                  >
                    {status}
                  </button>
                ))}
                <button
                  onClick={() => setFilteredLeaves(leaves)}
                  className="px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg hover:bg-gray-900 transition-all active:scale-95"
                >
                  All
                </button>
              </div>
            </div>
          </div>

          <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <DataTable
              columns={columns}
              data={filteredLeaves}
              pagination
              customStyles={customStyles}
              responsive
              highlightOnHover
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-gray-500 font-medium">Loading leave data...</p>
        </div>
      )}
    </div>
  );
};

export default Table;
