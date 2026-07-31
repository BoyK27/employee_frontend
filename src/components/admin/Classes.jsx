import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, BookOpen } from "lucide-react";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({ className: "", code: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        "https://ems-backend-hazel.vercel.app/api/class",
        { headers },
      );
      if (res.data.success) setClasses(res.data.classes);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(
          `https://ems-backend-hazel.vercel.app/api/class/${editId}`,
          formData,
          { headers },
        );
      } else {
        await axios.post(
          "https://ems-backend-hazel.vercel.app/api/class/add",
          formData,
          { headers },
        );
      }
      setFormData({ className: "", code: "" });
      setEditId(null);
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.error || "Error saving class");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cls) => {
    setEditId(cls._id);
    setFormData({ className: cls.className, code: cls.code });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await axios.delete(
        `https://ems-backend-hazel.vercel.app/api/class/${id}`,
        { headers },
      );
      fetchClasses();
    } catch (err) {
      alert("Failed to delete class");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-teal-600 text-white p-6 rounded-xl shadow-md">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-7 w-7" /> Manage Classes
          </h1>
          <p className="text-teal-100 text-sm">
            Add and organize academic classes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {editId ? "Edit Class" : "Add New Class"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Class Name
              </label>
              <input
                type="text"
                value={formData.className}
                onChange={(e) =>
                  setFormData({ ...formData, className: e.target.value })
                }
                placeholder="e.g. Form 5 Science / Software Eng 3"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Class Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g. F5-SCI or SE-300"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg shadow transition-all"
              >
                {editId ? "Update Class" : "Add Class"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setFormData({ className: "", code: "" });
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Classes Table */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Existing Classes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase bg-gray-50">
                  <th className="p-3">#</th>
                  <th className="p-3">Class Name</th>
                  <th className="p-3">Code</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.length > 0 ? (
                  classes.map((cls, index) => (
                    <tr
                      key={cls._id}
                      className="border-b border-gray-100 hover:bg-teal-50/30 transition-colors"
                    >
                      <td className="p-3 text-gray-600 font-medium">
                        {index + 1}
                      </td>
                      <td className="p-3 font-semibold text-gray-800">
                        {cls.className}
                      </td>
                      <td className="p-3">
                        <span className="bg-teal-100 text-teal-800 font-semibold text-xs px-2.5 py-1 rounded-full">
                          {cls.code}
                        </span>
                      </td>
                      <td className="p-3 flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(cls)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cls._id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      No classes found. Add one above!
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

export default Classes;
