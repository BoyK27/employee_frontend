import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEye,
  FaGlobe,
  FaLock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlus,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const AdminReportCard = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [examSessions, setExamSessions] = useState([]);

  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedSemesterData, setSelectedSemesterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal State for Student Detailed Report Card View
  const [viewingStudent, setViewingStudent] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Modal State for Creating/Configuring a Semester
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [newSemesterName, setNewSemesterName] = useState("");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [selectedSessionsWithWeights, setSelectedSessionsWithWeights] =
    useState([]);

  // Fetch initial classes & exam sessions
  useEffect(() => {
    fetchClasses();
    fetchExamSessions();
  }, []);

  // Fetch semesters when class changes
  useEffect(() => {
    if (selectedClass) {
      fetchSemestersByClass(selectedClass);
    } else {
      setSemesters([]);
      setSelectedSemester("");
      setLeaderboard([]);
    }
  }, [selectedClass]);

  // Fetch leaderboard when semester changes
  useEffect(() => {
    if (selectedSemester) {
      const semObj = semesters.find((s) => s._id === selectedSemester);
      setSelectedSemesterData(semObj || null);
      fetchClassLeaderboard(selectedSemester);
    } else {
      setLeaderboard([]);
      setSelectedSemesterData(null);
    }
  }, [selectedSemester]);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        "https://ems-backend-iota.vercel.app/api/class",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (res.data.success) setClasses(res.data.classes || []);
    } catch (err) {
      setError("Failed to fetch classes.");
    }
  };

  const fetchExamSessions = async () => {
    try {
      const res = await axios.get(
        "https://ems-backend-iota.vercel.app/api/exam-session",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (res.data.success) setExamSessions(res.data.examSessions || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSemestersByClass = async (classId) => {
    try {
      const res = await axios.get(
        `https://ems-backend-iota.vercel.app/api/semester/class/${classId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (res.data.success) setSemesters(res.data.semesters || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClassLeaderboard = async (semesterId) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://ems-backend-iota.vercel.app/api/report-card/class-summary/${semesterId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to load class report card data.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle Publish / Unpublish Status
  const handleTogglePublish = async () => {
    if (!selectedSemester) return;
    setActionLoading(true);
    setError("");
    setSuccess("");

    const nextState = !selectedSemesterData?.isReportCardPublished;

    try {
      const res = await axios.put(
        `https://ems-backend-iota.vercel.app/api/report-card/publish/${selectedSemester}`,
        { isPublished: nextState },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      if (res.data.success) {
        setSuccess(res.data.message);
        setSelectedSemesterData((prev) => ({
          ...prev,
          isReportCardPublished: nextState,
        }));
        setSemesters((prev) =>
          prev.map((s) =>
            s._id === selectedSemester
              ? { ...s, isReportCardPublished: nextState }
              : s,
          ),
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to update publication status.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // View individual student report card details in modal
  const handleViewStudentReport = async (student) => {
    setViewingStudent(student);
    setModalLoading(true);
    try {
      const res = await axios.get(
        `https://ems-backend-iota.vercel.app/api/report-card/student/${student.studentId}/semester/${selectedSemester}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (res.data.success) {
        setStudentReport(res.data.reportCard);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Semester Report Cards
          </h2>
          <p className="text-sm text-gray-600">
            Compile session marks, calculate class ranks, and manage publishing.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Class & Semester Selectors */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Select Class */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
            Select Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value="">-- Choose Class --</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className}
              </option>
            ))}
          </select>
        </div>

        {/* Select Semester */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
            Select Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            disabled={!selectedClass}
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm disabled:bg-gray-100"
          >
            <option value="">-- Choose Semester --</option>
            {semesters.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.academicYear})
              </option>
            ))}
          </select>
        </div>

        {/* Publish / Unpublish Action Button */}
        <div>
          {selectedSemesterData && (
            <button
              onClick={handleTogglePublish}
              disabled={actionLoading}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition ${
                selectedSemesterData.isReportCardPublished
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              {actionLoading ? (
                <FaSpinner className="animate-spin" />
              ) : selectedSemesterData.isReportCardPublished ? (
                <>
                  <FaLock /> Unpublish Report Cards
                </>
              ) : (
                <>
                  <FaGlobe /> Publish to Students
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Class Leaderboard & Summary Table */}
      {selectedSemester && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Status Bar */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">
              Class Performance Summary
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                selectedSemesterData?.isReportCardPublished
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-amber-100 text-amber-700 border border-amber-300"
              }`}
            >
              {selectedSemesterData?.isReportCardPublished ? (
                <>
                  <FaCheckCircle /> Published
                </>
              ) : (
                <>
                  <FaExclamationTriangle /> Hidden from Students
                </>
              )}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500 flex justify-center items-center gap-2">
              <FaSpinner className="animate-spin text-teal-600 text-xl" />{" "}
              Compiling Class Grades & Positions...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No student marks submitted for this semester yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Reg No</th>
                    <th className="py-3 px-4 text-center">
                      Semester Average (/20)
                    </th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {leaderboard.map((st, idx) => (
                    <tr key={st.studentId} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-bold text-teal-600">
                        {idx + 1 === 1
                          ? "🥇 1st"
                          : idx + 1 === 2
                            ? "🥈 2nd"
                            : idx + 1 === 3
                              ? "🥉 3rd"
                              : `${idx + 1}th`}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {st.name}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {st.registrationNumber || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-900">
                        {st.overallAverage} / 20
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-bold ${
                            st.overallAverage >= 12
                              ? "bg-green-100 text-green-800"
                              : st.overallAverage >= 10
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {st.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleViewStudentReport(st)}
                          className="px-3 py-1.5 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded font-semibold text-xs flex items-center gap-1 mx-auto"
                        >
                          <FaEye /> View Report Card
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Student Report Card Preview Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setViewingStudent(null);
                setStudentReport(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
            >
              <FaTimes />
            </button>

            {modalLoading ? (
              <div className="p-12 text-center text-gray-500">
                Loading student details...
              </div>
            ) : studentReport ? (
              <div>
                <div className="border-b pb-4 mb-4 text-center">
                  <h3 className="text-xl font-black text-teal-700 uppercase">
                    Academic Report Card
                  </h3>
                  <p className="text-sm text-gray-500">
                    {studentReport.semesterName} — {studentReport.academicYear}
                  </p>
                  <p className="font-bold text-gray-800 text-base mt-1">
                    {viewingStudent.name}
                  </p>
                </div>

                {/* Score KPI summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-teal-50 p-3 rounded-lg text-center border border-teal-200">
                    <p className="text-xs text-teal-700 uppercase font-semibold">
                      Overall Average
                    </p>
                    <p className="text-xl font-bold text-teal-900">
                      {studentReport.overallAverage}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg text-center border border-amber-200">
                    <p className="text-xs text-amber-700 uppercase font-semibold">
                      Class Rank
                    </p>
                    <p className="text-xl font-bold text-amber-900">
                      {studentReport.rank} ({studentReport.positionRatio})
                    </p>
                  </div>
                </div>

                {/* Subject Details Table */}
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-xs uppercase">
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5 text-center">Final Mark (/20)</th>
                      <th className="p-2.5 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {studentReport.subjects?.map((sub, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-medium">
                          {sub.subjectName} ({sub.subjectCode})
                        </td>
                        <td className="p-2.5 text-center font-bold">
                          {sub.finalSubjectMark}
                        </td>
                        <td className="p-2.5 text-center font-semibold">
                          {sub.grade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-red-500">
                Failed to load details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportCard;
