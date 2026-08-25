import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Award, GraduationCap, BarChart2, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../context/authContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ems-backend-hazel.vercel.app";

const MarksView = () => {
  const { id: urlStudentId } = useParams();
  const { user } = useAuth();

  const [report, setReport] = useState({
    marks: [],
    totalScore: 0,
    average: "0.00",
    totalSubjects: 0,
  });

  const [semesters, setSemesters] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedSession, setSelectedSession] = useState("all");
  const [loading, setLoading] = useState(true);

  // Helper to fetch authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // 1. Fetch Semesters list on mount
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const headers = getAuthHeaders();
        const semRes = await axios.get(`${API_BASE_URL}/api/semester`, {
          headers,
        });

        if (semRes.data?.success) {
          setSemesters(semRes.data.semesters || semRes.data.data || []);
        }
      } catch (err) {
        console.error("[MarksView] Error fetching semesters:", err);
      }
    };

    fetchSemesters();
  }, []);

  // 2. Dynamically fetch Exam Sessions whenever selectedSemester changes
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const headers = getAuthHeaders();
        const queryParams = new URLSearchParams();
        if (selectedSemester !== "all") {
          queryParams.append("semesterId", selectedSemester);
        }

        const endpoint = `${API_BASE_URL}/api/exam-session?${queryParams.toString()}`;
        const sessRes = await axios.get(endpoint, { headers });

        if (sessRes.data?.success) {
          const allSessions = sessRes.data.sessions || sessRes.data.data || [];
          const published = allSessions.filter((s) => s.isPublished);
          setSessions(published);

          // Reset session filter if previously selected session isn't in the new list
          if (!published.some((s) => s._id === selectedSession)) {
            setSelectedSession("all");
          }
        }
      } catch (err) {
        console.error("[MarksView] Error fetching sessions for semester:", err);
      }
    };

    fetchSessions();
  }, [selectedSemester]);

  // 3. Fetch Student Report when filters or target student change
  useEffect(() => {
    const fetchStudentReport = async () => {
      setLoading(true);

      try {
        const headers = getAuthHeaders();
        let targetStudentId = urlStudentId;

        if (!targetStudentId) {
          let localUser = {};
          try {
            localUser = JSON.parse(localStorage.getItem("user") || "{}");
          } catch (e) {
            console.error("[MarksView] Error parsing local storage user", e);
          }

          const currentUserId =
            user?._id || user?.id || localUser._id || localUser.id;

          if (currentUserId) {
            try {
              const studentProfileRes = await axios.get(
                `${API_BASE_URL}/api/student/user/${currentUserId}`,
                { headers },
              );
              if (
                studentProfileRes.data?.success &&
                studentProfileRes.data.student
              ) {
                targetStudentId = studentProfileRes.data.student._id;
              } else {
                targetStudentId = currentUserId;
              }
            } catch (err) {
              targetStudentId = currentUserId;
            }
          }
        }

        if (!targetStudentId) {
          console.warn("[MarksView] Missing valid student identifier.");
          setLoading(false);
          return;
        }

        const queryParams = new URLSearchParams();
        if (selectedSemester !== "all") {
          queryParams.append("semesterId", selectedSemester);
        }

        const endpoint = `${API_BASE_URL}/api/mark/student/${targetStudentId}/${selectedSession}?${queryParams.toString()}`;
        const res = await axios.get(endpoint, { headers });

        if (res.data?.success) {
          const marksList = res.data.marks || [];
          const computedTotalScore =
            res.data.totalScore ??
            marksList.reduce((acc, m) => acc + (m.score || m.mark || 0), 0);

          setReport({
            marks: marksList,
            totalScore: parseFloat(computedTotalScore.toFixed(2)),
            average: res.data.average || "0.00",
            totalSubjects:
              res.data.totalSubjects ||
              new Set(marksList.map((m) => m.subjectId?._id || m.subjectId))
                .size ||
              marksList.length,
          });
        }
      } catch (err) {
        console.error("[MarksView] Error fetching student marks report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentReport();
  }, [selectedSemester, selectedSession, urlStudentId, user]);

  // Dynamic score scale calculations
  const maxPossibleScore = report.marks.reduce(
    (acc, m) => acc + (m.outOf || m.maxScore || 20),
    0,
  );

  const calculatedNormalizedAverage =
    maxPossibleScore > 0
      ? ((report.totalScore / maxPossibleScore) * 20).toFixed(2)
      : report.average || "0.00";

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-teal-600 text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-7 w-7" /> Academic Results
          </h1>
          <p className="text-teal-100 text-sm">
            View published examination scores & grades by semester and session
          </p>
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Semester Filter */}
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full sm:w-auto p-2.5 bg-teal-700 text-white rounded-lg border border-teal-500 font-semibold outline-none focus:ring-2 focus:ring-teal-300 cursor-pointer text-sm"
          >
            <option value="all">All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.name ||
                  sem.semesterName ||
                  `Semester ${sem.semesterNumber}`}
              </option>
            ))}
          </select>

          {/* Exam Session Filter */}
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full sm:w-auto p-2.5 bg-teal-700 text-white rounded-lg border border-teal-500 font-semibold outline-none focus:ring-2 focus:ring-teal-300 cursor-pointer text-sm"
          >
            <option value="all">All Published Sessions</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.sessionName || s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
            <Award size={32} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">
              Overall Average
            </p>
            <p className="text-2xl font-extrabold text-teal-600">
              {calculatedNormalizedAverage} / 20
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <BarChart2 size={32} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Total Score</p>
            <p className="text-2xl font-extrabold text-blue-600">
              {report.totalScore}{" "}
              <span className="text-sm font-semibold text-gray-400">
                / {maxPossibleScore}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
            <GraduationCap size={32} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">
              Evaluated Subjects
            </p>
            <p className="text-2xl font-extrabold text-purple-600">
              {report.totalSubjects}
            </p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Subject Marks Breakdown
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase bg-gray-50">
                <th className="p-3">Subject</th>
                <th className="p-3">Code</th>
                <th className="p-3">Semester</th>
                <th className="p-3">Exam Session</th>
                <th className="p-3 text-center">Score Ratio</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-7 h-7 text-teal-600 animate-spin" />
                      <p className="text-sm font-semibold">
                        Fetching academic report...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : report.marks.length > 0 ? (
                report.marks.map((m) => (
                  <tr
                    key={m._id}
                    className="border-b border-gray-100 hover:bg-teal-50/20 transition-colors"
                  >
                    <td className="p-3 font-semibold text-gray-800">
                      {m.subjectId?.subjectName ||
                        m.subjectId?.name ||
                        m.subjectName ||
                        "N/A"}
                    </td>
                    <td className="p-3 font-mono text-xs text-gray-600">
                      {m.subjectId?.subjectCode ||
                        m.subjectId?.code ||
                        m.subjectCode ||
                        "N/A"}
                    </td>
                    <td className="p-3 font-medium text-gray-600">
                      {m.semesterId?.name ||
                        m.semesterId?.semesterName ||
                        "N/A"}
                    </td>
                    <td className="p-3 font-medium text-gray-600">
                      {m.examSessionId?.sessionName || m.sessionName || "N/A"}
                    </td>
                    <td className="p-3 text-center font-bold text-teal-700 text-lg">
                      {m.score ?? m.mark ?? 0}{" "}
                      <span className="text-sm font-medium text-gray-500">
                        / {m.outOf || m.maxScore || 20}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <EyeOff className="w-8 h-8 text-gray-400" />
                      <p className="font-semibold">
                        No published marks available yet for the selected
                        filters.
                      </p>
                      <p className="text-xs text-gray-400">
                        If marks were recently submitted, please ensure the
                        Administrator has published the Exam Session.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarksView;
