import React from "react";
import axios from "axios";

const AttendanceReport = () => {
  const [report, setReport] = React.useState({});
  const [limit, setLimit] = React.useState(5);
  const [skip, setSkip] = React.useState(0);
  const [dateFilter, setDateFilter] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ limit, skip });
      if (dateFilter) {
        query.append("date", dateFilter);
      }
      const response = await axios.get(
        `https://ems-backend-hazel.vercel.app/api/attendance/report?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        if (skip === 0) {
          setReport(response.data.groupData);
        } else {
          setReport((preData) => ({ ...preData, ...response.data.groupData }));
        }
      }
      setLoading(false);
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReport();
  }, [skip, dateFilter]);

  const handleLoadMore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  return (
    <div className="min-h-screen p-4 md:p-10 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-gray-800 mb-8">
          Attendance Report
        </h2>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              Filter by Date
            </h2>
            <input
              type="date"
              className="w-full md:w-64 p-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all cursor-pointer"
              onChange={(e) => {
                setDateFilter(e.target.value);
                setSkip(0);
              }}
            />
          </div>

          <div className="hidden md:block text-right">
            <p className="text-xs text-gray-400 font-medium">
              Showing report for
            </p>
            <p className="text-sm font-bold text-teal-600">
              {dateFilter || "All Dates"}
            </p>
          </div>
        </div>

        {/* Report Content */}
        {Object.keys(report).length > 0
          ? Object.entries(report).map(([date, record]) => (
              <div key={date} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 bg-teal-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-gray-700">{date}</h3>
                </div>

                {/* Responsive Table Wrapper */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-teal-600 text-white">
                      <tr>
                        <th className="px-4 py-4 font-bold uppercase text-[11px] tracking-widest text-center w-16">
                          S No
                        </th>
                        <th className="px-4 py-4 font-bold uppercase text-[11px] tracking-widest min-w-[120px]">
                          Emp ID
                        </th>
                        <th className="px-4 py-4 font-bold uppercase text-[11px] tracking-widest min-w-[150px]">
                          Full Name
                        </th>
                        <th className="px-4 py-4 font-bold uppercase text-[11px] tracking-widest min-w-[150px]">
                          Department
                        </th>
                        <th className="px-4 py-4 font-bold uppercase text-[11px] tracking-widest text-center w-32">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {record.map((data, i) => (
                        <tr
                          key={data.employeeId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 text-gray-500 text-center font-medium">
                            {i + 1}
                          </td>
                          <td className="px-4 py-4 font-bold text-gray-700">
                            {data.employeeId}
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-600">
                            {data.employeeName}
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {data.departmentName}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                                data.status === "Present"
                                  ? "bg-green-50 text-green-700 border-green-100"
                                  : data.status === "Absent"
                                    ? "bg-red-50 text-red-700 border-red-100"
                                    : "bg-yellow-50 text-yellow-700 border-yellow-100"
                              }`}
                            >
                              {data.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          : !loading && (
              <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No attendance data found for this period.
              </div>
            )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-10 space-x-3">
            <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-teal-600 font-bold text-sm">
              Updating report...
            </p>
          </div>
        )}

        {/* Load More Button */}
        {!loading && Object.keys(report).length > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              className="px-10 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 active:scale-95 disabled:opacity-50"
              onClick={handleLoadMore}
              disabled={loading}
            >
              Load More Records
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;
