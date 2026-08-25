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
  const [semesters, setSemesters] = useState([]); // 👈 Semesters state
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(""); // 👈 Selected Semester
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [outOf, setOutOf] = useState(20);

  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // 1. Fetch Teacher's Assigned Classes & Active Semesters
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classRes, semRes] = await Promise.all([
          // Adjust endpoint to fetch assigned classes for the logged-in teacher
          axios.get(`${API_BASE_URL}/api/class/assigned`, { headers }),
          axios.get(`${API_BASE_URL}/api/semester`, { headers }),
        ]);

        if (classRes.data.success) {
          setClasses(classRes.data.classes || []);
        }
        if (semRes.data.success) {
          setSemesters(semRes.data.semesters || []);
        }
      } catch (err) {
        console.error("Error fetching initial dropdowns:", err);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Fetch Exam Sessions when Semester changes
  useEffect(() => {
    if (selectedSemester) {
      axios
        .get(`${API_BASE_URL}/api/exam-session/semester/${selectedSemester}`, {
          headers,
        })
        .then((res) => {
          if (res.data.success) setSessions(res.data.sessions || []);
        })
        .catch((err) =>
          console.error("Error fetching semester sessions:", err),
        );
    } else {
      setSessions([]);
    }
  }, [selectedSemester]);

  // 3. Fetch Subjects when Class changes
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

  // 4. Load Grid Marks Sheet
  const loadGrid = async () => {
    setErrorMsg("");
    if (
      !selectedClass ||
      !selectedSemester ||
      !selectedSession ||
      !selectedSubject
    ) {
      alert("Please select Class, Semester, Session, and Subject first!");
      return;
    }

    setLoadingGrid(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/mark/class-subject?classId=${selectedClass}&semesterId=${selectedSemester}&examSessionId=${selectedSession}&subjectId=${selectedSubject}`,
        { headers },
      );

      if (res.data.success) {
        const fetchedStudents = res.data.students || [];
        setStudents(fetchedStudents);

        if (fetchedStudents.length === 0) {
          setErrorMsg("No students enrolled in this class.");
        }

        if (res.data.outOf) setOutOf(Number(res.data.outOf));

        const map = {};
        (res.data.marks || []).forEach((m) => {
          const stId = m.studentId?._id || m.studentId;
          map[stId] = m.score;
        });
        setMarksMap(map);
      }
    } catch (err) {
      console.error("Error loading marks grid:", err);
      setErrorMsg(err.response?.data?.error || "Failed to load marks sheet.");
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
      alert(`Score cannot exceed max marks (/${outOf})`);
      return;
    }
    setMarksMap((prev) => ({ ...prev, [studentId]: rawValue }));
  };

  // 5. Save Batch Marks Payload
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
        classId: selectedClass,
        semesterId: selectedSemester, // 👈 Pass Semester ID
        examSessionId: selectedSession,
        subjectId: selectedSubject,
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
      console.error("Error saving marks:", err);
      alert(err.response?.data?.error || "Failed to save marks.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-teal-600 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-7 w-7" /> Teacher Marks Entry
          </h1>
          <p className="text-teal-100 text-sm">
            Enter marks for assigned classes filtered by semester and evaluation
            sessions
          </p>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Assigned Class Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Assigned Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className || c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="">Select Semester</option>
            {semesters.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name || s.semesterName}
              </option>
            ))}
          </select>
        </div>

        {/* Exam Session Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Evaluation Session
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            disabled={!selectedSemester}
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none disabled:opacity-50"
          >
            <option value="">Select Session</option>
            {sessions.map((se) => (
              <option key={se._id} value={se._id}>
                {se.sessionName}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedClass}
            className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none disabled:opacity-50"
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.subjectName || s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Scale Base Mark */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
            <Target className="w-4 h-4 text-teal-600" /> Max Score
          </label>
          <select
            value={outOf}
            onChange={(e) => setOutOf(Number(e.target.value))}
            className="w-full p-2.5 border border-teal-500 bg-teal-50 font-bold text-teal-800 rounded-lg outline-none"
          >
            <option value={20}>/ 20</option>
            <option value={30}>/ 30</option>
            <option value={40}>/ 40</option>
            <option value={50}>/ 50</option>
            <option value={100}>/ 100</option>
          </select>
        </div>

        <div className="md:col-span-5 pt-2">
          <button
            onClick={loadGrid}
            disabled={loadingGrid}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg shadow transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loadingGrid ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading Grid...
              </>
            ) : (
              "Load Student Sheet"
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Table Section */}
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
