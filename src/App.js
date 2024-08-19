// frontend/src/App.js

import React from 'react';
import { getToken } from './utils/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SURegisterForm from './components/superuser/SURegeisterForm';
import SULinkGenerator from './components/superuser/SULinkGenerator';
import SULoginForm from './components/superuser/SULoginForm';
import SUDashboard from './components/superuser/SUDashboard';
import DepartmentUpload from './components/superuser/DepartmentUpload';
import TeacherUpload from './components/superuser/TeacherUpload';
import DeptChairmanUpload from './components/superuser/DeptChairmanUpload';
import StaffUpload from './components/superuser/StaffUpload';
import RoomUpload from './components/superuser/RoomUpload';
import SessionUpload from './components/superuser/SessionUpload';
import StudentUpload from './components/superuser/StudentUpload';
import ExamYearUpload from './components/superuser/ExamYearUpload';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import SUForgotPassword from './components/superuser/SUForgotPassword';
import SUResetPassword from './components/superuser/SUResetPassword';
import WelcomePage from './pages/WelcomePage';
import AboutUs from './pages/AboutUs';
import SyllabusUpload from './components/superuser/SyllabusUpload';
import SyllabusUploadTest from './components/superuser/SyllabusUploadTest';
import SyllabusFilter from './components/user/SyllabusFilter';
import CourseDataDisplay from './components/superuser/CourseDataDisplay';
import ScheduleGenerator from './components/Routine/ScheduleGenerator';
import ScheduleViewer from './components/Routine/ScheduleViewer';
import HolidaysUpload from './components/superuser/HolidaysUpload';
import HolidayList from './components/superuser/HolidayList';
import ScheduleWithHolidays from './components/user/ScheduleWithHolidays';
import ScheduleViewerAsUser from './components/user/ScheduleViewerAsUser';
import UploadTeacherImage from './components/teacher/UPloadTeacherImage';
import TeacherList from './components/teacher/TeacherList';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import TeacherHomePage from './pages/teacher/TeacherHomePage';
import TeacherNavbar from './components/teacher/TeacherNavbar';
import SUNavbar from './components/superuser/SUNavbar';
import SUHomePage from './pages/superuser/SUHomePage';
import StudentHomePage from './pages/student/StudentHomePage'
import StaffHomePage from './pages/staff/StaffHomePage'
import FileUploadPage from './pages/superuser/FileUploadPage';
import DepartmentDetails from './components/department/DepartmentDetails';
import DepartmentDetailsPage from './pages/superuser/DepartmentDetailsPage';
import TeacherProfilePage from './pages/teacher/TeacherProfilePage';
import EditRoomPage from './pages/superuser/EditRoomPage';
import EditStaffProfilePage from './pages/superuser/EditStaffProfilePage';
import SessionDetailsPage from './pages/superuser/SessionDetailsPage';
import StudentUpdatePage from './pages/superuser/StudentUpdatePage';
import ExamYearDetailsPage from './pages/superuser/ExamYearDetailsPage';
const PrivateRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/su-login" />;
};


function App() {

  return (
    <Router>
    
      <Routes>
        <Route path="/welcome-page" element={<WelcomePage />} />
        <Route path="/about-us" element={<AboutUs />} />

        <Route path="/su-generate-link" element={<SULinkGenerator />} />
        <Route path="/su-register/:token" element={<SURegisterForm />} />
        <Route path="/su-login" element={<SULoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/su-dashboard" element={<PrivateRoute><SUDashboard /></PrivateRoute>}/>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/upload-holidays" element={<HolidaysUpload/>}/>
        <Route path="/view-holidays" element={<HolidayList/>}/>

        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/su-forgot-password" element={<SUForgotPassword />} />
        <Route path="/su-reset-password/:token" element={<SUResetPassword />} />


        <Route path="/upload-department" element={<DepartmentUpload/>} /> 
        <Route path="/upload-teacher" element={<TeacherUpload/>}/>
        <Route path="/upload-staff" element={<StaffUpload/>}/>
        <Route path="/upload-room" element={<RoomUpload/>}/>
        <Route path="/upload-department-chairman" element={<DeptChairmanUpload/>}/>
        <Route path="/upload-session" element={<SessionUpload/>}/>
        <Route path="/upload-student" element={<StudentUpload/>}/>
        <Route path="/upload-exam-year" element={<ExamYearUpload/>}/>
        <Route path="/upload-syllabus" element={<SyllabusUpload/>}/>
        <Route path="/upload-syllabus-test" element={<SyllabusUploadTest/>}/>
        <Route path="/filter-syllabus" element={<SyllabusFilter/>}/>
        <Route path="/course-data" element={<CourseDataDisplay/>}/>

        <Route path="/generate-routine" element={<ScheduleGenerator/>}/>

        <Route path="/upload-teacher-image/:teacher_id" element={<UploadTeacherImage/>}/>
        <Route path="/teacher-list" element={<TeacherList/>}/>
        <Route path="/teacher-dashboard" element={<PrivateRoute><TeacherDashboard /></PrivateRoute>}/>
        <Route path="/student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>}/>
        <Route path="/staff-dashboard" element={<PrivateRoute><StaffDashboard /></PrivateRoute>}/>
        <Route path="/su-navbar" element={<PrivateRoute><SUNavbar /></PrivateRoute>}/>
        <Route path="/teacher-navbar" element={<PrivateRoute><TeacherNavbar /></PrivateRoute>}/>
        <Route path="/teacher-homepage" element={<PrivateRoute><TeacherHomePage /></PrivateRoute>}/>
        <Route path="/su-homepage" element={<PrivateRoute><SUHomePage /></PrivateRoute>}/>
        <Route path="/student-homepage" element={<PrivateRoute><StudentHomePage /></PrivateRoute>}/>
        <Route path="/staff-homepage" element={<PrivateRoute><StaffHomePage /></PrivateRoute>}/>
        <Route path="/su-upload-files" element={<PrivateRoute><FileUploadPage /></PrivateRoute>}/>
        <Route path="/department-details/:dept_id" element={<DepartmentDetailsPage />} />
        <Route path="/teacher-profile/:teacher_id" element={<PrivateRoute><TeacherProfilePage/></PrivateRoute>}/>
        <Route path="/edit-room/:room_id" element={<PrivateRoute><EditRoomPage/></PrivateRoute>}/>
        <Route path="/edit-staff-profile/:staff_id" element={<PrivateRoute><EditStaffProfilePage/></PrivateRoute>}/>
        <Route path="/session-details/:session_id" element={<PrivateRoute><SessionDetailsPage/></PrivateRoute>}/>
        <Route path="/student-update/:student_id" element={<PrivateRoute><StudentUpdatePage/></PrivateRoute>}/>

        <Route path="/examyear-details/:exam_year_id" element={<PrivateRoute><ExamYearDetailsPage/></PrivateRoute>}/>

        <Route path="/view-routine" element={<ScheduleViewer/>}/>
        <Route path="/view-calendar-as-user" element={<ScheduleWithHolidays/>}/>
        <Route path="/view-routine-as-user" element={<ScheduleViewerAsUser/>}/>


        {/* Add other routes as needed */}
        <Route path="/" element={<Navigate to="/welcome-page" />} /> 
      </Routes>
    </Router>
    

  );
}

export default App;