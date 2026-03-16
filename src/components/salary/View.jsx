import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const View = () => {
  const [salaries, setSalaries] = React.useState(null);
  const [filteredSalaries, setFilteredSalaries] = React.useState(null);
  const { id } = useParams();
  const { user } = useAuth();

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/salary/${id}/${user.role}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.message);
      }
    }
  };

  React.useEffect(() => {
    fetchSalaries();
  }, []);

  const filterSalaries = (e) => {
    const q = e.target.value.toLowerCase();
    const filteredRecords = salaries.filter((salary) =>
      salary.employeeId.employeeId.toLowerCase().includes(q),
    );
    setFilteredSalaries(filteredRecords);
  };

  if (filteredSalaries === null) {
    return <div className="p-5 text-center">Loading .......</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Salary History</h2>
      </div>

      <div className="flex justify-center md:justify-end mb-6">
        <input
          type="text"
          placeholder="Search By Emp ID"
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
          onChange={filterSalaries}
        />
      </div>

      {filteredSalaries.length > 0 ? (
        <>
          {/* Desktop View Table */}
          <div className="hidden md:block overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-4">SNO</th>
                  <th className="px-6 py-4">Emp ID</th>
                  <th className="px-6 py-4">Salary</th>
                  <th className="px-6 py-4">Allowance</th>
                  <th className="px-6 py-4">Deduction</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary, index) => (
                  <tr
                    key={salary._id}
                    className="bg-white border-b hover:bg-teal-50"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {salary.employeeId.employeeId}
                    </td>
                    <td className="px-6 py-4">{salary.basicSalary} XAF</td>
                    <td className="px-6 py-4 text-green-600">
                      +{salary.allowances} XAF
                    </td>
                    <td className="px-6 py-4 text-red-600">
                      -{salary.deductions} XAF
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {salary.netSalary} XAF
                    </td>
                    <td className="px-6 py-4">
                      {new Date(salary.payDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View Cards */}
          <div className="md:hidden space-y-4">
            {filteredSalaries.map((salary, index) => (
              <div
                key={salary._id}
                className="bg-white p-4 rounded-xl shadow border border-gray-100"
              >
                <div className="flex justify-between border-b pb-2 mb-3">
                  <span className="font-bold text-teal-600">#{index + 1}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(salary.payDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-400 uppercase text-xs font-semibold">
                    Emp ID
                  </span>
                  <span className="text-right font-medium">
                    {salary.employeeId.employeeId}
                  </span>

                  <span className="text-gray-400 uppercase text-xs font-semibold">
                    Basic Salary
                  </span>
                  <span className="text-right">{salary.basicSalary} XAF</span>

                  <span className="text-gray-400 uppercase text-xs font-semibold">
                    Allowances
                  </span>
                  <span className="text-right text-green-600">
                    +{salary.allowances} XAF
                  </span>

                  <span className="text-gray-400 uppercase text-xs font-semibold">
                    Deductions
                  </span>
                  <span className="text-right text-red-600">
                    -{salary.deductions} XAF
                  </span>

                  <div className="col-span-2 border-t mt-2 pt-2 flex justify-between items-center">
                    <span className="text-gray-800 font-bold">Net Total</span>
                    <span className="text-lg font-extrabold text-teal-700">
                      {salary.netSalary} XAF
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-500">No Records Found</div>
      )}
    </div>
  );
};

export default View;
