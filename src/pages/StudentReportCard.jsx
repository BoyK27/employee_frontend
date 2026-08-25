import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import {
  FaPrint,
  FaAward,
  FaLock,
  FaSpinner,
  FaGraduationCap,
  FaExclamationCircle,
} from "react-icons/fa";

const StudentReportCard = () => {
  const { user } = useAuth();
  const reportRef = useRef();

  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch available semesters for student's class
  useEffect(() => {
    fetchAvailableSemesters();
  }, [user]);

  // Fetch report card when a semester is selected
  useEffect(() => {
    if (selectedSemester && user?._id) {
      fetchReportCard(selectedSemester);
    }
  }, [selectedSemester, user]);

  const fetchAvailableSemesters = async () => {
    try {
      const res = await axios.get(
        `https://ems-backend-hazel.vercel.app/api/semester/student/${user?._id || user?.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (res.data.success) {
        setSemesters(res.data.semesters || []);
        if (res.data.semesters?.length > 0) {
          // Default to most recent semester
          setSelectedSemester(res.data.semesters[0]._id);
        }
      }
    } catch (err) {
      console.error("Error fetching semesters:", err);
    }
  };

  const fetchReportCard = async (semesterId) => {
    setLoading(true);
    setError("");
    setReportCard(null);

    try {
      const studentId = user?._id || user?.id;
      const res = await axios.get(
        `https://ems-backend-hazel.vercel.app/api/report-card/student/${studentId}/semester/${semesterId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      if (res.data.success) {
        setReportCard(res.data.reportCard);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Semester report card unavailable or not yet published.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* Top Selector & Action Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaGraduationCap className="text-teal-600" /> Academic Report Card
          </h2>
          <p className="text-xs text-gray-500">
            Select an academic term to view official term results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 bg-gray-50 font-medium"
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.academicYear})
              </option>
            ))}
          </select>

          {reportCard && (
            <button
              onClick={handlePrint}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition"
            >
              <FaPrint /> Print Transcript
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-4xl mx-auto p-12 bg-white rounded-xl shadow-sm text-center text-gray-500 flex justify-center items-center gap-3">
          <FaSpinner className="animate-spin text-teal-600 text-2xl" />
          <span>Compiling Official Report Card...</span>
        </div>
      )}

      {/* Locked / Error State */}
      {!loading && error && (
        <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl shadow-md border-t-4 border-amber-500 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FaLock />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Report Card Unavailable
          </h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <span className="inline-block text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
            Contact Academic Administration
          </span>
        </div>
      )}

      {/* Formal Printable Report Card Sheet */}
      {!loading && reportCard && (
        <div
          ref={reportRef}
          className="max-w-4xl mx-auto bg-white p-8 md:p-10 shadow-lg border border-gray-300 rounded-sm font-serif print:shadow-none print:p-0 print:border-none print:w-full"
        >
          {/* Header & Institutional Letterhead */}
          <div className="border-b-4 border-double border-gray-900 pb-4 mb-6 text-center relative">
            <div className="uppercase tracking-wider font-extrabold text-2xl text-gray-900">
              EXCELLENCE ACADEMY HIGH SCHOOL
            </div>
            <p className="text-xs uppercase tracking-widest text-gray-600 font-sans mt-0.5">
              Government Approved • Department of Secondary Education
            </p>
            <p className="text-xs italic text-gray-500 font-sans">
              P.O. Box 1042, Bamenda, North West Region, Cameroon
            </p>

            <div className="mt-4 bg-gray-900 text-white py-1 uppercase text-sm font-sans font-bold tracking-widest rounded-xs">
              OFFICIAL ACADEMIC TRANSCRIPT & REPORT CARD
            </div>
          </div>

          {/* Student Profile Block */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 border border-gray-300 font-sans text-xs">
            <div>
              <span className="block text-gray-500 uppercase text-[10px] font-bold">
                Student Name:
              </span>
              <span className="font-bold text-gray-900 text-sm">
                {user?.name || "N/A"}
              </span>
            </div>
            <div>
              <span className="block text-gray-500 uppercase text-[10px] font-bold">
                Registration No:
              </span>
              <span className="font-bold text-gray-900 text-sm">
                {user?.registrationNumber || "STU-2026-004"}
              </span>
            </div>
            <div>
              <span className="block text-gray-500 uppercase text-[10px] font-bold">
                Academic Session:
              </span>
              <span className="font-bold text-gray-900 text-sm">
                {reportCard.academicYear}
              </span>
            </div>
            <div>
              <span className="block text-gray-500 uppercase text-[10px] font-bold">
                Term / Semester:
              </span>
              <span className="font-bold text-gray-900 text-sm">
                {reportCard.semesterName}
              </span>
            </div>
          </div>

          {/* Results Table */}
          <table className="w-full border-collapse border border-gray-900 font-sans text-xs mb-6">
            <thead>
              <tr className="bg-gray-200 text-gray-900 border-b border-gray-900 uppercase font-bold text-center">
                <th className="border border-gray-900 p-2 text-left">
                  Subject Title
                </th>
                <th className="border border-gray-900 p-2 w-20">Code</th>
                <th className="border border-gray-900 p-2 w-28">
                  Session Scores
                </th>
                <th className="border border-gray-900 p-2 w-24">
                  Weighted (/20)
                </th>
                <th className="border border-gray-900 p-2 w-16">Grade</th>
                <th className="border border-gray-900 p-2 text-left">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {reportCard.subjects?.map((sub, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-800 p-2 font-semibold text-gray-900">
                    {sub.subjectName}
                  </td>
                  <td className="border border-gray-800 p-2 text-center text-gray-600">
                    {sub.subjectCode}
                  </td>
                  <td className="border border-gray-800 p-1 text-center font-mono text-[11px]">
                    {sub.sessionBreakdown?.map((sb, i) => (
                      <div key={i}>
                        {sb.sessionName}: {sb.rawScore}/{sb.outOf}
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-800 p-2 text-center font-bold text-sm text-gray-900">
                    {sub.finalSubjectMark}
                  </td>
                  <td className="border border-gray-800 p-2 text-center font-bold">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] ${
                        sub.grade === "A"
                          ? "bg-green-100 text-green-900"
                          : sub.grade === "F"
                            ? "bg-red-100 text-red-900"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {sub.grade}
                    </span>
                  </td>
                  <td className="border border-gray-800 p-2 text-gray-600 italic">
                    {parseFloat(sub.finalSubjectMark) >= 16
                      ? "Excellent Mastery"
                      : parseFloat(sub.finalSubjectMark) >= 14
                        ? "Very Good Performance"
                        : parseFloat(sub.finalSubjectMark) >= 10
                          ? "Satisfactory Pass"
                          : "Needs Remedial Attention"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Academic Performance Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans mb-8">
            <div className="border border-gray-800 p-3 bg-teal-50/50 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-600">
                  Semester Overall Average
                </p>
                <p className="text-2xl font-black text-gray-900">
                  {reportCard.overallAverage}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-gray-500">
                  Status
                </span>
                <p className="text-xs font-bold text-green-700">PASS</p>
              </div>
            </div>

            <div className="border border-gray-800 p-3 bg-amber-50/50 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-600">
                  Class Position / Rank
                </p>
                <p className="text-2xl font-black text-amber-900">
                  {reportCard.rank}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-amber-800">
                  {reportCard.positionRatio}
                </p>
              </div>
            </div>

            <div className="border border-gray-800 p-3 bg-gray-50 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-600">
                  Overall Grade
                </p>
                <p className="text-2xl font-black text-gray-900">
                  {reportCard.overallGrade}
                </p>
              </div>
              <FaAward className="text-2xl text-amber-500" />
            </div>
          </div>

          {/* Grading System Key & Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs pt-4 border-t border-gray-300">
            {/* Legend */}
            <div>
              <p className="font-bold text-gray-800 uppercase mb-1 text-[10px]">
                Grading Key (/20 Scale):
              </p>
              <div className="grid grid-cols-2 gap-x-2 text-[11px] text-gray-600">
                <span>16 - 20: Grade A (Excellent)</span>
                <span>14 - 15.9: Grade B (Very Good)</span>
                <span>12 - 13.9: Grade C (Good)</span>
                <span>10 - 11.9: Grade D (Pass)</span>
                <span className="col-span-2 text-red-600">
                  Below 10.0: Grade F (Fail)
                </span>
              </div>
            </div>

            {/* Signature Blocks */}
            <div className="flex justify-between items-end pt-6 md:pt-0">
              <div className="text-center">
                <div className="w-32 border-b border-gray-800 mb-1"></div>
                <p className="text-[10px] uppercase font-bold text-gray-600">
                  Class Master
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 border-b border-gray-800 mb-1"></div>
                <p className="text-[10px] uppercase font-bold text-gray-600">
                  Principal Signature & Stamp
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentReportCard;
