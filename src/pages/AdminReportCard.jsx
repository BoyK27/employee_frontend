import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEye,
  FaLock,
  FaLockOpen,
  FaTrophy,
  FaUserGraduate,
  FaFilter,
  FaPrint,
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
      const res = await axios.get(`${API_BASE_URL}/class`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setClasses(res.data.classes || res.data.data || []);
      }
    } catch (err) {
      console.warn("Could not load classes list automatically:", err.message);
    }
  };

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

      const url = classId
        ? `${API_BASE_URL}/report-card/class-summary/${semesterId}?classId=${classId}`
        : `${API_BASE_URL}/report-card/class-summary/${semesterId}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const rawLeaderboard = res.data.leaderboard || [];
        setLeaderboard(rawLeaderboard);

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

  const getSessionHeaders = () => {
    if (!selectedStudentReport?.subjects) return [];
    const headers = new Set();
    selectedStudentReport.subjects.forEach((sub) => {
      sub.sessionBreakdown?.forEach((sb) => {
        headers.add(sb.sessionName);
      });
    });
    return Array.from(headers);
  };

  const sessionHeaders = getSessionHeaders();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Class Report Card Management
          </h1>
          <p className="text-slate-500 text-sm">
            Review rankings, grade distribution, and publish results by class or
            semester.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedSemesterId}
            onChange={(e) => setSelectedSemesterId(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none w-full md:w-52 text-sm"
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name || `Semester ${s.semesterNumber}`} ({s.academicYear})
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 w-full md:w-48">
            <FaFilter className="text-slate-400 text-xs hidden sm:block" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={!selectedSemesterId}
              className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none w-full text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="">-- All Classes --</option>
              {classes.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.className || c.name || c.code}
                </option>
              ))}
            </select>
          </div>

          {currentSemester && (
            <button
              onClick={handleTogglePublish}
              disabled={publishing}
              className={`px-4 py-2 rounded-lg font-semibold text-white text-sm flex items-center gap-2 transition ${
                currentSemester.isReportCardPublished
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-slate-700 hover:bg-slate-800"
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
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 font-medium text-sm">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg border border-green-200 font-medium text-sm">
          {successMsg}
        </div>
      )}

      {/* Status Banner */}
      {currentSemester && (
        <div
          className={`p-4 rounded-lg flex justify-between items-center text-sm ${
            currentSemester.isReportCardPublished
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
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
            <span className="text-xs text-slate-500">
              Published on:{" "}
              {new Date(currentSemester.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Compiling class performance and rankings...
        </div>
      ) : filteredLeaderboard.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Class Leaderboard */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" /> Leaderboard
              </h2>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                {filteredLeaderboard.length} Students
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
                    <th className="p-2.5">Rank</th>
                    <th className="p-2.5">Student</th>
                    <th className="p-2.5 text-center">Avg</th>
                    <th className="p-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredLeaderboard.map((st, idx) => (
                    <tr
                      key={st.studentId || idx}
                      className={`hover:bg-slate-50 transition ${
                        selectedStudentReport?.studentId === st.studentId
                          ? "bg-slate-100/70"
                          : ""
                      }`}
                    >
                      <td className="p-2.5 font-semibold">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs text-center min-w-[28px] ${
                            st.rank === 1 || idx === 0
                              ? "bg-yellow-100 text-yellow-800 font-bold"
                              : st.rank === 2 || idx === 1
                                ? "bg-slate-200 text-slate-800 font-bold"
                                : st.rank === 3 || idx === 2
                                  ? "bg-amber-100 text-amber-900 font-bold"
                                  : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          #{st.rank || idx + 1}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="font-semibold text-slate-800 text-xs">
                          {st.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {st.registrationNumber || "N/A"}
                        </div>
                      </td>
                      <td className="p-2.5 text-center font-bold text-teal-800 text-xs">
                        {st.overallAverage}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => setSelectedStudentReport(st)}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs flex items-center gap-1 mx-auto font-medium transition"
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

          {/* Detailed Printable Formal Preview Panel */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {selectedStudentReport ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-bold text-slate-700">Official Preview</h3>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <FaPrint /> Print Preview
                  </button>
                </div>

                {/* Styled Report Card Output */}
                <div className="bg-white p-6 border border-slate-200 rounded-lg space-y-4 text-xs font-sans">
                  {/* Top Header */}
                  <div className="text-center border-b-2 border-slate-700 pb-2">
                    <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest">
                      STUDENT REPORT CARD
                    </h2>
                  </div>

                  {/* Info Header */}
                  <div className="bg-[#E4ECEB] p-3 rounded border border-[#C5D9D7] grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="font-bold text-slate-700">NAME:</span>{" "}
                      {selectedStudentReport.name}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">REG NO:</span>{" "}
                      {selectedStudentReport.registrationNumber || "N/A"}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">RANK:</span>{" "}
                      {selectedStudentReport.positionRatio ||
                        `#${selectedStudentReport.rank}`}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">AVERAGE:</span>{" "}
                      {selectedStudentReport.overallAverage} / 20
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="uppercase font-bold">
                        <th className="p-2 bg-[#5B6B8A] text-white">SUBJECT</th>
                        {sessionHeaders.map((header, idx) => (
                          <th
                            key={idx}
                            className={`p-2 text-center text-white ${
                              idx % 2 === 0 ? "bg-[#7A839E]" : "bg-[#A1A8BD]"
                            }`}
                          >
                            {header}
                          </th>
                        ))}
                        <th className="p-2 bg-[#71AEA7] text-white text-center">
                          FINAL SCORE
                        </th>
                        <th className="p-2 bg-[#5B6B8A] text-white text-center">
                          GRADE
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedStudentReport.subjects?.map((sub, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-semibold text-slate-800 uppercase border-b border-l border-slate-200">
                            {sub.subjectName}
                          </td>
                          {sessionHeaders.map((headerName, hIdx) => {
                            const sessionMatch = sub.sessionBreakdown?.find(
                              (sb) => sb.sessionName === headerName,
                            );
                            return (
                              <td
                                key={hIdx}
                                className="p-2 text-center border-b border-slate-200 bg-slate-50/50"
                              >
                                {sessionMatch
                                  ? `${sessionMatch.normalizedScore}/20`
                                  : "-"}
                              </td>
                            );
                          })}
                          <td className="p-2 text-center font-bold text-teal-800 border-b border-slate-200 bg-[#EBF5F4]">
                            {sub.finalSubjectMark} / 20
                          </td>
                          <td className="p-2 text-center border-r border-b border-slate-200 font-bold">
                            {sub.grade}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-slate-400 flex flex-col items-center gap-2">
                <FaUserGraduate className="text-4xl text-slate-300" />
                <p>
                  Select a student from the leaderboard to view their official
                  report card.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : selectedSemesterId ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border text-slate-500">
          No marks or report card entries found for the selected filter.
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border text-slate-500">
          Please select a semester above to load report cards.
        </div>
      )}
    </div>
  );
};

export default AdminReportCard;
