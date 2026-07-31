import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Award, GraduationCap, BarChart2, EyeOff, Loader2 } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ems-backend-hazel.vercel.app";

const MarksView = () => {
  const [report, setReport] = useState({
    marks: [],
    totalScore: 0,
    average: "0.00",
    totalSubjects: 0,
  });
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("all");
  const [loading, setLoading] = useState(true);

  // Safely retrieve user & token
  const token = localStorage.getItem("token");
  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );
  const studentIdentifier = user._id || user.id;

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  // 1. Fetch sessions & filter for published ones only
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/exam-session`, {
          headers,
        });
        if (res.data?.success) {
          const published = (res.data.sessions || []).filter(
            (s) => s.isPublished,
          );
          setSessions(published);
        }
      } catch (err) {
        console.error("Error fetching exam sessions:", err);
      }
    };

    fetchSessions();
  }, [headers]);

  // 2. Fetch student report for selected session
  useEffect(() => {
    const fetchStudentReport = async () => {
      if (!studentIdentifier) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/mark/student/${studentIdentifier}/${selectedSession}`,
          { headers },
        );

        if (res.data?.success) {
          setReport({
            marks: res.data.marks || [],
            totalScore: res.data.totalScore || 0,
            average: res.data.average || "0.00",
            totalSubjects:
              res.data.totalSubjects || res.data.marks?.length || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching student marks report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentReport();
  }, [selectedSession, studentIdentifier, headers]);

  // Dynamic max score calculation baseline
  const maxPossibleScore = report.marks.reduce(
    (acc, m) => acc + (m.outOf || 20),
    0,
  );

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-teal-600 text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-7 w-7" /> Academic Results
          </h1>
          <p className="text-teal-100 text-sm">
            View published examination scores & grades
          </p>
        </div>
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="w-full md:w-auto p-2.5 bg-teal-700 text-white rounded-lg border border-teal-500 font-semibold outline-none focus:ring-2 focus:ring-teal-300"
        >
          <option value="all">All Published Sessions</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.sessionName}
            </option>
          ))}
        </select>
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
              {report.average} / 20
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
                <th className="p-3">Exam Session</th>
                <th className="p-3 text-center">Score Ratio</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">
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
                      {m.subjectId?.subjectName || "N/A"}
                    </td>
                    <td className="p-3 font-mono text-xs">
                      {m.subjectId?.subjectCode || "N/A"}
                    </td>
                    <td className="p-3 font-medium text-gray-600">
                      {m.examSessionId?.sessionName || "N/A"}
                    </td>
                    <td className="p-3 text-center font-bold text-teal-700 text-lg">
                      {m.score}{" "}
                      <span className="text-sm font-medium text-gray-500">
                        / {m.outOf || 20}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <EyeOff className="w-8 h-8 text-gray-400" />
                      <p className="font-semibold">
                        No published marks available yet.
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
