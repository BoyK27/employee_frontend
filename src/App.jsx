import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import StudentDashboard from "./pages/StudentDashboard"; // Imported Student Dashboard

import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";

// Admin & Shared Components
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/departments/DepartmentList";
import AddDepartment from "./components/departments/AddDepartment";
import EditDepartment from "./components/departments/EditDepartment";

// Employee Components
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";

// Student Components (Ensure file paths match your project directory)
import StudentList from "./components/student/List";
import AddStudent from "./components/student/Add";
import ViewStudent from "./components/student/View";
import EditStudent from "./components/student/Edit";
import StudentSummary from "./components/StudentDashboard/Summary";
import StudentLeaveList from "./components/studentLeave/StudentLeaveList";
import AddStudentLeave from "./components/studentLeave/AddStudentLeave";
import StudentLeaveDetails from "./components/studentLeave/StudentLeaveDetails";
import StudentAttendanceReport from "./components/studentLeaves/Details";

// Leave & Attendance Components
import LeaveList from "./components/leaves/List";
import AddLeave from "./components/leaves/Add";
import Table from "./components/leaves/Table";
import Details from "./components/leaves/Details";
import Setting from "./components/EmployeeDashboard/Settings";
import Attendance from "./components/attendance/Attendance";
import AttendanceReport from "./components/attendance/AttendanceReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />

        {/* =========================================================
            ADMIN DASHBOARD ROUTES
           ========================================================= */}
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
          <Route index element={<AdminSummary />} />

          {/* Departments */}
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="department/:id" element={<EditDepartment />} />

          {/* Employees */}
          <Route path="employees" element={<List />} />
          <Route path="add-employee" element={<Add />} />
          <Route path="employees/:id" element={<View />} />
          <Route path="employees/edit/:id" element={<Edit />} />
          <Route path="employees/salary/:id" element={<ViewSalary />} />
          <Route path="employees/leaves/:id" element={<LeaveList />} />

          {/* Students (Admin Management) */}
          <Route path="students" element={<StudentList />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="students/:id" element={<ViewStudent />} />
          <Route path="students/edit/:id" element={<EditStudent />} />

          {/* Salary */}
          <Route path="salary/add" element={<AddSalary />} />

          {/* Employee Leaves */}
          <Route path="leaves" element={<Table />} />
          <Route path="leaves/:id" element={<Details />} />

          {/* Student Leaves */}
          <Route path="student-leaves" element={<StudentLeaveList />} />
          <Route path="student-leaves/:id" element={<StudentLeaveDetails />} />

          {/* Attendance */}
          <Route path="attendance" element={<Attendance />} />
          <Route path="attendance-report" element={<AttendanceReport />} />

          {/* Settings */}
          <Route path="settings" element={<Setting />} />
        </Route>

        {/* =========================================================
            EMPLOYEE DASHBOARD ROUTES
           ========================================================= */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin", "employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<LeaveList />} />
          <Route path="profile/:id" element={<View />} />
          <Route path="leaves/:id" element={<LeaveList />} />
          <Route path="add-leave" element={<AddLeave />} />
          <Route path="salary/:id" element={<ViewSalary />} />
          <Route path="setting" element={<Setting />} />
        </Route>

        {/* =========================================================
            STUDENT DASHBOARD ROUTES
           ========================================================= */}
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
          <Route index element={<StudentSummary />} />
          <Route path="profile/:id" element={<ViewStudent />} />
          <Route path="leaves" element={<StudentLeaveList />} />
          <Route path="add-leave" element={<AddStudentLeave />} />
          <Route path="attendance" element={<StudentAttendanceReport />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
