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
        `http://localhost:5000/api/attendance/report?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        if (skip == 0) {
          setReport(response.data.groupData);
        } else {
          setReport((preData) => ({ ...preData, ...response.data.groupData }));
        }
      }
      setLoading(false);
    } catch (error) {
      alert(error.message);
    }
  };

  React.useEffect(() => {
    fetchReport();
  }, [skip, dateFilter]);
  const handleLoadMore = () => {
    setSkip((prevSkip) => prevSkip + limit);
    fetchReport();
  };
  return (
    <div className="min-h-screen p-10 bg-white">
      <h2 className="text-center text-2xl font-bold">Attendance Report</h2>
      <div>
        <h2 className="text-xl font-semibold">Filter by Date</h2>
        <input
          type="date"
          className="border bg-gray-100"
          onChange={(e) => {
            (setDateFilter(e.target.value), setSkip(0));
          }}
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        Object.entries(report).map(([date, record]) => (
          <div key={date} className="my-4">
            <h3 className="text-lg font-semibold">{date}</h3>
            <table className="w-full mt-4 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    S No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Employee ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Department
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {record.map((data, i) => (
                  <tr
                    key={data.employeeId}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700">{i + 1}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {data.employeeId}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {data.employeeName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {data.departmentName}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          data.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : data.status === "Absent"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
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
        ))
      )}
      <button
        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
        onClick={handleLoadMore}
      >
        Load More
      </button>
    </div>
  );
};

export default AttendanceReport;
