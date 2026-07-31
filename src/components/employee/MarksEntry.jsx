import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, Save, FileSpreadsheet } from "lucide-react";

const MarksEntry = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSession, setSelectedSession] = useState("");

  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [clsRes, sessRes] = await Promise.all([
          axios.get("https://ems-backend-hazel.vercel.app/api/class", {
            headers,
          }),
          axios.get("https://ems-backend-hazel.vercel.app/api/exam-session", {
            headers,
          }),
        ]);
        if (clsRes.data.success) setClasses(clsRes.data.classes);
        if (sessRes.data.success) setSessions(sessRes.data.sessions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      axios
        .get(
          `https://ems-backend-hazel.vercel.app/api/subject/class/${selectedClass}`,
          { headers },
        )
        .then((res) => {
          if (res.data.success) setSubjects(res.data.subjects);
        });
    }
  }, [selectedClass]);

  const loadGrid = async () => {
    if (!selectedClass || !selectedSubject || !selectedSession) {
      alert("Please select Class, Subject, and Session first!");
      return;
    }

    try {
      const res = await axios.get(
        `https://ems-backend-hazel.vercel.app/api/mark/class/${selectedClass}/subject/${selectedSubject}/session/${selectedSession}`,
        { headers },
      );

      if (res.data.success) {
        setStudents(res.data.students);
        const map = {};
        res.data.marks.forEach((m) => {
          map[m.studentId] = m.score;
        });
        setMarksMap(map);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScoreChange = (studentId, score) => {
    setMarksMap((prev) => ({ ...prev, [studentId]: score }));
  };

  const handleSaveMarks = async () => {
    setSaving(true);
    const marksPayload = Object.keys(marksMap).map((studentId) => ({
      studentId,
      subjectId: selectedSubject,
      classId: selectedClass,
      examSessionId: selectedSession,
      score: marksMap[studentId] || 0,
    }));

    try {
      const res = await axios.post(
        "https://ems-backend-hazel.vercel.app/api/mark/save",
        { marks: marksPayload },
        { headers },
      );
      if (res.data.success) alert("Marks saved successfully!");
    } catch (err) {
      alert("Failed to save marks");
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
            Enter or update student marks seamlessly
          </p>
        </div>
      </div>

      {/* Selector Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Select Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-gray-50"
          >
            <option value="">Choose Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className}
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
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-gray-50"
          >
            <option value="">Choose Subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.subjectName}
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
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-gray-50"
          >
            <option value="">Choose Evaluation Session</option>
            {sessions.map((se) => (
              <option key={se._id} value={se._id}>
                {se.sessionName}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 pt-2">
          <button
            onClick={loadGrid}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg shadow transition-all"
          >
            Load Student Sheet
          </button>
        </div>
      </div>

      {/* Marks Sheet */}
      {students.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">
              Enrolled Students ({students.length})
            </h2>
            <button
              onClick={handleSaveMarks}
              disabled={saving}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-lg shadow flex items-center gap-2"
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
                  <th className="p-3 text-center">Score (/20 or /100)</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr
                    key={st._id}
                    className="border-b border-gray-100 hover:bg-teal-50/20"
                  >
                    <td className="p-3 font-mono text-sm">{st.studentId}</td>
                    <td className="p-3 font-semibold text-gray-800">
                      {st.userId?.name}
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={marksMap[st._id] ?? ""}
                        onChange={(e) =>
                          handleScoreChange(st._id, e.target.value)
                        }
                        placeholder="0"
                        className="w-24 p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-bold text-teal-700 bg-gray-50"
                      />
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
