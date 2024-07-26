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



        {/* Add other routes as needed */}
        <Route path="/" element={<Navigate to="/welcome-page" />} /> 
      </Routes>
    </Router>
    

  );
}

export default App;