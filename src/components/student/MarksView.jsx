import React, { useState, useEffect } from "react";
import axios from "axios";
import { Award, GraduationCap, BarChart2 } from "lucide-react";

const MarksView = () => {
  const [report, setReport] = useState({
    marks: [],
    totalScore: 0,
    average: "0.00",
  });
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("all");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios
      .get("https://ems-backend-hazel.vercel.app/api/exam-session", { headers })
      .then((res) => {
        if (res.data.success) setSessions(res.data.sessions);
      });
  }, []);

  useEffect(() => {
    const fetchStudentReport = async () => {
      try {
        const res = await axios.get(
          `https://ems-backend-hazel.vercel.app/api/mark/student/${user._id}/${selectedSession}`,
          { headers },
        );
        if (res.data.success) setReport(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user._id) fetchStudentReport();
  }, [selectedSession, user._id]);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-teal-600 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-7 w-7" /> Academic Results
          </h1>
          <p className="text-teal-100 text-sm">
            View your examination scores & grades
          </p>
        </div>
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="p-2.5 bg-teal-700 text-white rounded-lg border border-teal-500 font-semibold outline-none"
        >
          <option value="all">All Sessions</option>
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
              {report.totalScore}
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
              {report.totalSubjects || 0}
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
                <th className="p-3 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {report.marks.length > 0 ? (
                report.marks.map((m) => (
                  <tr
                    key={m._id}
                    className="border-b border-gray-100 hover:bg-teal-50/20"
                  >
                    <td className="p-3 font-semibold text-gray-800">
                      {m.subjectId?.subjectName}
                    </td>
                    <td className="p-3 font-mono text-xs">
                      {m.subjectId?.subjectCode}
                    </td>
                    <td className="p-3 font-medium text-gray-600">
                      {m.examSessionId?.sessionName}
                    </td>
                    <td className="p-3 text-center font-bold text-teal-700 text-lg">
                      {m.score}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    No examination marks published for this selection yet.
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
