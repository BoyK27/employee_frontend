import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPrint,
  FaTrophy,
  FaExclamationTriangle,
  FaBookOpen,
} from "react-icons/fa";

const API_BASE_URL = "https://ems-backend-hazel.vercel.app/api";

const StudentReportCard = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get current student user details from Auth Context / Local Storage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  // Safely extract studentId across user payload schema variants
  const studentId =
    currentUser?.studentId?._id ||
    currentUser?.studentId ||
    currentUser?._id ||
    currentUser?.id;

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/semester`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSemesters(res.data.semesters || res.data.data || []);
      }
    } catch (err) {
      setError("Failed to fetch academic semesters.");
    }
  };

  useEffect(() => {
    if (selectedSemesterId && studentId) {
      fetchReportCard(selectedSemesterId);
    }
  }, [selectedSemesterId]);

  const fetchReportCard = async (semesterId) => {
    setLoading(true);
    setError("");
    setReportCard(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/report-card/student/${studentId}/semester/${semesterId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setReportCard(res.data.reportCard);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Semester report card is currently unavailable or not published.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Controls (Hidden during print) */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Academic Report Card
          </h1>
          <p className="text-gray-500 text-sm">
            Select a semester to review published results.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select
            value={selectedSemesterId}
            onChange={(e) => setSelectedSemesterId(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none w-full sm:w-64"
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name || `Semester ${s.semesterNumber}`} ({s.academicYear})
              </option>
            ))}
          </select>

          {reportCard && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-semibold flex items-center gap-2 transition"
            >
              <FaPrint /> Print
            </button>
          )}
        </div>
      </div>

      {/* Error / Unpublished State */}
      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg shadow-sm flex items-start gap-3">
          <FaExclamationTriangle className="text-amber-600 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-amber-800">Notice</h3>
            <p className="text-amber-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Report Card Document View */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md text-gray-500">
          Compiling your official semester report card...
        </div>
      ) : reportCard ? (
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-6 border border-gray-100 print:shadow-none print:p-0 print:border-none">
          {/* Printable Header */}
          <div className="border-b-2 border-teal-600 pb-4 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">
                Official Report Card
              </h2>
              <p className="text-teal-700 font-semibold">
                {reportCard.semesterName}
              </p>
              <p className="text-xs text-gray-500">
                Academic Year: {reportCard.academicYear}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase text-gray-400 block font-bold">
                Class Rank
              </span>
              <span className="text-2xl font-black text-teal-700 flex items-center justify-end gap-1">
                <FaTrophy className="text-yellow-500 text-lg" />{" "}
                {reportCard.positionRatio}
              </span>
            </div>
          </div>

          {/* Student Profile Overview */}
          <div className="bg-gray-50 p-4 rounded-md grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500 text-xs block">Student Name</span>
              <span className="font-bold text-gray-800">{reportCard.name}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">
                Registration No.
              </span>
              <span className="font-bold text-gray-800">
                {reportCard.registrationNumber || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">
                Overall Average
              </span>
              <span className="font-bold text-teal-700">
                {reportCard.overallAverage} / 20
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">Final Grade</span>
              <span className="font-bold text-blue-700">
                {reportCard.overallGrade}
              </span>
            </div>
          </div>

          {/* Marks & Subjects Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-md">
              <FaBookOpen className="text-teal-600" /> Academic Performance
              Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-200 text-sm">
                <thead>
                  <tr className="bg-teal-700 text-white text-xs font-semibold uppercase">
                    <th className="p-3 border">Subject</th>
                    <th className="p-3 border text-center">Code</th>
                    <th className="p-3 border">Session Breakdown</th>
                    <th className="p-3 border text-center">
                      Final Score (/20)
                    </th>
                    <th className="p-3 border text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs">
                  {reportCard.subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 border font-semibold text-gray-800">
                        {sub.subjectName}
                      </td>
                      <td className="p-3 border text-center text-gray-500">
                        {sub.subjectCode}
                      </td>
                      <td className="p-3 border space-y-1">
                        {sub.sessionBreakdown.map((sb, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex justify-between text-[11px] text-gray-600"
                          >
                            <span>
                              {sb.sessionName} ({sb.weight}%):
                            </span>
                            <span className="font-mono">
                              {sb.normalizedScore} / 20
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="p-3 border text-center font-bold text-teal-700 text-sm">
                        {sub.finalSubjectMark}
                      </td>
                      <td className="p-3 border text-center font-bold text-blue-800 text-sm">
                        {sub.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Sign-off */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-gray-500 border-t">
            <div>
              <p className="font-semibold text-gray-700">
                Class Delegate / Coordinator
              </p>
              <div className="mt-8 border-b border-gray-300 w-3/4 mx-auto"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-700">
                Head of Department / Administration
              </p>
              <div className="mt-8 border-b border-gray-300 w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      ) : !selectedSemesterId ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md text-gray-500">
          Please select a semester from the dropdown to view your report card.
        </div>
      ) : null}
    </div>
  );
};

export default StudentReportCard;
