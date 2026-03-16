import React from "react";
import DataTable from "react-data-table-component";
import { columns, LeaveButtons } from "../../utils/LeaveHelper";
import axios from "axios";

const Table = () => {
  const [leaves, setLeaves] = React.useState(null);
  const [filteredLeaves, setFilteredLeaves] = React.useState(null);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
            employeeId: leave.employeeId.employeeId,
            name: leave.employeeId.userId.name,
            leaveType: leave.leaveType,
            department: leave.employeeId.department.dep_name,
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
    const data = leaves.filter((leave) =>
      leave.employeeId.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFilteredLeaves(data);
  };

  const filterByButton = (status) => {
    const data = leaves.filter((leave) =>
      leave.status.toLowerCase().includes(status.toLowerCase()),
    );
    setFilteredLeaves(data);
  };

  // Custom styles for the DataTable to make it more professional
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    rows: {
      style: {
        "&:hover": {
          backgroundColor: "#f9fafb",
        },
      },
    },
  };

  return (
    <div className="p-4 md:p-6">
      {filteredLeaves ? (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              Manage Leaves
            </h3>
          </div>

          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:justify-between md:items-center mb-6">
            {/* Search Input */}
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search By Emp ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
                onChange={filterByInput}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <button
                onClick={() => filterByButton("Pending")}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 rounded-md transition-colors"
              >
                Pending
              </button>
              <button
                onClick={() => filterByButton("Rejected")}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 rounded-md transition-colors"
              >
                Rejected
              </button>
              <button
                onClick={() => filterByButton("Approved")}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 rounded-md transition-colors"
              >
                Approved
              </button>
              <button
                onClick={() => setFilteredLeaves(leaves)}
                className="px-4 py-2 bg-gray-500 text-white text-sm font-medium hover:bg-gray-600 rounded-md transition-colors"
              >
                All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
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
        <div className="text-center py-20 text-gray-500 font-medium">
          Loading.......
        </div>
      )}
    </div>
  );
};

export default Table;
