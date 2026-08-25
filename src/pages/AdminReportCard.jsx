import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEye,
  FaLock,
  FaLockOpen,
  FaTrophy,
  FaUserGraduate,
  FaFilter,
} from "react-icons/fa";

const API_BASE_URL = "https://ems-backend-hazel.vercel.app/api";

const AdminReportCard = () => {
  const [semesters, setSemesters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
  const [currentSemester, setCurrentSemester] = useState(null);

  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedStudentReport, setSelectedStudentReport] = useState(null);

  // Fetch semesters and classes on initial load
  useEffect(() => {
    fetchSemesters();
    fetchClasses();
  }, []);

  const fetchSemesters = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
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

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      // Fetch available classes / departments from your backend
      const res = await axios.get(`${API_BASE_URL}/class`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setClasses(res.data.classes || res.data.data || []);
      }
    } catch (err) {
      // Fallback if dedicated class endpoint returns non-standard shape
      console.warn("Could not load classes list automatically:", err.message);
    }
  };

  // Fetch class summary whenever selected semester or class changes
  useEffect(() => {
    if (selectedSemesterId) {
      fetchClassSummary(selectedSemesterId, selectedClassId);
    } else {
      setLeaderboard([]);
      setFilteredLeaderboard([]);
    }
  }, [selectedSemesterId, selectedClassId]);

  const fetchClassSummary = async (semesterId, classId = "") => {
    setLoading(true);
    setError("");
    setSelectedStudentReport(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        setLoading(false);
        return;
      }

      // Pass optional classId as query param to backend endpoint
      const url = classId
        ? `${API_BASE_URL}/report-card/class-summary/${semesterId}?classId=${classId}`
        : `${API_BASE_URL}/report-card/class-summary/${semesterId}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const rawLeaderboard = res.data.leaderboard || [];
        setLeaderboard(rawLeaderboard);

        // Client-side fallback filtering if backend returns unfiltered array
        if (classId) {
          const filtered = rawLeaderboard.filter(
            (st) =>
              st.classId === classId ||
              st.class === classId ||
              st.className === classId,
          );
          setFilteredLeaderboard(
            filtered.length > 0 ? filtered : rawLeaderboard,
          );
        } else {
          setFilteredLeaderboard(rawLeaderboard);
        }

        const match = semesters.find((s) => s._id === semesterId);
        setCurrentSemester(match || null);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError(
          "Access Denied (403): Your account does not have Admin privileges.",
        );
      } else {
        setError(
          err.response?.data?.error || "Failed to load class report cards.",
        );
      }
      setLeaderboard([]);
      setFilteredLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!currentSemester) return;
    setPublishing(true);
    setSuccessMsg("");
    setError("");
    const newStatus = !currentSemester.isReportCardPublished;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        setPublishing(false);
        return;
      }

      const res = await axios.put(
        `${API_BASE_URL}/report-card/publish/${currentSemester._id}`,
        { isPublished: newStatus, classId: selectedClassId || undefined },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setCurrentSemester((prev) => ({
          ...prev,
          isReportCardPublished: newStatus,
        }));
        setSemesters((prev) =>
          prev.map((s) =>
            s._id === currentSemester._id
              ? { ...s, isReportCardPublished: newStatus }
              : s,
          ),
        );
        setSuccessMsg(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update publish state.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Class Report Card Management
          </h1>
          <p className="text-gray-500 text-sm">
            Review rankings, grade distribution, and publish results by class or
            semester.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Semester Selector */}
          <select
            value={selectedSemesterId}
            onChange={(e) => setSelectedSemesterId(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none w-full md:w-52 text-sm"
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name || `Semester ${s.semesterNumber}`} ({s.academicYear})
              </option>
            ))}
          </select>

          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-1 w-full md:w-48">
            <FaFilter className="text-gray-400 text-xs hidden sm:block" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={!selectedSemesterId}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none w-full text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">-- All Classes --</option>
              {classes.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.className || c.name || c.code}
                </option>
              ))}
            </select>
          </div>

          {/* Publish / Unpublish Toggle */}
          {currentSemester && (
            <button
              onClick={handleTogglePublish}
              disabled={publishing}
              className={`px-4 py-2 rounded-md font-semibold text-white text-sm flex items-center gap-2 transition ${
                currentSemester.isReportCardPublished
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-teal-600 hover:bg-teal-700"
              } disabled:opacity-50`}
            >
              {currentSemester.isReportCardPublished ? (
                <FaLock />
              ) : (
                <FaLockOpen />
              )}
              {publishing
                ? "Updating..."
                : currentSemester.isReportCardPublished
                  ? "Unpublish Results"
                  : "Publish Results"}
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md border border-red-200 font-medium text-sm">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md border border-green-200 font-medium text-sm">
          {successMsg}
        </div>
      )}

      {/* Status Banner */}
      {currentSemester && (
        <div
          className={`p-4 rounded-md flex justify-between items-center text-sm ${
            currentSemester.isReportCardPublished
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-amber-50 text-amber-800 border border-amber-200"
          }`}
        >
          <span>
            <strong>Publish Status:</strong>{" "}
            {currentSemester.isReportCardPublished
              ? "Published (Students can view)"
              : "Draft (Hidden from Students)"}
          </span>
          {currentSemester.publishedAt && (
            <span className="text-xs text-gray-500">
              Published on:{" "}
              {new Date(currentSemester.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          Compiling class performance and rankings...
        </div>
      ) : filteredLeaderboard.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Leaderboard */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" /> Class Leaderboard &
                Rankings
              </h2>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {filteredLeaderboard.length} Students
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Reg No.</th>
                    <th className="p-3 text-center">Average (/20)</th>
                    <th className="p-3 text-center">Grade</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredLeaderboard.map((st, idx) => (
                    <tr
                      key={st.studentId || idx}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-semibold">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs text-center min-w-[30px] ${
                            st.rank === 1 || idx === 0
                              ? "bg-yellow-100 text-yellow-800 font-bold"
                              : st.rank === 2 || idx === 1
                                ? "bg-gray-200 text-gray-800 font-bold"
                                : st.rank === 3 || idx === 2
                                  ? "bg-amber-100 text-amber-900 font-bold"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          #{st.rank || idx + 1}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-gray-800">
                        {st.name}
                      </td>
                      <td className="p-3 text-gray-500">
                        {st.registrationNumber || "N/A"}
                      </td>
                      <td className="p-3 text-center font-bold text-teal-700">
                        {st.overallAverage}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                          {st.overallGrade}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedStudentReport(st)}
                          className="px-3 py-1 bg-gray-100 hover:bg-teal-50 text-teal-700 rounded text-xs flex items-center gap-1 mx-auto font-medium transition"
                        >
                          <FaEye /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Breakdown Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {selectedStudentReport ? (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    {selectedStudentReport.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Reg: {selectedStudentReport.registrationNumber || "N/A"}
                  </p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span className="bg-teal-50 text-teal-800 px-2 py-1 rounded font-semibold">
                      Rank:{" "}
                      {selectedStudentReport.positionRatio ||
                        `#${selectedStudentReport.rank}`}
                    </span>
                    <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded font-semibold">
                      Avg: {selectedStudentReport.overallAverage} / 20
                    </span>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-700 text-sm">
                  Subject Breakdown
                </h4>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {selectedStudentReport.subjects?.map((sub, idx) => (
                    <div
                      key={idx}
                      className="border p-3 rounded-md bg-gray-50 text-xs space-y-2"
                    >
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>
                          {sub.subjectName} ({sub.subjectCode})
                        </span>
                        <span className="text-teal-700">
                          {sub.finalSubjectMark} / 20 ({sub.grade})
                        </span>
                      </div>
                      <div className="space-y-1">
                        {sub.sessionBreakdown?.map((sb, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex justify-between text-gray-500 text-[11px]"
                          >
                            <span>
                              {sb.sessionName} (Weight: {sb.weight}%)
                            </span>
                            <span>{sb.normalizedScore} / 20</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 flex flex-col items-center gap-2">
                <FaUserGraduate className="text-4xl text-gray-300" />
                <p>
                  Select a student from the leaderboard to view their full
                  report card breakdown.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : selectedSemesterId ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md text-gray-500">
          No marks or report card entries found for the selected class/semester
          filter.
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md text-gray-500">
          Please select a semester above to load class report cards.
        </div>
      )}
    </div>
  );
};

export default AdminReportCard;
