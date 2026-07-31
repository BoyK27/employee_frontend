import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookMarked, Edit2, Trash2 } from "lucide-react";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    classId: "",
  });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [subRes, clsRes] = await Promise.all([
        axios.get("https://ems-backend-hazel.vercel.app/api/subject", {
          headers,
        }),
        axios.get("https://ems-backend-hazel.vercel.app/api/class", {
          headers,
        }),
      ]);
      if (subRes.data.success) setSubjects(subRes.data.subjects);
      if (clsRes.data.success) setClasses(clsRes.data.classes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `https://ems-backend-hazel.vercel.app/api/subject/${editId}`,
          formData,
          { headers },
        );
      } else {
        await axios.post(
          "https://ems-backend-hazel.vercel.app/api/subject/add",
          formData,
          { headers },
        );
      }
      setFormData({ subjectName: "", subjectCode: "", classId: "" });
      setEditId(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error saving subject");
    }
  };

  const handleEdit = (subj) => {
    setEditId(subj._id);
    setFormData({
      subjectName: subj.subjectName,
      subjectCode: subj.subjectCode,
      classId: subj.classId?._id || subj.classId || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      await axios.delete(
        `https://ems-backend-hazel.vercel.app/api/subject/${id}`,
        { headers },
      );
      fetchData();
    } catch (err) {
      alert("Failed to delete subject");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-teal-600 text-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookMarked className="h-7 w-7" /> Manage Subjects
        </h1>
        <p className="text-teal-100 text-sm">
          Define subjects and link them to classes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {editId ? "Edit Subject" : "Add New Subject"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Subject Name
              </label>
              <input
                type="text"
                value={formData.subjectName}
                onChange={(e) =>
                  setFormData({ ...formData, subjectName: e.target.value })
                }
                placeholder="e.g. Mathematics"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                value={formData.subjectCode}
                onChange={(e) =>
                  setFormData({ ...formData, subjectCode: e.target.value })
                }
                placeholder="e.g. MATH-101"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Assigned Class
              </label>
              <select
                value={formData.classId}
                onChange={(e) =>
                  setFormData({ ...formData, classId: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50"
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className} ({cls.code})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg shadow transition-all"
            >
              {editId ? "Update Subject" : "Add Subject"}
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Subjects List
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase bg-gray-50">
                  <th className="p-3">Subject</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Class</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subj) => (
                  <tr
                    key={subj._id}
                    className="border-b border-gray-100 hover:bg-teal-50/30"
                  >
                    <td className="p-3 font-semibold text-gray-800">
                      {subj.subjectName}
                    </td>
                    <td className="p-3 font-mono text-xs">
                      {subj.subjectCode}
                    </td>
                    <td className="p-3">
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
                        {subj.classId?.className || "Unassigned"}
                      </span>
                    </td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(subj)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(subj._id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
