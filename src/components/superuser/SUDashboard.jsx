import { Link, useNavigate } from 'react-router-dom';
import { removeToken, getToken } from '../../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faBell, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Card, Col, Container, Row, ListGroup } from 'react-bootstrap';
import '../../App.css';

const NoticeBoard = ({ notices }) => (
    <Card className="mb-4 shadow-sm border-primary">
        <Card.Header className="bg-primary text-white d-flex align-items-center">
            <FontAwesomeIcon icon={faBullhorn} className="me-2" />
            Notice Board
        </Card.Header>
        <Card.Body>
            {notices && notices.length > 0 ? (
                notices.map((notice, index) => (
                    <Card.Text key={index}>
                        <p>📅 <strong>{notice}</strong></p>
                    </Card.Text>
                ))
            ) : (
                <Card.Text>No notices available.</Card.Text>
            )}
        </Card.Body>
    </Card>
);

const NotificationBoard = ({ notifications }) => (
    <Card className="mb-4 shadow-sm border-success">
        <Card.Header className="bg-success text-white d-flex align-items-center">
            <FontAwesomeIcon icon={faBell} className="me-2" />
            Notification Board
        </Card.Header>
        <Card.Body>
            {notifications && notifications.length > 0 ? (
                notifications.map((notification, index) => (
                    <Card.Text key={index}>
                        <p>💻 <strong>{notification}</strong></p>
                    </Card.Text>
                ))
            ) : (
                <Card.Text>No notifications available.</Card.Text>
            )}
        </Card.Body>
    </Card>
);

const DepartmentsList = ({ departments }) => (
    <Card className="mt-4 shadow-sm border-info">
        <Card.Header className="bg-info text-white d-flex align-items-center">
            <FontAwesomeIcon icon={faBuilding} className="me-2" />
            Departments
        </Card.Header>
        <ListGroup variant="flush">
            {departments && departments.length > 0 ? (
                departments.map((department) => (
                    <ListGroup.Item key={department.dept_id} className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faBuilding} className="me-2 text-info" />
                        <Link to={`/department-details/${department.dept_id}`} className="text-decoration-none text-dark">
                            {department.Dept_Name}
                        </Link>
                    </ListGroup.Item>
                ))
            ) : (
                <ListGroup.Item>No departments available.</ListGroup.Item>
            )}
        </ListGroup>
    </Card>
);

const SUDashboard = () => {
    const [user, setUser] = useState(null);
    const [data, setData] = useState({ notices: [], notifications: [], departments: [] });
    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            fetchDashboardData(token);
            fetchDepartments(token);
        } else {
            window.location.href = '/login';
        }
    }, []);

    const fetchDashboardData = async (token) => {
        try {
            const response = await axios.get('http://localhost:5002/api/auth/su-dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setData(response.data);
            setUser(response.data.user); 
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };

    const fetchDepartments = async (token) => {
        try {
            const response = await axios.get('http://localhost:5002/api/auth/departments', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDepartments(response.data.departmentList);
        } catch (error) {
            console.error('Error fetching departments:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        console.log('Departments state updated:', departments);
    }, [departments]);

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    return (
        <div className='my-5'>
            <Container>
            <Row>
                <Col md={6}>
                    <NoticeBoard notices={data.notices} />
                </Col>
                <Col md={6}>
                    <NotificationBoard notifications={data.notifications} />
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <DepartmentsList departments={departments} />
                </Col>
            </Row>
            
        </Container>
        </div>
        
    );
};

export default SUDashboard;
