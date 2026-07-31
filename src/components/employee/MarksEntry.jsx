import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Save,
  FileSpreadsheet,
  Target,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ems-backend-hazel.vercel.app";

const MarksEntry = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [outOf, setOutOf] = useState(20);

  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [clsRes, sessRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/class`, { headers }),
          axios.get(`${API_BASE_URL}/api/exam-session`, { headers }),
        ]);
        if (clsRes.data.success) setClasses(clsRes.data.classes || []);
        if (sessRes.data.success) setSessions(sessRes.data.sessions || []);
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      axios
        .get(`${API_BASE_URL}/api/subject/class/${selectedClass}`, { headers })
        .then((res) => {
          if (res.data.success) setSubjects(res.data.subjects || []);
        })
        .catch((err) => console.error("Error fetching class subjects:", err));
    } else {
      setSubjects([]);
    }
  }, [selectedClass]);

  const loadGrid = async () => {
    setErrorMsg("");
    if (!selectedClass || !selectedSubject || !selectedSession) {
      alert("Please select Class, Subject, and Session first!");
      return;
    }

    setLoadingGrid(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/mark/class-subject?classId=${selectedClass}&subjectId=${selectedSubject}&examSessionId=${selectedSession}`,
        { headers },
      );

      console.log("[MarksEntry loadGrid Response]:", res.data);

      if (res.data.success) {
        const fetchedStudents = res.data.students || [];
        setStudents(fetchedStudents);

        if (fetchedStudents.length === 0) {
          setErrorMsg(
            "No students are enrolled/assigned to this selected Class.",
          );
        }

        if (res.data.outOf) setOutOf(Number(res.data.outOf));

        const map = {};
        (res.data.marks || []).forEach((m) => {
          // Map marks by student ID string
          const stId = m.studentId?._id || m.studentId;
          map[stId] = m.score;
        });
        setMarksMap(map);
      }
    } catch (err) {
      console.error("Error loading marks grid:", err.response || err);
      setErrorMsg(
        err.response?.data?.error ||
          "Failed to load student sheet from backend.",
      );
    } finally {
      setLoadingGrid(false);
    }
  };

  const handleScoreChange = (studentId, rawValue) => {
    if (rawValue === "") {
      setMarksMap((prev) => ({ ...prev, [studentId]: "" }));
      return;
    }

    const numScore = Number(rawValue);
    if (numScore > outOf) {
      alert(`Score cannot exceed total marks (/${outOf})`);
      return;
    }
    setMarksMap((prev) => ({ ...prev, [studentId]: rawValue }));
  };

  const handleSaveMarks = async () => {
    if (students.length === 0) return;
    setSaving(true);

    const marksPayload = students.map((st) => {
      const rawScore = marksMap[st._id];
      const parsedScore =
        rawScore === "" || rawScore === undefined || isNaN(Number(rawScore))
          ? 0
          : Number(rawScore);

      return {
        studentId: st._id,
        subjectId: selectedSubject,
        classId: selectedClass,
        examSessionId: selectedSession,
        score: Math.min(parsedScore, Number(outOf)),
        outOf: Number(outOf) || 20,
      };
    });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/mark/save`,
        { marks: marksPayload },
        { headers },
      );
      if (res.data.success) {
        alert(`Marks saved successfully (Scale /${outOf})!`);
      }
    } catch (err) {
      console.error("Error saving marks:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to save marks");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-teal-600 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-7 w-7" /> Marks Entry Portal
          </h1>
          <p className="text-teal-100 text-sm">
            Enter evaluation scores with precise max mark scales
          </p>
        </div>
      </div>

      {/* Selector Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Select Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-gray-50 outline-none"
          >
            <option value="">Choose Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className || c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Select Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-gray-50 outline-none"
          >
            <option value="">Choose Subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.subjectName || s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Exam Session
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-gray-50 outline-none"
          >
            <option value="">Choose Evaluation Session</option>
            {sessions.map((se) => (
              <option key={se._id} value={se._id}>
                {se.sessionName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
            <Target className="w-4 h-4 text-teal-600" /> Evaluation Base Mark
          </label>
          <select
            value={outOf}
            onChange={(e) => setOutOf(Number(e.target.value))}
            className="w-full p-2.5 border border-teal-500 bg-teal-50 font-bold text-teal-800 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value={20}>Score / 20</option>
            <option value={30}>Score / 30</option>
            <option value={40}>Score / 40</option>
            <option value={50}>Score / 50</option>
            <option value={100}>Score / 100</option>
          </select>
        </div>

        <div className="md:col-span-4 pt-2">
          <button
            onClick={loadGrid}
            disabled={loadingGrid}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg shadow transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loadingGrid ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading Sheet...
              </>
            ) : (
              "Load Student Sheet"
            )}
          </button>
        </div>
      </div>

      {/* Error / Empty Notification Banner */}
      {errorMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Marks Sheet Table */}
      {students.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">
              Enrolled Students ({students.length})
            </h2>
            <button
              onClick={handleSaveMarks}
              disabled={saving}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-lg shadow flex items-center gap-2 transition-all active:scale-95"
            >
              <Save size={18} /> {saving ? "Saving..." : "Save Marks"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase bg-gray-50">
                  <th className="p-3">Matricule / ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3 text-center">Score (Max: /{outOf})</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr
                    key={st._id}
                    className="border-b border-gray-100 hover:bg-teal-50/20 transition-colors"
                  >
                    <td className="p-3 font-mono text-sm">{st.studentId}</td>
                    <td className="p-3 font-semibold text-gray-800">
                      {st.userId?.name || "N/A"}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={outOf}
                          value={marksMap[st._id] ?? ""}
                          onChange={(e) =>
                            handleScoreChange(st._id, e.target.value)
                          }
                          placeholder="0"
                          className="w-24 p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-bold text-teal-700 bg-gray-50 focus:bg-white"
                        />
                        <span className="font-semibold text-gray-500">
                          / {outOf}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksEntry;
