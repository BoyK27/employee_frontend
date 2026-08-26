import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaGraduationCap, FaLock, FaPrint } from "react-icons/fa";

const API_BASE_URL = "https://ems-backend-hazel.vercel.app/api";

const StudentReportCard = () => {
  const { studentId } = useParams();

  const [semesters, setSemesters] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (selectedSemesterId && studentId) {
      fetchStudentReportCard(selectedSemesterId);
    } else {
      setReportCard(null);
    }
  }, [selectedSemesterId, studentId]);

  const fetchSemesters = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/semester`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const list = res.data.semesters || res.data.data || [];
        setSemesters(list);
        if (list.length > 0) {
          setSelectedSemesterId(list[0]._id);
        }
      }
    } catch (err) {
      setError("Failed to load academic semesters.");
    }
  };

  const fetchStudentReportCard = async (semesterId) => {
    setLoading(true);
    setError("");
    setReportCard(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication missing. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_BASE_URL}/report-card/student/${studentId}/semester/${semesterId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setReportCard(res.data.reportCard);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError(
          err.response?.data?.error ||
            "Report cards for this semester have not been published by administration yet.",
        );
      } else if (err.response?.status === 404) {
        setError("No report card data found for this semester.");
      } else {
        setError("Failed to retrieve report card information.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Extract unique session names dynamically across all subjects for table headers
  const getSessionHeaders = () => {
    if (!reportCard?.subjects) return [];
    const headers = new Set();
    reportCard.subjects.forEach((sub) => {
      sub.sessionBreakdown?.forEach((sb) => {
        headers.add(sb.sessionName);
      });
    });
    return Array.from(headers);
  };

  const sessionHeaders = getSessionHeaders();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 print:p-0 print:max-w-none print:w-full">
      {/* Interactive Controls Bar (Hidden during Print) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <FaGraduationCap className="text-slate-600 text-xl" />
          <span className="font-bold text-slate-700">Academic Semester:</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedSemesterId}
            onChange={(e) => setSelectedSemesterId(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-sm w-full sm:w-60"
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name || `Semester ${s.semesterNumber}`} ({s.academicYear})
              </option>
            ))}
          </select>

          {reportCard && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition"
            >
              <FaPrint /> Print
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg flex items-center gap-3 text-sm print:hidden">
          <FaLock className="text-amber-700 text-lg flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border text-slate-500 font-medium">
          Compiling student report card...
        </div>
      ) : reportCard ? (
        /* PRINTABLE FORMAL REPORT CARD CONTAINER */
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-slate-200 space-y-6 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full font-sans">
          {/* Top Decorative Graphic Header */}
          <div className="relative border-b-4 border-slate-600 pb-4 text-center">
            <div className="mx-auto w-12 h-12 mb-2 flex items-center justify-center text-slate-700 text-3xl font-bold">
              🎓
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-700 tracking-wider uppercase">
              STUDENT REPORT CARD
            </h1>
          </div>

          {/* Student Profile Info Block */}
          <div className="bg-[#E4ECEB] p-5 rounded-lg border border-[#C5D9D7] space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
              <div className="flex items-center gap-2 border-b border-[#C5D9D7] pb-1">
                <span className="font-bold text-slate-700 uppercase w-24">
                  NAME:
                </span>
                <span className="font-semibold text-slate-900 truncate">
                  {reportCard.name}
                </span>
              </div>
              <div className="flex items-center gap-2 border-b border-[#C5D9D7] pb-1">
                <span className="font-bold text-slate-700 uppercase w-32">
                  SCHOOL YEAR:
                </span>
                <span className="font-semibold text-slate-900">
                  {reportCard.academicYear || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 border-b border-[#C5D9D7] pb-1">
                <span className="font-bold text-slate-700 uppercase w-24">
                  REG NO:
                </span>
                <span className="font-semibold text-slate-900">
                  {reportCard.registrationNumber || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 border-b border-[#C5D9D7] pb-1">
                <span className="font-bold text-slate-700 uppercase w-32">
                  TERM:
                </span>
                <span className="font-semibold text-slate-900">
                  {reportCard.semesterName || "Semester"}
                </span>
              </div>
            </div>
          </div>

          {/* Main Subject & Assessment Breakdown Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase font-bold tracking-wider">
                  <th className="p-3 bg-[#5B6B8A] text-white rounded-tl-md w-2/5">
                    SUBJECT
                  </th>
                  {sessionHeaders.map((header, idx) => (
                    <th
                      key={idx}
                      className={`p-3 text-center text-slate-800 ${
                        idx % 2 === 0
                          ? "bg-[#7A839E] text-white"
                          : "bg-[#A1A8BD] text-white"
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                  <th className="p-3 bg-[#71AEA7] text-white text-center rounded-tr-md">
                    FINAL SCORE
                  </th>
                  <th className="p-3 bg-[#5B6B8A] text-white text-center">
                    GRADE
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm font-semibold">
                {reportCard.subjects?.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-800 uppercase border-l border-b border-slate-200">
                      {sub.subjectName}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {sub.subjectCode}
                      </span>
                    </td>

                    {/* Dynamic Session Breakdowns */}
                    {sessionHeaders.map((headerName, hIdx) => {
                      const sessionMatch = sub.sessionBreakdown?.find(
                        (sb) => sb.sessionName === headerName,
                      );
                      return (
                        <td
                          key={hIdx}
                          className="p-3 text-center text-slate-700 border-b border-slate-200 bg-slate-50/50"
                        >
                          {sessionMatch
                            ? `${sessionMatch.normalizedScore}/20`
                            : "-"}
                        </td>
                      );
                    })}

                    <td className="p-3 text-center font-bold text-teal-800 border-b border-slate-200 bg-[#EBF5F4]">
                      {sub.finalSubjectMark} / 20
                    </td>
                    <td className="p-3 text-center border-r border-b border-slate-200 text-slate-800 font-extrabold">
                      {sub.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Academic Summary Footer Box */}
          <div className="bg-[#E4ECEB] p-4 rounded-lg border border-[#C5D9D7] grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-bold text-slate-700">
            <div>
              OVERALL AVERAGE:{" "}
              <span className="text-teal-900 font-extrabold text-base ml-1">
                {reportCard.overallAverage} / 20
              </span>
            </div>
            <div>
              OVERALL GRADE:{" "}
              <span className="text-slate-900 font-extrabold text-base ml-1">
                {reportCard.overallGrade}
              </span>
            </div>
            <div>
              CLASS POSITION:{" "}
              <span className="text-slate-900 font-extrabold text-base ml-1">
                {reportCard.positionRatio || `#${reportCard.rank}`}
              </span>
            </div>
          </div>

          {/* Standard Institutional Footer */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">
                EMS Academic Portal
              </p>
              <p>
                Generated automatically via official school database records.
              </p>
            </div>
            <div className="border-2 border-dashed border-slate-300 p-2 text-center rounded text-[10px] font-bold uppercase text-slate-400">
              OFFICIAL SEAL / SIGNATURE
            </div>
          </div>
        </div>
      ) : !selectedSemesterId ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border text-slate-500">
          Please select a semester to load the report card.
        </div>
      ) : null}
    </div>
  );
};

export default StudentReportCard;
