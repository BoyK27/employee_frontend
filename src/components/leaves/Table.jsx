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

          return {
            _id: leave._id,
            sno: sno++,
            employeeId: leave.employeeId?.employeeId || "N/A",
            name: leave.employeeId?.userId?.name || "N/A",
            leaveType: leave.leaveType || "N/A",
            department: leave.employeeId?.department?.dep_name || "N/A",
            days: isNaN(dayCount) ? 0 : dayCount,
            status: leave.status || "Pending",
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
        alert("An unexpected error occurred. Please check the console.");
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
    const data = leaves.filter(
      (leave) => leave.status.toLowerCase() === status.toLowerCase(),
    );
    setFilteredLeaves(data);
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
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {filteredLeaves ? (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Manage Leaves
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <input
              type="text"
              placeholder="Search By Emp ID or Name..."
              className="w-full sm:w-80 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              onChange={filterByInput}
            />

            <div className="flex flex-wrap gap-2">
              {["Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => filterByButton(status)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-all shadow active:scale-95"
                >
                  {status}
                </button>
              ))}
              <button
                onClick={() => setFilteredLeaves(leaves)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg text-xs transition-all shadow active:scale-95"
              >
                All
              </button>
            </div>
          </div>

          {/* --- MOBILE VIEW (Cards) --- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredLeaves.map((leave) => (
              <div
                key={leave._id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800">{leave.name}</h4>
                    <p className="text-xs font-bold text-teal-600">
                      {leave.employeeId}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase ${
                      leave.status === "Approved"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : leave.status === "Rejected"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-400 block font-bold">TYPE</span>
                    <span className="font-semibold text-gray-700">
                      {leave.leaveType}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-400 block font-bold">DAYS</span>
                    <span className="font-semibold text-gray-700">
                      {leave.days} Days
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-semibold">
                    {leave.department}
                  </span>
                  <LeaveButtons Id={leave._id} />
                </div>
              </div>
            ))}
          </div>

          {/* --- DESKTOP VIEW (Table) --- */}
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
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-500 font-medium">
            Loading leave data...
          </p>
        </div>
      )}
    </div>
  );
};

export default Table;
