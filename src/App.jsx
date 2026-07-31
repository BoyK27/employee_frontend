import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// Role & Auth Guards
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";

// Dashboard Summary Components
import AdminSummary from "./components/dashboard/AdminSummary";

// Department Components
import DepartmentList from "./components/departments/DepartmentList";
import AddDepartment from "./components/departments/AddDepartment";
import EditDepartment from "./components/departments/EditDepartment";

// Academic & Examination Components (NEW)
import Classes from "./components/admin/Classes";
import Subjects from "./components/admin/Subjects";
import ExamSessions from "./components/admin/ExamSessions";
import MarksEntry from "./components/employee/MarksEntry";
import MarksView from "./components/student/MarksView";

// Employee Components
import EmployeeList from "./components/employee/List";
import AddEmployee from "./components/employee/Add";
import ViewEmployee from "./components/employee/View";
import EditEmployee from "./components/employee/Edit";

// Student Components
import StudentList from "./components/student/List";
import AddStudent from "./components/student/Add";
import ViewStudent from "./components/student/View";
import EditStudent from "./components/student/Edit";

// Leave Components (Employee)
import LeaveList from "./components/leaves/List";
import AddLeave from "./components/leaves/Add";
import LeaveDetail from "./components/leaves/Details";

// Student Leave Components
import StudentLeaveList from "./components/studentLeaves/List";
import AddStudentLeave from "./components/studentLeaves/Add";
import StudentLeaveDetails from "./components/studentLeaves/Details";
import StudentLeaveTable from "./components/studentLeaves/Table";

// Salary Components
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";

// Attendance Components (Employee & Student)
import Attendance from "./components/attendance/Attendance";
import AttendanceReport from "./components/attendance/AttendanceReport";
import StudentAttendance from "./components/attendance/StudentAttendance";
import StudentAttendanceReport from "./components/attendance/StudentAttendanceReport";
import ViewStudentAttendance from "./components/attendance/ViewStudentAttendance";

// Settings Component
import Setting from "./components/EmployeeDashboard/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />

        {/* --- ADMIN DASHBOARD ROUTES --- */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          {/* Main Dashboard Summary */}
          <Route index element={<AdminSummary />} />

          {/* Department Management */}
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="department/:id" element={<EditDepartment />} />

          {/* Academic Management (NEW) */}
          <Route path="classes" element={<Classes />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="exam-sessions" element={<ExamSessions />} />

          {/* Employee Management */}
          <Route path="employees" element={<EmployeeList />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="employees/:id" element={<ViewEmployee />} />
          <Route path="employees/edit/:id" element={<EditEmployee />} />

          {/* Student Management */}
          <Route path="students" element={<StudentList />} />
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/:id" element={<ViewStudent />} />
          <Route path="students/edit/:id" element={<EditStudent />} />

          {/* Employee Leaves */}
          <Route path="leaves" element={<LeaveList />} />
          <Route path="leaves/:id" element={<LeaveDetail />} />

          {/* Student Leaves */}
          <Route path="student-leaves" element={<StudentLeaveTable />} />
          <Route path="student-leaves/:id" element={<StudentLeaveDetails />} />

          {/* Employee Salary */}
          <Route path="salary/add" element={<AddSalary />} />
          <Route path="employees/salary/:id" element={<ViewSalary />} />

          {/* Employee Attendance */}
          <Route path="attendance" element={<Attendance />} />
          <Route path="attendance-report" element={<AttendanceReport />} />

          {/* Student Attendance */}
          <Route path="student-attendance" element={<StudentAttendance />} />
          <Route
            path="student-attendance-report"
            element={<StudentAttendanceReport />}
          />

          {/* Admin Settings */}
          <Route path="settings" element={<Setting />} />
        </Route>

        {/* --- EMPLOYEE DASHBOARD ROUTES --- */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route path="profile/:id" element={<ViewEmployee />} />

          {/* Marks Entry Spreadsheet (NEW) */}
          <Route path="marks-entry" element={<MarksEntry />} />

          <Route path="leaves/:id" element={<LeaveList />} />
          <Route path="add-leave" element={<AddLeave />} />
          <Route path="salary/:id" element={<ViewSalary />} />
          <Route path="setting" element={<Setting />} />
        </Route>

        {/* --- STUDENT DASHBOARD ROUTES --- */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["student"]}>
                <StudentDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route path="profile/:id" element={<ViewStudent />} />

          {/* Grades & Report Card (NEW) */}
          <Route path="results" element={<MarksView />} />
          <Route path="results/:id" element={<MarksView />} />
          <Route path="leaves/:id" element={<StudentLeaveList />} />
          <Route path="add-leave" element={<AddStudentLeave />} />
          <Route path="attendance/:id" element={<ViewStudentAttendance />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
