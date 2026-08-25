import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FaGraduationCap,
  FaTrophy,
  FaBook,
  FaLock,
  FaPrint,
} from "react-icons/fa";

const API_BASE_URL = "https://ems-backend-hazel.vercel.app/api";

const StudentReportCard = () => {
  const { studentId } = useParams();

  const [semesters, setSemesters] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (selectedSemesterId && studentId) {
      fetchStudentReportCard(selectedSemesterId);
    } else {
      setReportCard(null);
    }
  }, [selectedSemesterId, studentId]);

  const fetchSemesters = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/semester`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const list = res.data.semesters || res.data.data || [];
        setSemesters(list);
        if (list.length > 0) {
          setSelectedSemesterId(list[0]._id);
        }
      }
    } catch (err) {
      setError("Failed to load academic semesters.");
    }
  };

  const fetchStudentReportCard = async (semesterId) => {
    setLoading(true);
    setError("");
    setReportCard(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication missing. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_BASE_URL}/report-card/student/${studentId}/semester/${semesterId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setReportCard(res.data.reportCard);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError(
          err.response?.data?.error ||
            "Report cards for this semester have not been published by administration yet.",
        );
      } else if (err.response?.status === 404) {
        setError("No report card data found for this semester.");
      } else {
        setError("Failed to retrieve report card information.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 print:p-0 print:max-w-none">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:shadow-none print:border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaGraduationCap className="text-teal-600 print:hidden" /> Academic
            Report Card
          </h1>
          <p className="text-gray-500 text-sm">
            {reportCard
              ? `${reportCard.semesterName || "Semester"} - ${reportCard.academicYear || ""}`
              : "View compiled grades, subject breakdowns, and semester ranks."}
          </p>
        </div>

        {/* Semester Dropdown & Print Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto print:hidden">
          <select
            value={selectedSemesterId}
            onChange={(e) => setSelectedSemesterId(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none w-full sm:w-56 text-sm"
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
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-sm font-medium flex items-center gap-2 transition"
            >
              <FaPrint /> Print
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-md flex items-center gap-3 text-sm print:hidden">
          <FaLock className="text-amber-600 text-lg flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md text-gray-500 text-sm">
          Loading report card details...
        </div>
      ) : reportCard ? (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-teal-500 print:shadow-none print:border">
              <span className="text-xs text-gray-500 uppercase font-semibold">
                Student Name
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-1">
                {reportCard.name}
              </h3>
              <p className="text-xs text-gray-500">
                Reg No: {reportCard.registrationNumber || "N/A"}
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500 flex justify-between items-center print:shadow-none print:border">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">
                  Semester Average
                </span>
                <h3 className="text-2xl font-bold text-teal-700 mt-1">
                  {reportCard.overallAverage} / 20
                </h3>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-bold text-lg">
                {reportCard.overallGrade}
              </span>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-yellow-500 flex justify-between items-center print:shadow-none print:border">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">
                  Class Position
                </span>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {reportCard.positionRatio || `#${reportCard.rank}`}
                </h3>
              </div>
              <FaTrophy className="text-yellow-500 text-3xl print:hidden" />
            </div>
          </div>

          {/* Subject Breakdown Table */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4 print:shadow-none print:p-0">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaBook className="text-teal-600 print:hidden" /> Subject Grades &
              Evaluation Breakdown
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                    <th className="p-3">Subject</th>
                    <th className="p-3">Assessments</th>
                    <th className="p-3 text-center">Final Score (/20)</th>
                    <th className="p-3 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {reportCard.subjects?.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-semibold text-gray-800">
                        {sub.subjectName}
                        <div className="text-xs text-gray-400 font-normal">
                          {sub.subjectCode}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {sub.sessionBreakdown?.map((sb, sIdx) => (
                            <div
                              key={sIdx}
                              className="text-xs text-gray-600 flex gap-2"
                            >
                              <span className="font-medium">
                                {sb.sessionName}:
                              </span>
                              <span>
                                {sb.rawScore} / {sb.outOf} ({sb.normalizedScore}
                                /20)
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold text-teal-700 text-base">
                        {sub.finalSubjectMark}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-teal-100 text-teal-800">
                          {sub.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : !selectedSemesterId ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md text-gray-500">
          Please select a semester to view your report card.
        </div>
      ) : null}
    </div>
  );
};

export default StudentReportCard;
