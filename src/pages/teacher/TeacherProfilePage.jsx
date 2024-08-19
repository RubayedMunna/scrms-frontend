import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import TeacherProfile from '../../components/teacher/TeacherProfile';
import TeacherNavbar from '../../components/teacher/TeacherNavbar';
import StudentNavbar from '../../components/student/StudentNavbar';
import SUNavbar from '../../components/superuser/SUNavbar';
import StaffNavbar from '../../components/staff/StaffNavbar';

function TeacherProfilePage() {
    const [navbar, setNavbar] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                switch (decoded.role) {
                    case 'SuperUser':
                        setNavbar(<SUNavbar />);
                        break;
                    case 'Teacher':
                        setNavbar(<TeacherNavbar />);
                        break;
                    case 'Student':
                        setNavbar(<StudentNavbar />);
                        break;
                    case 'Staff':
                        setNavbar(<StaffNavbar />);
                        break;
                    default:
                        navigate('/login');
                        return;
                }
            } catch (error) {
                console.error('Token decoding failed:', error);
                navigate('/login');
                return;
            }
        } else {
            navigate('/login');
            return;
        }
    }, [navigate]);

    if (!navbar) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {navbar}
            <TeacherProfile />
        </div>
    );
}

export default TeacherProfilePage;
