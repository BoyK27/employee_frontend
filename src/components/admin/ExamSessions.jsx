import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Plus, Trash2, Eye, EyeOff, Layers } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ems-backend-hazel.vercel.app";

const ExamSessions = () => {
  const [activeTab, setActiveTab] = useState("sessions"); // "sessions" | "semesters"
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  // Session Form State
  const [sessionName, setSessionName] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [selectedClassForSession, setSelectedClassForSession] = useState("");
  const [semestersForSession, setSemestersForSession] = useState([]);
  const [selectedSemesterForSession, setSelectedSemesterForSession] =
    useState("");

  // Semester Form State
  const [semesterName, setSemesterName] = useState("");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [selectedClass, setSelectedClass] = useState("");

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchSessions();
    fetchClasses();
  }, []);

  // Fetch semesters when Class selection changes in Tab 2 (Manage Semesters)
  useEffect(() => {
    if (selectedClass) {
      fetchSemestersByClass(selectedClass).then((data) => setSemesters(data));
    } else {
      setSemesters([]);
    }
  }, [selectedClass]);

  // Fetch semesters when Class selection changes in Tab 1 (Create Exam Session)
  useEffect(() => {
    setSelectedSemesterForSession("");
    if (selectedClassForSession) {
      fetchSemestersByClass(selectedClassForSession).then((data) =>
        setSemestersForSession(data),
      );
    } else {
      setSemestersForSession([]);
    }
  }, [selectedClassForSession]);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/exam-session`, {
        headers,
      });
      if (res.data.success)
        setSessions(res.data.sessions || res.data.examSessions || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/class`, { headers });
      if (res.data.success) setClasses(res.data.classes || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const fetchSemestersByClass = async (classId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/semester/class/${classId}`,
        { headers },
      );
      if (res.data.success) return res.data.semesters || [];
    } catch (err) {
      console.error("Error fetching semesters:", err);
    }
    return [];
  };

  // Submit Exam Session with mandatory semester link
  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    if (!sessionName.trim() || !selectedSemesterForSession) {
      alert("Please enter a session name and select a semester.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/exam-session/add`,
        {
          sessionName,
          isPublished,
          semesterId: selectedSemesterForSession,
        },
        { headers },
      );
      if (res.data.success) {
        setSessionName("");
        setIsPublished(false);
        setSelectedClassForSession("");
        setSelectedSemesterForSession("");
        fetchSessions();
      }
    } catch (err) {
      alert(err.response?.data?.error || "Error adding exam session");
    } finally {
      setLoading(false);
    }
  };

  // Submit New Semester
  const handleSemesterSubmit = async (e) => {
    e.preventDefault();
    if (!semesterName.trim() || !selectedClass) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/semester/add`,
        {
          name: semesterName,
          academicYear,
          classId: selectedClass,
        },
        { headers },
      );
      if (res.data.success) {
        setSemesterName("");
        fetchSemestersByClass(selectedClass).then((data) => setSemesters(data));
      }
    } catch (err) {
      alert(err.response?.data?.error || "Error adding semester");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/exam-session/publish/${id}`,
        {},
        { headers },
      );
      if (res.data.success) {
        fetchSessions();
      }
    } catch (err) {
      alert("Failed to update publication status");
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;
    try {
      await axios.delete(`${API_BASE_URL}/api/exam-session/${id}`, {
        headers,
      });
      fetchSessions();
    } catch (err) {
      alert("Failed to delete exam session");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-teal-600 text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-7 w-7" /> Semesters & Exam Evaluation Periods
          </h1>
          <p className="text-teal-100 text-sm">
            Group exam evaluation sessions into academic terms and report card
            semesters
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-teal-700/60 p-1 rounded-lg self-start md:self-auto">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 rounded-md font-semibold text-xs transition ${
              activeTab === "sessions"
                ? "bg-white text-teal-800 shadow-sm"
                : "text-white hover:bg-teal-600"
            }`}
          >
            Exam Sessions
          </button>
          <button
            onClick={() => setActiveTab("semesters")}
            className={`px-4 py-2 rounded-md font-semibold text-xs transition ${
              activeTab === "semesters"
                ? "bg-white text-teal-800 shadow-sm"
                : "text-white hover:bg-teal-600"
            }`}
          >
            Manage Semesters
          </button>
        </div>
      </div>

      {/* --- TAB 1: EXAM SESSIONS MANAGEMENT --- */}
      {activeTab === "sessions" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Session Form */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="text-teal-600" size={20} /> Add Exam Session
            </h2>
            <form onSubmit={handleSessionSubmit} className="space-y-4">
              {/* Step 1: Pick Class */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Target Class
                </label>
                <select
                  value={selectedClassForSession}
                  onChange={(e) => setSelectedClassForSession(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm bg-gray-50 outline-none"
                  required
                >
                  <option value="">-- Choose Class --</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.className || c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Pick Semester */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Target Semester
                </label>
                <select
                  value={selectedSemesterForSession}
                  onChange={(e) =>
                    setSelectedSemesterForSession(e.target.value)
                  }
                  disabled={!selectedClassForSession}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm bg-gray-50 outline-none disabled:opacity-50"
                  required
                >
                  <option value="">-- Choose Semester --</option>
                  {semestersForSession.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.academicYear})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Session Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g. CA 1, Mid-Term, Final Exam"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm outline-none bg-gray-50"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <label
                  htmlFor="isPublished"
                  className="text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  Publish results immediately
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-lg font-bold text-white shadow-md transition-all active:scale-95 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {loading ? "Creating..." : "Save Session"}
              </button>
            </form>
          </div>

          {/* Existing Sessions Table */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Configured Exam Sessions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase bg-gray-50">
                    <th className="p-3">#</th>
                    <th className="p-3">Session Name</th>
                    <th className="p-3">Linked Semester</th>
                    <th className="p-3 text-center">Result Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.length > 0 ? (
                    sessions.map((sess, index) => (
                      <tr
                        key={sess._id}
                        className="border-b border-gray-100 hover:bg-teal-50/20 transition-colors"
                      >
                        <td className="p-3 text-gray-500 font-medium">
                          {index + 1}
                        </td>
                        <td className="p-3 font-semibold text-gray-800">
                          {sess.sessionName}
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {sess.semesterId?.name ? (
                            <span className="bg-teal-50 text-teal-700 font-semibold px-2.5 py-1 rounded-md border border-teal-100">
                              {sess.semesterId.name}
                            </span>
                          ) : (
                            <span className="text-amber-500 italic">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleTogglePublish(sess._id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                              sess.isPublished
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            }`}
                          >
                            {sess.isPublished ? (
                              <>
                                <Eye size={14} /> Published
                              </>
                            ) : (
                              <>
                                <EyeOff size={14} /> Hidden (Draft)
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteSession(sess._id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete Session"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-6 text-gray-500">
                        No exam sessions configured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: SEMESTER CONFIGURATION --- */}
      {activeTab === "semesters" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Semester Form */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Layers className="text-teal-600" size={20} /> Create Class
              Semester
            </h2>
            <form onSubmit={handleSemesterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Target Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm bg-gray-50"
                  required
                >
                  <option value="">-- Choose Class --</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.className || c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Semester Name
                </label>
                <input
                  type="text"
                  value={semesterName}
                  onChange={(e) => setSemesterName(e.target.value)}
                  placeholder="e.g. First Semester, Term 1"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm outline-none bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm outline-none bg-gray-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-lg font-bold text-white shadow-md transition-all active:scale-95 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {loading ? "Saving..." : "Create Semester"}
              </button>
            </form>
          </div>

          {/* Existing Semesters Table */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Configured Class Semesters
            </h2>

            {!selectedClass ? (
              <div className="p-8 text-center text-gray-500 border border-dashed rounded-lg">
                Please select a Class on the left to view its configured report
                card semesters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase bg-gray-50">
                      <th className="p-3">#</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3">Academic Year</th>
                      <th className="p-3 text-center">Report Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesters.length > 0 ? (
                      semesters.map((sem, index) => (
                        <tr
                          key={sem._id}
                          className="border-b border-gray-100 hover:bg-teal-50/20 transition-colors"
                        >
                          <td className="p-3 text-gray-500 font-medium">
                            {index + 1}
                          </td>
                          <td className="p-3 font-semibold text-gray-800">
                            {sem.name}
                          </td>
                          <td className="p-3 text-gray-600 text-sm">
                            {sem.academicYear}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                sem.isReportCardPublished
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {sem.isReportCardPublished
                                ? "Published"
                                : "Draft"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center p-6 text-gray-500"
                        >
                          No semesters configured for this class yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSessions;
