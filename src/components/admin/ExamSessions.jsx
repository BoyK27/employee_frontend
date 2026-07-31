import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Plus, Trash2, Eye, EyeOff } from "lucide-react";

const ExamSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSessions = async () => {
    try {
      const res = await axios.get(
        "https://ems-backend-hazel.vercel.app/api/exam-session",
        { headers },
      );
      if (res.data.success) setSessions(res.data.sessions);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionName.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "https://ems-backend-hazel.vercel.app/api/exam-session/add",
        { sessionName, isPublished },
        { headers },
      );
      if (res.data.success) {
        setSessionName("");
        setIsPublished(false);
        fetchSessions();
      }
    } catch (err) {
      alert(err.response?.data?.error || "Error adding exam session");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const res = await axios.put(
        `https://ems-backend-hazel.vercel.app/api/exam-session/publish/${id}`,
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;
    try {
      await axios.delete(
        `https://ems-backend-hazel.vercel.app/api/exam-session/${id}`,
        { headers },
      );
      fetchSessions();
    } catch (err) {
      alert("Failed to delete exam session");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-teal-600 text-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-7 w-7" /> Exam Sessions & Evaluation Periods
        </h1>
        <p className="text-teal-100 text-sm">
          Create evaluation sessions and manage mark visibility for students
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Session Form */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="text-teal-600" size={20} /> Add Exam Session
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Session Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g. CA 1, Mid-Term, Final Exams"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 transition-all"
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
                          onClick={() => handleDelete(sess._id)}
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
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      No exam sessions configured yet. Create one on the left!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSessions;
